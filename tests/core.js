describe("core", function () {

    describe("VERSION", function () {

        it("should be a string of numbers", function () {

            chai.assert.isDefined(ARIA.VERSION);
            chai.assert.isTrue((/^\d+(\.\d+)+$/).test(ARIA.VERSION));

        });

        it("should not be changable", function () {

            var version = ARIA.VERSION;
            var different = "abc";

            ARIA.VERSION = different;

            chai.assert.notEqual(ARIA.VERSION, different);
            chai.assert.equal(ARIA.VERSION, version);

        });

    });

    describe("extend", function () {

        it("should add methods to ARIA", function () {

            var methods = {
                doOne: function () { return 1; },
                doTwo: function () { return 2; }
            };

            chai.assert.isFalse(Object.keys(ARIA).includes("doOne"));
            chai.assert.isFalse(Object.keys(ARIA).includes("doTwo"));
            ARIA.extend(methods);
            chai.assert.isTrue(Object.keys(ARIA).includes("doOne"));
            chai.assert.isTrue(Object.keys(ARIA).includes("doTwo"));
            chai.assert.equal(ARIA.doOne(), methods.doOne());
            chai.assert.equal(ARIA.doTwo(), methods.doTwo());

            delete ARIA.doOne;
            delete ARIA.doTwo;

        });

    });

    describe("extendHidden", function () {

        it("should add hidden methods to ARIA", function () {

            var methods = {
                doOne: function () { return 1; },
                doTwo: function () { return 2; }
            };

            chai.assert.isFalse(Object.keys(ARIA).includes("doOne"));
            chai.assert.isFalse(Object.keys(ARIA).includes("doTwo"));
            ARIA.extendHidden(methods);
            chai.assert.isFalse(Object.keys(ARIA).includes("doOne"));
            chai.assert.isFalse(Object.keys(ARIA).includes("doTwo"));
            chai.assert.equal(ARIA.doOne(), methods.doOne());
            chai.assert.equal(ARIA.doTwo(), methods.doTwo());

            delete ARIA.doOne;
            delete ARIA.doTwo;

        });

    });

    describe("noConflict", function () {

        var myARIA = window.ARIA;

        it("should remove ARIA from the global namespace", function () {

            chai.assert.isDefined(window.ARIA);
            ARIA.noConflict();
            chai.assert.isUndefined(window.ARIA);

            window.ARIA = myARIA;

        });

        it("should return ARIA", function () {

            var value = ARIA.noConflict();

            chai.assert.equal(value, myARIA);
            window.ARIA = myARIA;

        });

    });

});
