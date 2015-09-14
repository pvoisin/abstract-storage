var y = require("ytility");
var Path = require("path");
var Module = module.constructor;
var Bunyan = require("bunyan");


function Logger(topic, options) {
	options = y.merge({
		// Cf. https://github.com/trentm/node-bunyan#levels
		// See comments in Logger#log.
		levels: {
			trace: 10,
			notice: 20,
			information: 30,
			warning: 40,
			error: 50,
			fatal: 60
		}
	}, options);

	var self = this, own = self.own = {
		topic: topic,
		levels: options.levels,
		implementation: Bunyan.createLogger({
			name: (topic instanceof Module) ? topic.exports.name || Path.basename(topic.id, Path.extname(topic.id)) : String(topic)
		})
	};

	Object.defineProperty(own, "level", {
		enumerable: true,

		get: function() {
			return own.implementation.level();
		},

		// Current abstraction is compatible with Bunyan's implementation:
		// Cf. https://github.com/trentm/node-bunyan/blob/master/lib/bunyan.js#L239
		set: function(level) {
			if(!y.isNumber(Number(level))) {
				var levels = Object.keys(own.levels);
				if(levels.indexOf(level) < 0) {
					throw new Error("Invalid logging level: " + JSON.stringify(level));
				}
			}

			level = own.levels[level] || level;

			own.implementation.level(level);
		}
	});

	own.level = process.env.LOGGING_LEVEL || "information";

	y.expose(self, own, {
		readable: ["topic", "level"],
		writable: ["level"]
	});
}

Logger.prototype.log = function log(level/*, ... */) {
	var self = this, own = self.own;

	level = own.levels[level] || level;

	// LIMITATION: currently, we should somehow map Bunyan's default levels to be able to call any defined emitter...
	// Cf. https://github.com/trentm/node-bunyan/issues/228
	return own.implementation[Bunyan.nameFromLevel[level]].apply(own.implementation, y.slice(arguments, 1));
};


module.exports = Logger;