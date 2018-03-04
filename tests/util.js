describe("util", function () {

    const ATTRIBUTE = "abc";
    const NO_ATTRIBUTE = "def";
    const VALUE = "123";

    // Attributes

    describe("setDOMAttribute", function () {

        it("should set a DOM attribute", function () {

            var div = document.createElement("div");

            ARIA.setDOMAttribute(div, ATTRIBUTE, VALUE);
            chai.assert.isTrue(div.hasAttribute(ATTRIBUTE));
            chai.assert.equal(div.getAttribute(ATTRIBUTE), VALUE);

        });

    });

    describe("getDOMAttribute", function () {

        it("should get a DOM attribute", function () {

            var div = document.createElement("div");

            div.setAttribute(ATTRIBUTE, VALUE);
            chai.assert.equal(ARIA.getDOMAttribute(div, ATTRIBUTE), VALUE);

        });

        it("should return null if the attribute does not exist", function () {

            var div = document.createElement("div");

            chai.assert.isNull(ARIA.getDOMAttribute(div, NO_ATTRIBUTE));

        });

    });

    describe("hasDOMAttribute", function () {

        it("should check to see if an element has an attribute", function () {

            var div = document.createElement("div");

            div.setAttribute(ATTRIBUTE, VALUE);
            chai.assert.isTrue(ARIA.hasDOMAttribute(div, ATTRIBUTE));
            chai.assert.isFalse(ARIA.hasDOMAttribute(div, NO_ATTRIBUTE));

        });

    });

    describe("removeDOMAttribute", function () {

        it("should remove an attribute from an element", function () {

            var div = document.createElement("div");

            div.setAttribute(ATTRIBUTE, VALUE);
            chai.assert.isTrue(div.hasAttribute(ATTRIBUTE));
            ARIA.removeDOMAttribute(div, ATTRIBUTE);
            chai.assert.isFalse(div.hasAttribute(ATTRIBUTE));

        });

    });

    // Helper functions

    describe("isArrayLike", function () {

        it("should return true for array-like structures", function () {

            [
                [],
                document.querySelectorAll("a"),
                "abc",
                {"0": "zero", "1": "one", "length": 2},
                new Set()
            ].map(ARIA.isArrayLike).forEach(function (v) {
                return chai.assert.isTrue(v);
            });

        });

        it("should return false for non-array-like structures", function () {

            [
                123,
                document.querySelector("a"),
                {"0": "zero", "1": "one"}
            ].map(ARIA.isArrayLike).forEach(function (v) {
                return chai.assert.isFalse(v);
            });

        });

    });

    describe("asArray", function () {

        it("should convert array-like structures into an array", function () {

            var array = ["one", "two"];
            var set = new Set(array);
            var setArray = ARIA.asArray(set);

            [
                document.querySelectorAll("a"),
                set,
                array
            ].map(ARIA.asArray).forEach(function (v) {
                return chai.assert.isArray(v);
            });

            chai.assert.deepEqual(setArray, array);

        });

        it("should wrap non-array-like structures", function () {

            var string = "abc"; // This is NOT a mistake - it should be wrapped.
            var number = 123;
            var object = {"a": "Alpha"};
            var array = [
                string,
                number,
                object
            ];

            array
                .map(ARIA.asArray)
                .forEach(function (v, i) {
                    chai.assert.isArray(v);
                    chai.assert.deepEqual(v, [array[i]]);
                });

        });

        it("should return an empty array for null and undefined", function () {

            [
                null,
                undefined
            ].map(ARIA.asArray).forEach(function (v) {
                chai.assert.isArray(v);
                chai.assert.equal(v.length, 0);
            });

        });

    });

    describe("isNode", function () {

        it("should return true for Nodes", function () {

            var div = document.createElement("div");
            div.append(document.createElement("span"));

            chai.assert.isTrue(ARIA.isNode(div));
            chai.assert.isTrue(ARIA.isNode(div.querySelector("span")));
            chai.assert.isTrue(ARIA.isNode(document.createTextNode("a")));
            chai.assert.isTrue(ARIA.isNode(document.createComment("a")));

        });

        it("should return false for non-Nodes", function () {

            chai.assert.isFalse(ARIA.isNode({nodeName: "a", nodeType: 1}));
            chai.assert.isFalse(ARIA.isNode(null));
            chai.assert.isFalse(ARIA.isNode(document.querySelectorAll("a")));

        });

    });

    describe("asString", function () {

        it("should convert objects into strings", function () {

            var array = [
                "abc",
                123,
                {toString: function () { return "def"; }}
            ];

            array.map(ARIA.asString).forEach(function (s, i) {

                chai.assert.isString(s);
                chai.assert.equal(s, String(array[i]));

            });

        });

        it("should get Node IDs", function () {

            var array = [
                document.createElement("div"),
                document.createElement("div")
            ];
            array[0].id = "abc";

            array.map(ARIA.asString).forEach(function (s, i) {

                chai.assert.isString(s);
                chai.assert.equal(s, array[i].id);

            });

        });

    });

    describe("List", function () {

        describe("constructor", function () {

            it("should handle arrays", function () {

                var array = ["one", "two", "three"];
                var list = new ARIA.List(array);

                chai.assert.equal(list.size, array.length);
                chai.assert.deepEqual(Array.from(list), array);

            });

            it("should handle strings", function () {

                var string = "one two  three";
                var list1 = new ARIA.List(string);
                var list2 = new ARIA.List("  " + string + "  ");

                chai.assert.equal(list1.size, string.split(/\s+/).length);
                chai.assert.equal(list1.size, list2.size);
                chai.assert.deepEqual(Array.from(list1), Array.from(list2));

            });

        });

        describe("add", function () {

            it("should add a value", function () {

                var list = new ARIA.List();

                list.add("one");
                chai.assert.equal(list.size, 1)

            });

            it("should add multiple values", function () {

                var list = new ARIA.List();

                list.add("one", "two");
                chai.assert.equal(list.size, 2);

            });

            it("should not add duplicated values", function () {

                var list = new ARIA.List("one");

                chai.assert.equal(list.size, 1);

                list.add("one");
                chai.assert.equal(list.size, 1);

                list.add("one", "two", "one", "three", "one");
                chai.assert.equal(list.size, 3);

            });

            it("should trim values before trying to add them", function () {

                var list = new ARIA.List();

                list.add("one", " one", "one ", " one ");
                chai.assert.equal(list.size, 1);

            });

        });

        describe("delete", function () {

            it("should remove a value", function () {

                var list = new ARIA.List("one two three");

                chai.assert.equal(list.size, 3);
                list.delete("one");
                chai.assert.equal(list.size, 2);

            });

            it("should remove multiple values", function () {

                var list = new ARIA.List("one two three");

                chai.assert.equal(list.size, 3);
                list.delete("one", "two");
                chai.assert.equal(list.size, 1);

            });

            it("should trim values before removing them", function () {

                var list = new ARIA.List("one two three");

                chai.assert.equal(list.size, 3);
                list.delete("  one  ");
                chai.assert.equal(list.size, 2);

            });

            it("should not throw an error if it fails", function () {

                var list = new ARIA.List();

                chai.assert.doesNotThrow(function () {
                    list.delete("does not exist");
                });

            });

        });

        describe("toArray", function () {

            it("should convert the list to an array", function () {

                var list = new ARIA.List();

                chai.assert.isArray(list.toArray());

            });

            it("should allow the list to be mapped", function () {

                var array = ["one", "two", "three"];
                var toUpper = function (string) {
                    return string.toUpperCase();
                };
                var list = new ARIA.List(array);

                chai.assert.deepEqual(list.toArray(), array);
                chai.assert.deepEqual(list.toArray(toUpper), array.map(toUpper));

            });

        });

        describe("toString", function () {

            it("should convert the list into a space-separated string", function () {

                var string = "one two three";
                var list = new ARIA.List(string);

                chai.assert.equal(list.toString(), string);
                chai.assert.equal("" + list, string);
                chai.assert.equal(String(list), string);

            });

        });

    });

    describe("getById", function () {

        it("should find an element by ID", function () {

            var div = document.createElement("div");
            var realId = "id-" + Math.floor(Date.now() * Math.random());
            div.id = realId;
            document.body.appendChild(div);
            var found = ARIA.getById(realId);

            chai.assert.equal(div, found);
            document.body.removeChild(div);

        });

        it("should return null if no element is found", function () {

            var notRealId = "id-" + Math.floor(Date.now() * Math.random());

            chai.assert.isNull(ARIA.getById(notRealId));

        });

    });

    describe("identify", function () {

        it("should return the ID of an element", function () {

            var div = document.createElement("div");
            div.id =  "id-" + Math.floor(Date.now() * Math.random());

            chai.assert.equal(ARIA.identify(div), div.id);

        });

        it("should generate an ID if the element needs one", function () {

            var div = document.createElement("div");
            var newId = ARIA.identify(div);

            chai.assert.isNotNull(div.getAttribute("id"));
            chai.assert.equal(newId, div.id);

        });

        it("should allow us to set the prefix", function () {

            var div = document.createElement("div");
            var newId = ARIA.identify(div, "id-");

            chai.assert.isTrue(newId.startsWith("id-"));

        });

    });

    describe("normalise", function () {

        it("should prefix attributes with \"aria-\"", function () {
            chai.assert.equal(ARIA.normalise("busy"), "aria-busy");
        });

        it("should not modify already prefixed attributes", function () {

            var attribute = "aria-busy";

            chai.assert.equal(ARIA.normalise(attribute), attribute);

        });

        it("should trim and convert to lowercase", function () {

            chai.assert.equal(ARIA.normalise(" aria-busy "), "aria-busy");
            chai.assert.equal(ARIA.normalise(" BUSY "), "aria-busy");

        });

        it("should have the alias of \"normalize\"", function () {

            var normalise = ARIA.normalise;
            var newNormal = function (attr) {
                return attr.toUpperCase();
            };

            chai.assert.equal(ARIA.normalise, ARIA.normalize);

            ARIA.normalise = newNormal;
            chai.assert.equal(ARIA.normalise, ARIA.normalize);

            ARIA.normalise = normalise;

        });

    });

});
