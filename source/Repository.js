var y = require("ytility");
var Store = require("./Store");


function Repository(store, options) {
	if(!(store instanceof Store)) {
		throw new Error("Invalid store: " + store);
	}

	var self = this;

	options = y.merge({
		purpose: undefined
	}, options);

	y.define(self, {
		own: {
			purpose: options.purpose,
			store: store
		},

		readable: ["purpose", "store"]
	});
}


y.merge(Repository.prototype, {
	open: function open(options, callback) {
		var self = this, own = self.own;

		callback = typeof options === "function" ? options : callback;
		options = (options === callback) ? {} : options;

		own.store.open(options, function(error) {
			callback && callback.apply(self, arguments);
		});

		return self;
	},

	close: function close(callback) {
		var self = this, own = self.own;

		own.store.close(function(error) {
			callback && callback.apply(self, arguments);
		});

		return self;
	},

	read: function read(locator, callback) {
		var self = this, own = self.own;

		own.store.read(locator, function(error, results) {
			callback && callback.apply(self, arguments);
		});

		return self;
	},

	write: function write(locator, object, callback) {
		var self = this, own = self.own;

		own.store.write(locator, object, function() {
			callback && callback.apply(self, arguments);
		});

		return self;
	}
});


module.exports = Repository;