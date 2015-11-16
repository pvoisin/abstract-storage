var y = require("ytility");
var Observable = require("./Observable");
var Store = require("./Store");


function Repository(store, options) {
	if(!(store instanceof Store)) {
		throw new Error("Invalid store: " + store);
	}

	Observable.call(this);

	options = y.merge({
		purpose: undefined
	}, options);

	var self = this, own = self.own = {
		purpose: options.purpose,
		store: store
	};

	y.expose(self, own, {
		readable: ["purpose", "store"]
	});
}

y.inherit(Repository, Observable);


Repository.prototype.open = function open(options, callback) {
	var self = this, own = self.own;

	if(typeof options === "function") {
		callback = options;
		options = {};
	}

	own.store.open(options, function(error) {
		callback && callback.apply(self, arguments);
	});

	return self;
};

Repository.prototype.close = function close(callback) {
	var self = this, own = self.own;

	own.store.close(function(error) {
		callback && callback.apply(self, arguments);
	});

	return self;
};

Repository.prototype.read = function read(locator, callback) {
	var self = this, own = self.own;

	own.store.read(locator, function(error, results) {
		callback && callback.apply(self, arguments);
	});

	return self;
};

Repository.prototype.write = function write(locator, object, callback) {
	var self = this, own = self.own;

	own.store.write(locator, object, function() {
		callback && callback.apply(self, arguments);
	});

	return self;
};


module.exports = Repository;