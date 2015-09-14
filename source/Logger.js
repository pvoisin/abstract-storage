var y = require("ytility");
var Bunyan = require("bunyan");

function Logger(name, options) {
	if(typeof name !== "string") {
		throw new Error("Invalid name: " + name);
	}

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

	var self = y.define(this, {
		own: y.merge({
			name: name,
			implementation: Bunyan.createLogger({name: name})
		}, options),

		readable: ["name"]
	});

	var own = self.own;

	Object.defineProperty(self, "level", {
		get: function() {
			return own.implementation.level();
		},

		// Current abstraction is compatible with Bunyan's implementation:
		// Cf. https://github.com/trentm/node-bunyan/blob/master/lib/bunyan.js#L239
		set: function(level) {
			var levels = Object.keys(own.levels);
			if(levels.indexOf(level) < 0) {
				throw new Error("Available log levels: %s", levels);
			}

			own.implementation.level(level);
		}
	});
}

y.extend(Logger.prototype, {
	log: function log(level, record) {
		var self = this, own = self.own;

		if(arguments.length < 2) {
			record = level;
			level = "information";
		}

		level = own.levels[level] || level;

		// LIMITATION: currently, we should somehow map Bunyan's default levels to be able to call any defined emitter...
		// Cf. https://github.com/trentm/node-bunyan/issues/228
		return own.implementation[Bunyan.nameFromLevel[level]].call(own.implementation, record);
	}
});


module.exports = Logger;