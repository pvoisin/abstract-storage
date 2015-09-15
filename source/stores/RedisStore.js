var URL = require("unified-resource-identifier");
var y = require("ytility");
var Flow = require("async");
var Redis = require("redis");
var Store = require("../Store");

var Logger = require("../Logger");
var logger = RedisStore.logger = new Logger("RedisStore");


function RedisStore(locator, options) {
	var self = this;

	if(y.isObject(locator)) {
		options = locator;
		locator = "redis://localhost:6379";
	}

	options = y.merge({
		id: "default"
	}, options);

	y.define(self, {
		own: {
			id: options.id,
			client: undefined,
			locator: new URL(locator)
		},

		readable: ["id", "client", "locator"]
	});
/* TODO:
  var redis = require('redis')
    .createClient(parsed.port, parsed.hostname, parsed.query);

  if (parsed.password) {
    redis.auth(parsed.password, function(err) {
      if (err) throw err;
    });
  }

  parsed.password = (parsed.auth || '').split(':')[1];
  parsed.path = (parsed.pathname || '/').slice(1);
  parsed.database = parsed.path.length ? parsed.path : '0';
//*/
}

y.inherit(RedisStore, Store);

y.extend(RedisStore.prototype, {
	"open": function open(options, callback) {
		var self = this, own = self.own;

		callback = y.isFunction(options) ? options : callback;
		options = (options === callback) ? {} : options;

		options = y.merge({
			database: own.database
		}, options);

		own.database = options.database;

		// Cf. https://github.com/mranney/node_redis#rediscreateclient
		own.client = Redis.createClient(options)
			.on("connect", function() {
				if(own.database) {
					client.send_anyway = true;
					client.select(own.database);
					client.send_anyway = false;
				}

				callback && callback.call(self, null, client);
			})
			.on("error", function(error) {
				logger.log("error", error.stack);
// :TODO: Can we detect errors relative to connection only?
// Cf. https://github.com/mranney/node_redis#error
//				callback && callback.call(self, error);
			});

		return self;
	},

	"close": function close(callback) {
		var self = this, own = self.own;

		callback && own.client.once("end", function() {
			callback.call(self);
		});

		own.client.end();

		return self;
	},

	"read": function read(key, callback) {
		var self = this, own = self.own;

		Flow.waterfall(
			[
				function getType(proceed) {
					own.client.type(key, function(error, results) {
						proceed(error, results);
					});
				},

				function getValue(type, proceed) {
					var command = (type !== "hash") ? "get" : "hgetall";

					own.client[command](key, function(error, results) {
						proceed(error, results);
					});
				}
			],

			function finalize(error, results) {
				if(error) {
					logger.log("error", error);
				}

				callback && callback.apply(self, arguments);
			}
		);

		return self;
	},

	"write": function write(key, value, callback) {
		var self = this, own = self.own;
		var command = (typeof value !== "object") ? "set" : "hmset";

		own.client[command](key, value, function(error, results) {
			if(error) {
				logger.log("error", error);
			}

			callback && callback.apply(self, arguments);
		});

		return self;
	}
});


module.exports = RedisStore;