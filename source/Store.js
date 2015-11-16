var Observable = require("./Observable");
var y = require("ytility");


function Store() {
	// Disallow instantiation...
	if(this.constructor === Store) {
		throw new Error("Abstract!");
	}

	Observable.call(this);
}

y.inherit(Store, Observable);

y.merge(Store.prototype, {
	open: throwNotImplemented,
	close: throwNotImplemented,
	read: throwNotImplemented,
	write: throwNotImplemented
});

function throwNotImplemented() {
	throw new Error("Not implemented!");
}


module.exports = Store;