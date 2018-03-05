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

        it("should remove an attribute with null or undefined", function () {

            var div = document.createElement("div");
            div.setAttribute("aria-busy", true);
            div.setAttribute("aria-checked", true);
            div.setAttribute("aria-hidden", true);

            chai.assert.isTrue(div.hasAttribute("aria-busy"));
            chai.assert.isTrue(div.hasAttribute("aria-checked"));
            chai.assert.isTrue(div.hasAttribute("aria-hidden"));

            ARIA.remove(div, "busy");
            ARIA.remove(div, "checked", null);
            ARIA.remove(div, "hidden", undefined);

            chai.assert.isFalse(div.hasAttribute("aria-busy"));
            chai.assert.isFalse(div.hasAttribute("aria-checked"));
            chai.assert.isFalse(div.hasAttribute("aria-hidden"));

        });

        it("should remove an attribute from an object", function () {

            var div = document.createElement("div");
            div.setAttribute("aria-busy", true);
            div.setAttribute("aria-checked", true);

            chai.assert.isTrue(div.hasAttribute("aria-busy"));
            chai.assert.isTrue(div.hasAttribute("aria-checked"));

            ARIA.remove(div, {
                busy: null,
                checked: undefined
            });

            chai.assert.isFalse(div.hasAttribute("aria-busy"));
            chai.assert.isFalse(div.hasAttribute("aria-checked"));

        });

        it("should remove an attribute from a function", function () {

            var div = document.createElement("div");
            div.setAttribute("aria-busy", true);
            div.setAttribute("aria-checked", true);
            div.setAttribute("aria-hidden", true);
            div.setAttribute("aria-disabled", true);
            div.setAttribute("aria-grabbed", true);
            div.setAttribute("aria-invalid", true);

            chai.assert.isTrue(div.hasAttribute("aria-busy"));
            chai.assert.isTrue(div.hasAttribute("aria-checked"));
            chai.assert.isTrue(div.hasAttribute("aria-hidden"));
            chai.assert.isTrue(div.hasAttribute("aria-disabled"));
            chai.assert.isTrue(div.hasAttribute("aria-grabbed"));
            chai.assert.isTrue(div.hasAttribute("aria-invalid"));

            ARIA.remove(div, "busy", function () {});
            ARIA.remove(div, "checked", function () { return null; });
            ARIA.remove(div, "hidden", function () { return undefined; });
            ARIA.remove(div, {disabled: function () {}});
            ARIA.remove(div, {grabbed: function () { return null; }});
            ARIA.remove(div, {invalid: function () { return undefined; }});

            chai.assert.isFalse(div.hasAttribute("aria-busy"), "aria-busy");
            chai.assert.isFalse(div.hasAttribute("aria-checked"), "aria-checked");
            chai.assert.isFalse(div.hasAttribute("aria-hidden"), "aria-hidden");
            chai.assert.isFalse(div.hasAttribute("aria-disabled"), "aria-disabled");
            chai.assert.isFalse(div.hasAttribute("aria-grabbed"), "aria-grabbed");
            chai.assert.isFalse(div.hasAttribute("aria-invalid"), "aria-invalid");

        });

        it("should remove part of an attribute", function () {

            var div = document.createElement("div");
            div.setAttribute("aria-controls", "a b c d e f g");
            var divC = document.createElement("div");
            divC.id = "c";
            var divF = document.createElement("div");
            divF.id = "f";

            chai.assert.equal(div.getAttribute("aria-controls"), "a b c d e f g");
            ARIA.remove(div, "controls", "a");
            chai.assert.equal(div.getAttribute("aria-controls"), "b c d e f g");
            ARIA.remove(div, "controls", function () { return "b"; });
            chai.assert.equal(div.getAttribute("aria-controls"), "c d e f g");
            ARIA.remove(div, "controls", divC);
            chai.assert.equal(div.getAttribute("aria-controls"), "d e f g");
            ARIA.remove(div, {controls: "d"});
            chai.assert.equal(div.getAttribute("aria-controls"), "e f g");
            ARIA.remove(div, {controls: function () { return "e"; }});
            chai.assert.equal(div.getAttribute("aria-controls"), "f g");
            ARIA.remove(div, {controls: function () { return divF; }});
            chai.assert.equal(div.getAttribute("aria-controls"), "g");

        });

        it("should remove the attribute if the value becomes empty", function () {

            var divs = [
                document.createElement("div"),
                document.createElement("div"),
                document.createElement("div"),
                document.createElement("div"),
                document.createElement("div"),
                document.createElement("div")
            ];
            var div = document.createElement("div");
            div.id = "a";

            divs.forEach(function (d) { d.setAttribute("aria-controls", "a"); });

            chai.assert.isTrue(divs.every(function (d) {
                return d.getAttribute("aria-controls") === "a";
            }));

            ARIA.remove(divs[0], "aria-controls", "a");
            chai.assert.isFalse(divs[0].hasAttribute("aria-controls"));
            ARIA.remove(divs[1], "aria-controls", function () { return "a"; });
            chai.assert.isFalse(divs[1].hasAttribute("aria-controls"));
            ARIA.remove(divs[2], "aria-controls", div);
            chai.assert.isFalse(divs[2].hasAttribute("aria-controls"));
            ARIA.remove(divs[3], {"aria-controls": "a"});
            chai.assert.isFalse(divs[3].hasAttribute("aria-controls"));
            ARIA.remove(divs[4], {"aria-controls": function () { return "a"; }});
            chai.assert.isFalse(divs[4].hasAttribute("aria-controls"));
            ARIA.remove(divs[5], {"aria-controls": div});
            chai.assert.isFalse(divs[5].hasAttribute("aria-controls"));

        });

        it("should not throw an error if the attribute is not set", function () {

            var div = document.createElement("div");

            chai.assert.doesNotThrow(function () {
                ARIA.remove(div, "controls");
            });
            chai.assert.doesNotThrow(function () {
                ARIA.remove(div, {controls: null});
            });

        });

    });

    describe("add", function () {

        it("should be able to add to an attribute", function () {

            var divA = document.createElement("div");
            divA.setAttribute("aria-controls", "a");
            var divD = document.createElement("div");
            divD.id = "d";
            var divG = document.createElement("div");
            divG.id = "g";

            ARIA.add(divA, "controls", "b");
            chai.assert.equal(divA.getAttribute("aria-controls"), "a b");
            ARIA.add(divA, "controls", function () { return "c"; });
            chai.assert.equal(divA.getAttribute("aria-controls"), "a b c");
            ARIA.add(divA, "controls", divD);
            chai.assert.equal(divA.getAttribute("aria-controls"), "a b c d");
            ARIA.add(divA, {controls: "e"});
            chai.assert.equal(divA.getAttribute("aria-controls"), "a b c d e");
            ARIA.add(divA, {controls: function () { return "f"; }});
            chai.assert.equal(divA.getAttribute("aria-controls"), "a b c d e f");
            ARIA.add(divA, {controls: function () { return divG; }});
            chai.assert.equal(divA.getAttribute("aria-controls"), "a b c d e f g");

        });

        it("should create an attribute if it doesn't exist", function () {

            var div = document.createElement("div");

            chai.assert.isFalse(div.hasAttribute("aria-controls"));
            ARIA.add(div, "controls", "one");
            chai.assert.equal(div.getAttribute("aria-controls"), "one");

        });

        it("should not duplicate values", function () {

            var div = document.createElement("div");

            div.setAttribute("aria-controls", "one");
            chai.assert.equal(div.getAttribute("aria-controls"), "one");
            ARIA.add(div, "controls", "one");
            chai.assert.equal(div.getAttribute("aria-controls"), "one");

        });

    });

});
