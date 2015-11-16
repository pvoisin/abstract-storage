var EventEmitter = require("events").EventEmitter;
var Observable = require("../../../source/Observable");
var Store = require("../../../source/Store");

var expect = require("expect.js");
var y = require("ytility");


describe("Store", function() {
	describe("constructor", function() {
		it("should throw an error since Store is abstract", function() {
			var instantiation = function() {
				new Store();
			};

			expect(instantiation).to.throwError(/^Abstract/);
		});
	});

	["open", "close", "read", "write"].forEach(function(abstractMethod) {
		describe("#" + abstractMethod, function() {
			it("should throw an error since it is abstract", function() {
				function DummyStore() {
					Store.call(this);
				}

				y.inherit(DummyStore, Store);
				var store = new DummyStore();

				expect(function() {
					store[abstractMethod]();
				}).to.throwError(/^Not implemented/);
			});
		});
	});
});