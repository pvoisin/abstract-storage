var expect = require("expect.js");

var LevelDBStore = require("../../../source/stores/LevelDBStore");
var RedisStore = require("../../../source/stores/RedisStore");


describe("LevelDBStore", function() {
	it("should work properly", function(proceed) {
		var store = new LevelDBStore();
		expect(store.id).to.be("default");

		store = new LevelDBStore({id: "coordinates"});
		expect(store.id).to.be("coordinates");

		store.open(function(error) {
			expect(error).not.to.be.a(Error);

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


describe("RedisStore", function() {
	it("should work properly", function(proceed) {
		var store = new RedisStore();
		expect(store.id).to.be("default");

		store = new LevelDBStore({id: "coordinates"});
		expect(store.id).to.be("coordinates");

		store.open(function(error) {
			expect(error).not.to.be.a(Error);

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