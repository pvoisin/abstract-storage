var y = require("ytility");
var Level = {open: require("level")};
var Store = require("../Store");

var Logger = require("../Logger");
var logger = LevelDBStore.logger = new Logger("LevelDBStore");


function LevelDBStore(options) {
	var self = this;

	options = y.merge({
		id: "default",
		folder: ".data"
	}, options);

	y.define(self, {
		own: {
			id: options.id,
			folder: options.folder,
			path: options.folder + "/" + options.id,
			database: undefined
		},

		readable: ["id", "path", "database"]
	});
}

y.inherit(LevelDBStore, Store);

y.extend(LevelDBStore.prototype, {
	open: function open(options, callback) {
		var self = this, own = self.own;

		callback = y.isFunction(options) ? options : callback;
		options = (options === callback) ? {} : options;

		// Available options: https://github.com/level/levelup#options
		options = y.extend({
			valueEncoding: "json"
		}, options);

		// Cf. https://github.com/level/levelup#leveluplocation-options-callback
		own.database = Level.open(own.path, options, function(error) {
			if(error) {
				logger.log("error", error);
			}

			callback && callback.call(self, error, own.database);
		});

		return self;
	},

	close: function close(callback) {
		var self = this, own = self.own;

		// Cf. https://github.com/level/leveldown#leveldownclosecallback
		own.database.close(function(error) {
			if(error) {
				logger.log("error", error);
			}

			callback && callback.apply(self);
		});

		return self;
	},

	read: function read(key, callback) {
		var self = this, own = self.own;

		// Cf. https://github.com/level/leveldown#leveldowngetkey-options-callback
		own.database.get(key, function(error, value) {
			if(error) {
				logger.log("error", error);
			}

			callback && callback.apply(self, arguments);
		});

		return self;
	},

	write: function write(key, value, callback) {
		var self = this, own = self.own;

		// Cf. https://github.com/level/leveldown#leveldownputkey-value-options-callback
		own.database.put(key, value, function(error) {
			if(error) {
				logger.log("error", error);
			}

			callback && callback.apply(self, arguments);
		});

		return self;
	}
});


module.exports = LevelDBStore;