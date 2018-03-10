describe("chain", function () {

    it("should return an object with the ARIA methods", function () {

        var originalKeys = Object.keys(ARIA).sort(function (a, b) {
            return a.localeCompare(b);
        });
        var chainKeys = Object.keys(ARIA.chain()).sort(function (a, b) {
            return a.localeCompare(b);
        });

        chai.assert.isObject(ARIA.chain());
        chai.assert.deepEqual(originalKeys, chainKeys);

    });

    it("should work with a single element", function () {

        var div = document.createElement("div");

        ARIA.chain(div)
            .makeFocusable()
            .identify()
            .set("busy", true);

        chai.assert.equal(div.getAttribute("tabindex"), "-1");
        chai.assert.isString(div.id);
        chai.assert.isTrue(div.id.startsWith("anonymous-element-"));
        chai.assert.equal(div.getAttribute("aria-busy"), "true");

    });

    it("should work with a collection of elements", function () {

        var divs = [
            document.createElement("div"),
            document.createElement("div")
        ];

        ARIA.chain(divs)
            .makeFocusable()
            .identify()
            .set("busy", true);

        chai.assert.equal(divs[0].getAttribute("tabindex"), "-1");
        chai.assert.isString(divs[0].id);
        chai.assert.isTrue(divs[0].id.startsWith("anonymous-element-"));
        chai.assert.equal(divs[0].getAttribute("aria-busy"), "true");
        chai.assert.equal(divs[1].getAttribute("tabindex"), "-1");
        chai.assert.isString(divs[1].id);
        chai.assert.isTrue(divs[1].id.startsWith("anonymous-element-"));
        chai.assert.equal(divs[1].getAttribute("aria-busy"), "true");

    });

    it("should return properties unchanged", function () {

        chai.assert.equal(ARIA.VERSION, ARIA.chain().VERSION);
        chai.assert.deepEqual(
            Object.getOwnPropertyDescriptor(ARIA, "VERSION"),
            Object.getOwnPropertyDescriptor(ARIA.chain(), "VERSION"),
        );

    });

});
