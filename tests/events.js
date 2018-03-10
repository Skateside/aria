describe("events", function () {

    describe("addEventListener", function () {

        it("should allow an event to be bound to an element", function () {

            var test = false;
            var div = document.createElement("div");
            ARIA.addEventListener(div, "test", function () {
                test = true;
            });

            chai.assert.isFalse(test);
            div.dispatchEvent(new CustomEvent("test", {
                bubbles: true,
                cancelable: true
            }));
            chai.assert.isTrue(test);

        });

        it("should pass an Event object to the handler", function () {

            var event;
            var div = document.createElement("div");
            ARIA.addEventListener(div, "test", function (e) {
                event = e;
            });

            div.dispatchEvent(new CustomEvent("test", {
                bubbles: true,
                cancelable: true
            }));
            chai.assert.equal(event.type, "test");

        });

    });

    describe("removeEventListener", function () {

        it("should allow an event listener to be unbound", function () {

            var count = 0;
            var div = document.createElement("div");
            var handler = function () {
                count += 1;
            };
            div.addEventListener("test", handler);

            chai.assert.equal(count, 0);
            div.dispatchEvent(new CustomEvent("test", {
                bubbles: true,
                cancelable: true
            }));
            chai.assert.equal(count, 1);

            ARIA.removeEventListener(div, "test", handler);
            div.dispatchEvent(new CustomEvent("test", {
                bubbles: true,
                cancelable: true
            }));
            chai.assert.equal(count, 1);

        });

    });

    describe("dispatchEvent", function () {

        it("should trigger an event on a handler", function () {

            var test = false;
            var div = document.createElement("div");
            div.addEventListener("test", function () {
                test = true;
            });

            chai.assert.isFalse(test);
            ARIA.dispatchEvent(div, "test");
            chai.assert.isTrue(test);

        });

        it("should be able to pass information to the handler", function () {

            var rnd = Math.random();
            var result;
            var div = document.createElement("div");
            div.addEventListener("test", function (e) {
                result = e.detail.rnd;
            });

            ARIA.dispatchEvent(div, "test", { rnd: rnd });
            chai.assert.equal(rnd, result);

        });

    });

    describe("makeEventName", function () {

        it("should prefix the attribute", function () {
            chai.assert.equal(ARIA.makeEventName("aria-busy"), "wai-aria__aria-busy");
        });

        it("should normalise the attribute", function () {
            chai.assert.equal(ARIA.makeEventName("busy"), "wai-aria__aria-busy");
        });
        
    });

});
