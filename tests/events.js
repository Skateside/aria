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

        var prefix = ARIA.eventNamePrefix;

        it("should prefix the attribute", function () {
            chai.assert.equal(ARIA.makeEventName("aria-busy"), prefix + "aria-busy");
        });

        it("should normalise the attribute", function () {
            chai.assert.equal(ARIA.makeEventName("busy"), prefix + "aria-busy");
        });

        it("should allow us to set the prefix", function () {

            var newPrefix = btoa(Date.now() * Math.random());
            ARIA.eventNamePrefix = newPrefix;
            chai.assert.equal(ARIA.makeEventName("busy"), newPrefix + "aria-busy");
            ARIA.eventNamePrefix = prefix;

        });

    });

    describe("createMutationHandler", function () {

        it("should return a function", function () {
            chai.assert.isFunction(ARIA.createMutationHandler());
        });

    });

    describe("handleMutation", function () {

        it("should dispatch an event if a WAI-ARIA attribute changes", function () {

            var div = document.createElement("div");
            div.setAttribute("aria-busy", true);
            var isDispatched = false;
            ARIA.addEventListener(div, ARIA.makeEventName("busy"), function () {
                isDispatched = true;
            });

            chai.assert.isFalse(isDispatched);
            ARIA.handleMutation.call(div, {
                type: "attributes",
                attributeName: "aria-busy",
                oldValue: null
            });
            chai.assert.isTrue(isDispatched);

        });

        it("should not dispatch an event if there was no change", function () {

            var div = document.createElement("div");
            div.setAttribute("aria-busy", true);
            var isDispatched = false;
            ARIA.addEventListener(div, ARIA.makeEventName("busy"), function () {
                isDispatched = true;
            });

            chai.assert.isFalse(isDispatched);
            ARIA.handleMutation.call(div, {
                type: "attributes",
                attributeName: "aria-busy",
                oldValue: "true"
            });
            chai.assert.isFalse(isDispatched);

        });

    });

    describe("startListening", function () {

        it("should add a MutationObserver", function () {

            var div = document.createElement("div");

            chai.assert.isUndefined(ARIA.observerStore.get(div));
            ARIA.startListening(div);
            chai.assert.isDefined(ARIA.observerStore.get(div));
            chai.assert.isTrue(ARIA.observerStore.get(div) instanceof MutationObserver);

        });

    });

    describe("stopListening", function () {

        it("should remove the MutationObserver", function () {

            var div = document.createElement("div");
            ARIA.startListening(div);

            chai.assert.isDefined(ARIA.observerStore.get(div));
            ARIA.stopListening(div);
            chai.assert.isUndefined(ARIA.observerStore.get(div));

        });

    });

    function check(done, func) {

        try {
            func();
            done();
        } catch (ex) {
            done(ex);
        }

    }

    describe("on", function () {

        it("should listen for attribute changes", function (done) {

            var div = document.createElement("div");
            var isDispatched = false;
            ARIA.on(div, "busy", function (e) {

                isDispatched = true;

                check(done, function () {
                    chai.assert.isTrue(isDispatched);
                });

            });

            chai.assert.isFalse(isDispatched);
            div.setAttribute("aria-busy", true);

        });

        it("should pass values to the event argument", function (done) {

            var div = document.createElement("div");

            ARIA.on(div, "busy", function (e) {

                try {

                    chai.assert.isString(e.detail.attributeName);
                    chai.assert.isNull(e.detail.oldValue);
                    chai.assert.isString(e.detail.value);
                    done();

                } catch (ex) {
                    done(ex);
                }

            });

            div.setAttribute("aria-busy", true);

        });

        it("should be able to bind multiple events", function (done) {

            var div = document.createElement("div");
            var results = [false, false];

            ARIA.on(div, "busy", function () {

                results[0] = true;

                if (!results.includes(false)) {
                    done();
                }

            });
            ARIA.on(div, "busy", function () {

                results[1] = true;

                if (!results.includes(false)) {
                    done();
                }

            });

            div.setAttribute("aria-busy", true);

        });

        it("should be able to listen to multiple attributes (string)", function (done) {

            var div = document.createElement("div");
            var results = {
                "aria-busy": false,
                "aria-checked": false
            };

            ARIA.on(div, "busy checked", function (e) {

                try {

                    results[e.detail.attributeName] = true;

                    if (!Object.values(results).includes(false)) {
                        done();
                    }

                } catch (ex) {
                    done(ex);
                }

            });

            div.setAttribute("aria-busy", true);
            div.setAttribute("aria-checked", true);

        });

        it("should be able to listen to multiple attributes (array)", function (done) {

            var div = document.createElement("div");
            var results = {
                "aria-busy": false,
                "aria-checked": false
            };

            ARIA.on(div, ["busy", "checked"], function (e) {

                try {

                    results[e.detail.attributeName] = true;

                    if (!Object.values(results).includes(false)) {
                        done();
                    }

                } catch (ex) {
                    done(ex);
                }

            });

            div.setAttribute("aria-busy", true);
            div.setAttribute("aria-checked", true);

        });

        it("should be able to listen to multiple attributes (object)", function (done) {

            var div = document.createElement("div");
            var results = {
                "aria-busy": false,
                "aria-checked": false
            };
            var handler = function (e) {

                try {

                    results[e.detail.attributeName] = true;

                    if (!Object.values(results).includes(false)) {
                        done();
                    }

                } catch (ex) {
                    done(ex);
                }

            };

            ARIA.on(div, {
                busy: handler,
                checked: handler
            });

            div.setAttribute("aria-busy", true);
            div.setAttribute("aria-checked", true);

        });

    });

    describe("off", function () {

        it("should be able to remove an event", function (done) {

            var div = document.createElement("div");
            var results = {
                "aria-busy": true,
                "aria-checked": false
            };
            var handler = function (e) {

                try {

                    var attr = e.detail.attributeName;

                    results[attr] = !results[attr];

                    if (!Object.values(results).includes(false)) {
                        done();
                    }

                } catch (ex) {
                    done(ex);
                }

            };

            ARIA.on(div, "busy", handler);
            ARIA.on(div, "checked", handler);
            ARIA.off(div, "busy", handler);
            div.setAttribute("aria-busy", true);
            div.setAttribute("aria-checked", true);

        });

        it("should be able to remove multiple handlers", function () {

            var div = document.createElement("div");
            var results = {
                "aria-busy": 2,
                "aria-checked": 0
            };
            var is2 = function (value) {
                return value === 2;
            };
            var handler1 = function (e) {

                try {

                    results[e.detail.attributeName] += 1;

                    if (Object.values(results).every(is2)) {
                        done();
                    }

                } catch (ex) {
                    done(ex);
                }

            };
            var handler2 = function (e) {

                try {

                    results[e.detail.attributeName] += 1;

                    if (Object.values(results).every(is2)) {
                        done();
                    }

                } catch (ex) {
                    done(ex);
                }

            };

            ARIA.on(div, "busy", handler1);
            ARIA.on(div, "busy", handler2);
            ARIA.on(div, "checked", handler1);
            ARIA.on(div, "checked", handler2);
            ARIA.off(div, "busy", handler1);
            ARIA.off(div, "busy", handler2);

            div.setAttribute("aria-busy", true);
            div.setAttribute("aria-checked", true);

        });

        it("should be able to remove multiple events (string)", function () {

            var div = document.createElement("div");
            var results = {
                "aria-busy": 0,
                "aria-checked": 0
            };
            var is2 = function (value) {
                return value === 2;
            };
            var handler1 = function (e) {

                try {

                    results[e.detail.attributeName] += 1;

                    if (Object.values(results).every(is2)) {
                        done();
                    }

                } catch (ex) {
                    done(ex);
                }

            };
            var handler2 = function (e) {

                try {

                    results[e.detail.attributeName] += 1;

                    if (Object.values(results).every(is2)) {
                        done();
                    }

                } catch (ex) {
                    done(ex);
                }

            };

            ARIA.on(div, "busy checked", handler1);
            ARIA.on(div, "busy checked", handler2);
            ARIA.off(div, "busy checked", handler1);

            div.setAttribute("aria-busy", true);
            div.setAttribute("aria-checked", true);

        });

        it("should be able to remove multiple events (array)", function () {

            var div = document.createElement("div");
            var results = {
                "aria-busy": 0,
                "aria-checked": 0
            };
            var is2 = function (value) {
                return value === 2;
            };
            var handler1 = function (e) {

                try {

                    results[e.detail.attributeName] += 1;

                    if (Object.values(results).every(is2)) {
                        done();
                    }

                } catch (ex) {
                    done(ex);
                }

            };
            var handler2 = function (e) {

                try {

                    results[e.detail.attributeName] += 1;

                    if (Object.values(results).every(is2)) {
                        done();
                    }

                } catch (ex) {
                    done(ex);
                }

            };

            ARIA.on(div, ["busy", "checked"], handler1);
            ARIA.on(div, ["busy", "checked"], handler2);
            ARIA.off(div, ["busy", "checked"], handler1);

            div.setAttribute("aria-busy", true);
            div.setAttribute("aria-checked", true);

        });

        it("should be able to remove multiple events (object)", function () {

            var div = document.createElement("div");
            var results = {
                "aria-busy": 0,
                "aria-checked": 0
            };
            var is2 = function (value) {
                return value === 2;
            };
            var handler1 = function (e) {

                try {

                    results[e.detail.attributeName] += 1;

                    if (Object.values(results).every(is2)) {
                        done();
                    }

                } catch (ex) {
                    done(ex);
                }

            };
            var handler2 = function (e) {

                try {

                    results[e.detail.attributeName] += 1;

                    if (Object.values(results).every(is2)) {
                        done();
                    }

                } catch (ex) {
                    done(ex);
                }

            };

            ARIA.on(div, {
                busy: handler1,
                checked: handler1
            });
            ARIA.on(div, {
                busy: handler2,
                checked: handler2
            });
            ARIA.off(div, {
                busy: handler1,
                checked: handler1
            });

            div.setAttribute("aria-busy", true);
            div.setAttribute("aria-checked", true);

        });

    });

});
