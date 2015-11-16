var y = require("ytility");
var Level = {open: require("level")};
var Store = require("../Store");

var Logger = require("../Logger");
var logger = LevelDBStore.logger = new Logger("LevelDBStore");


function LevelDBStore(path, options) {
	Store.call(this);

	if(!y.isString(path)) {
		options = path;
	}

	options = y.merge({
		id: "default",
		folder: ".data"
	}, options);

	path = path || options.folder + "/" + options.id;

	var self = this, own = self.own = {
		id: options.id,
		path: options.folder + "/" + options.id,
		client: undefined
	};

	y.expose(self, own, {
		readable: ["id", "path", "client"]
	});
}

y.inherit(LevelDBStore, Store);


LevelDBStore.prototype.open = function open(options, callback) {
	var self = this, own = self.own;

	callback = y.isFunction(options) ? options : callback;
	options = (options === callback) ? {} : options;

	// Available options: https://github.com/level/levelup#options
	options = y.extend({
		valueEncoding: "json"
	}, options);

	callback && self.whether("opened", callback);

	// Cf. https://github.com/level/levelup#leveluplocation-options-callback
	own.client = Level.open(own.path, options, function(error) {
		if(error) {
			logger.log("error", error);
			return self.emit("error", error);
		}

		self.emit("opened", own.client);
	});

	return self;
};

LevelDBStore.prototype.close = function close(callback) {
	var self = this, own = self.own;

	// Cf. https://github.com/level/leveldown#leveldownclosecallback
	own.client.close(function(error) {
		if(error) {
			logger.log("error", error);
		}

		callback && callback.apply(self);
	});

	return self;
};

LevelDBStore.prototype.read = function read(key, callback) {
	var self = this, own = self.own;

	// Cf. https://github.com/level/leveldown#leveldowngetkey-options-callback
	own.client.get(key, function(error, value) {
		if(error) {
			logger.log("error", error);
		}

		callback && callback.apply(self, arguments);
	});

	return self;
};

LevelDBStore.prototype.write = function write(key, value, callback) {
	var self = this, own = self.own;

	// Cf. https://github.com/level/leveldown#leveldownputkey-value-options-callback
	own.client.put(key, value, function(error) {
		if(error) {
			logger.log("error", error);
		}

		callback && callback.apply(self, arguments);
	});

	return self;
};


module.exports = LevelDBStore;