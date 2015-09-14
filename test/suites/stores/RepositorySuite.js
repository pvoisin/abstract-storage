var expect = require("expect.js");

var Repository = require("../../../source/Repository");


describe("Repository", function() {
	var store;

	before(function() {
		var LevelDBStore = require("../../../source/stores/LevelDBStore");
		store = new LevelDBStore();
	});

	it("should work properly", function(proceed) {
		var repository = new Repository(store, {purpose: "testing"});
		expect(repository.store).to.be(store);
		expect(repository.purpose).to.be("testing");

		repository.open(function() {
			repository.write("address", {city: "Montréal"}, function() {
				repository.read("address", function(error, value) {
					expect(error).not.to.be.a(Error);
					expect(value).to.eql({city: "Montréal"});

					repository.close(proceed);
				});
			});
		});
	});
});