var URL = require("unified-resource-locator");
var y = require("ytility");
var Flow = require("async");
var Redis = require("redis");
var Store = require("../Store");

var Logger = require("../Logger");
var logger = new Logger(module);


function RedisStore(locator, options) {
	Store.call(this);

	if(!y.isString(locator)) {
		options = locator;
		locator = "redis://localhost:6379";
	}

	options = y.merge({
		id: "default"
	}, options);

	var self = this, own = self.own = {
		id: options.id,
		locator: new URL(locator),
		client: undefined
	};

	y.expose(self, own, {
		readable: ["id", "client", "locator"]
	});
}

y.inherit(RedisStore, Store);


RedisStore.prototype.open = function open(options, callback) {
	var self = this, own = self.own;

	callback = y.isFunction(options) ? options : callback;
	options = (options === callback) ? {} : options;

	options = y.merge({
		database: own.database
	}, options);

	own.database = options.database;

	callback && self.whether("opened", callback);

	// Cf. https://github.com/mranney/node_redis#rediscreateclient
	own.client = Redis.createClient(options)
		.on("connect", function() {
			if(own.database) {
				own.client.send_anyway = true;
				own.client.select(own.database, whenDataBaseSelected);
				own.client.send_anyway = false;

				function whenDataBaseSelected() {
					whenClientConnected();
				}
			}
			else {
				whenClientConnected();
			}

			function whenClientConnected() {
				own.client.once("end", function() {
					self.emit("closed");
				});

				self.emit("opened", own.client);
			}
		})
		// Cf. https://github.com/mranney/node_redis#error
		.on("error", function(error) {
			logger.log("error", error.stack);
			self.emit("error", error);
		});

	return self;
};

RedisStore.prototype.close = function close(callback) {
	var self = this, own = self.own;

	own.client.end();

	setImmediate(function() {
		callback.call(self);
	});

	return self;
};

RedisStore.prototype.read = function read(key, callback) {
	var self = this, own = self.own;

	function getType(proceed) {
		own.client.type(key, function(error, results) {
			proceed(error, results);
		});
	}

	function getValue(type, proceed) {
		var command = (type !== "hash") ? "get" : "hgetall";

		own.client[command](key, function(error, results) {
			proceed(error, results);
		});
	}

	Flow.waterfall([getType, getValue], function finalize(error, results) {
		if(error) {
			logger.log("error", error);
		}

		callback && callback.apply(self, arguments);
	});

	return self;
};

RedisStore.prototype.write = function write(key, value, callback) {
	var self = this, own = self.own;
	var command = (typeof value !== "object") ? "set" : "hmset";

	own.client[command](key, value, function(error, results) {
		if(error) {
			logger.log("error", error);
		}

		callback && callback.apply(self, arguments);
	});

	return self;
};


module.exports = RedisStore;