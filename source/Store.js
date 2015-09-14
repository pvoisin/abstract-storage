var EventEmitter = require("events").EventEmitter;
var y = require("ytility");


function Store() {
	// Disallow instantiation...
	if(this.constructor === Store) {
		throw new Error("Abstract!");
	}
}

y.inherit(Store, EventEmitter);

y.merge(Store.prototype, {
	open: missing,
	close: missing,
	read: missing,
	write: missing
});

function missing() {
	throw new Error("Not implemented!");
}

Store.NotFoundError = y.error(function NotFoundError(key) {
	this.message = "Not found:  \"" + key + "\".";
});


module.exports = Store;