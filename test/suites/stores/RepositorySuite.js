var EventEmitter = require("events").EventEmitter;
var Observable = require("../../../source/Observable");
var Repository = require("../../../source/Repository");

var expect = require("expect.js");


describe("Repository", function() {
	var store;

	before(function() {
		var LevelDBStore = require("../../../source/stores/LevelDBStore");
		store = new LevelDBStore();
	});

	describe("constructor", function() {
		var instantiation = function() {
			new Repository();
		};
		expect(instantiation).to.throwError(/^Invalid store/);
	});

	describe("#open", function() {
		it("should accept options", function(proceed) {
			var repository = new Repository(store, {purpose: "testing"});
			repository.open({}, function() {
				proceed();
			});
		});
	});

	it("should work properly", function(proceed) {
		var repository = new Repository(store, {purpose: "testing"});

		expect(repository instanceof Observable).to.be(true);
		expect(repository instanceof EventEmitter).to.be(true);

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