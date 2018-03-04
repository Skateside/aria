describe("aria", function () {

    function makeId() {
        return "id-" + Math.floor(Date.now() * Math.random());
    }

    describe("set", function () {

        it("should set the value of an attribute", function () {

            var div = document.createElement("div");
            var div2 = document.createElement("div");
            var divs = [
                document.createElement("div"),
                document.createElement("div")
            ];

            chai.assert.isNull(div.getAttribute("aria-busy"));
            chai.assert.isNull(div.getAttribute("aria-label"));
            chai.assert.isNull(div.getAttribute("aria-controls"));
            chai.assert.isNull(div.getAttribute("aria-labelledby"));

            ARIA.set(div, "busy", true);
            ARIA.set(div, "label", "abc");
            ARIA.set(div, "controls", div2);
            ARIA.set(div, "labelledby", divs);

            chai.assert.equal(div.getAttribute("aria-busy"), "true");
            chai.assert.equal(div.getAttribute("aria-label"), "abc");
            chai.assert.equal(div.getAttribute("aria-controls"), div2.id);
            chai.assert.equal(
                div.getAttribute("aria-labelledby"),
                divs.map(function (div) { return div.id; }).join(" ")
            );

        });

        it("should be able set set value by function", function () {

            var div = document.createElement("div");
            div.setAttribute("aria-label", "abc");
            var element;
            var value;
            var attribute;

            ARIA.set(div, "label", function (e, v, a) {

                element = e;
                value = v;
                attribute = a;

                return v.toUpperCase() + "__" + a;

            });

            chai.assert.equal(element, div);
            chai.assert.equal(value, "abc");
            chai.assert.equal(attribute, "aria-label");
            chai.assert.equal(div.getAttribute("aria-label"), "ABC__aria-label");

        });

        it("should be able to set multiple attributes", function () {

            var div = document.createElement("div");
            div.setAttribute("aria-checked", true);
            var div2 = document.createElement("div");
            var divs = [
                document.createElement("div"),
                document.createElement("div")
            ];

            chai.assert.isNull(div.getAttribute("aria-busy"));
            chai.assert.isNull(div.getAttribute("aria-label"));
            chai.assert.isNull(div.getAttribute("aria-controls"));
            chai.assert.isNull(div.getAttribute("aria-labelledby"));
            chai.assert.equal(div.getAttribute("aria-checked"), "true");

            ARIA.set(div, {
                busy: true,
                label: "abc",
                controls: div2,
                labelledby: divs,
                checked: function (element, value, attribute) {
                    return value !== "true";
                }
            });

            chai.assert.equal(div.getAttribute("aria-busy"), "true");
            chai.assert.equal(div.getAttribute("aria-label"), "abc");
            chai.assert.equal(div.getAttribute("aria-controls"), div2.id);
            chai.assert.equal(
                div.getAttribute("aria-labelledby"),
                divs.map(function (div) { return div.id; }).join(" ")
            );
            chai.assert.equal(div.getAttribute("aria-checked"), "false");

        });

    });

    describe("get", function () {

        it("should be able to get a value", function () {

            var div = document.createElement("div");
            div.setAttribute("aria-busy", true);
            div.setAttribute("aria-label", "abc");
            div.setAttribute("aria-hidden", "");

            chai.assert.equal(ARIA.get(div, "busy"), "true");
            chai.assert.equal(ARIA.get(div, "label"), "abc");
            chai.assert.equal(ARIA.get(div, "hidden"), "");

        });

        it("should return null if the attribute is not set", function () {

            var div = document.createElement("div");

            chai.assert.isNull(ARIA.get(div, "checked"));

        });

    });

    describe("getRef", function () {

        it("should return an array even if there is no attribute", function () {

            var div = document.createElement("div");
            div.setAttribute("aria-controls", "one two");

            chai.assert.isArray(ARIA.getRef(div, "controls"));
            chai.assert.isArray(ARIA.getRef(div, "labelledby"));

        });

        it("should return an array containing elements", function () {

            var div = document.createElement("div");
            var divs = [
                document.createElement("div"),
                document.createElement("div")
            ];
            var idStem = makeId();
            divs.forEach(function (d, i) {
                d.id = idStem + "-" + i;
                document.body.appendChild(d);
            });
            div.setAttribute(
                "aria-controls",
                divs.map(function (d) { return d.id }).join(" ")
            );
            var getRef = ARIA.getRef(div, "controls");

            chai.assert.isArray(getRef);
            chai.assert.isTrue(
                getRef.every(function (r) { return r instanceof HTMLElement; })
            );
            chai.assert.deepEqual(divs, getRef);

            divs.forEach(function (d) {
                document.body.removeChild(d);
            });

        });

        it("should return an array with null if the reference isn't found", function () {

            var div = document.createElement("div");
            var id = makeId();
            div.setAttribute("aria-controls", id);
            var getRef = ARIA.getRef(div, "controls");

            chai.assert.isArray(getRef);
            getRef.forEach(function (ref) {
                chai.assert.isNull(ref);
            });

        });

        it("should remove duplicate references from the results", function () {

            var div = document.createElement("div");
            var id = makeId();
            div.setAttribute("aria-controls", id + " " + id);
            var getRef = ARIA.getRef(div, "controls");

            chai.assert.isArray(getRef);
            chai.assert.equal(getRef.length, 1);

        });

    });

    describe("has", function () {

        it("should check whether or not an element has an attribute", function () {

            var div = document.createElement("div");
            div.setAttribute("aria-busy", true);

            chai.assert.isTrue(ARIA.has(div, "busy"));
            chai.assert.isFalse(ARIA.has(div, "checked"));

        });

    });

    describe("hasRef", function () {

        it("should return true only if all references exist", function () {

            var div1 = document.createElement("div");
            var div2 = document.createElement("div");
            div2.id = makeId();
            document.body.appendChild(div2);
            div1.setAttribute("aria-controls", div2.id);
            div1.setAttribute("aria-labelledby", div2.id + " " + makeId());

            chai.assert.isTrue(ARIA.hasRef(div1, "controls"));
            chai.assert.isFalse(ARIA.hasRef(div1, "labelledby"));

            document.body.removeChild(div2);

        });

        it("should return false if the attribute is not set", function () {

            chai.assert.isFalse(ARIA.hasRef(
                document.createElement("div"),
                "controls"
            ));

        });

    });

    describe("remove", function () {

        it("should remove an attribute", function () {
            chai.assert.isTrue(false, "Write these tests");
        });

        it("should remove part of an attribute", function () {
            chai.assert.isTrue(false, "Write these tests");
        });

        it("should not throw an error if the attribute is not set", function () {
            chai.assert.isTrue(false, "Write these tests");
        });

    });

});
