var EventEmitter = require("events").EventEmitter;
var Observable = require("../../../source/Observable");
var Store = require("../../../source/Store");
var LevelDBStore = require("../../../source/stores/LevelDBStore");

var expect = require("expect.js");
// https://www.npmjs.com/package/proxyquire may help to test error cases


describe("LevelDBStore", function() {
	it("should work properly", function(proceed) {
		var store = new LevelDBStore();

		expect(store instanceof Store).to.be(true);
		expect(store instanceof Observable).to.be(true);
		expect(store instanceof EventEmitter).to.be(true);

		expect(store.id).to.be("default");
		expect(store.path).to.be(".data/default");

		store = new LevelDBStore({id: "coordinates"});
		expect(store.id).to.be("coordinates");

		store.open(function(error, client) {
			expect(error).not.to.be.a(Error);
			expect(client).not.to.be(undefined);
			expect(client).to.be(store.client);

			store.write("#1", {city: "Montréal"}, function() {
				store.read("#1", function(error, value) {
					expect(error).not.to.be.a(Error);
					expect(value).to.eql({city: "Montréal"});

					store.close(proceed);
				});
			});
		});
	});
});
