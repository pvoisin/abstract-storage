var inherit = require("util").inherits;
var EventEmitter = require("events").EventEmitter;


function Observable() {
	EventEmitter.call(this);
}

inherit(Observable, EventEmitter);


Observable.prototype.notify = Observable.prototype.emit;
Observable.prototype.when = Observable.prototype.on;

Observable.prototype.whether = function whether(event, callback) {
	var self = this;

	self.once("error", callback);

	self.once(event, function() {
		self.removeListener("error", callback);
		callback.apply(null, [null].concat(Array.prototype.slice.call(arguments)));
	});
};


module.exports = Observable;