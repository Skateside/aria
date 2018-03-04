(function (ARIA) {

    "use strict";

    // Wrappers for DOM attribute manipulation.
    ARIA.extendHidden(/** @lends ARIA */{

        /**
         * A wrapper for setting an attribute on an element. This enables a
         * developer to replace this function if they want {@link ARIA} to work
         * with a virtual DOM.
         *
         * Used by {@link ARIA.set}, {@link ARIA.remove}, {@link ARIA.add} and
         * {@link ARIA.setRole}.
         *
         * @private
         * @param   {Element} element
         *          Element whose attribute should be set.
         * @param   {String}  attribute
         *          Attribute to set.
         * @param   {?}       value
         *          Value of the attribute to set.
         *
         * @example
         * var div = document.getElementById("div"); // -> <div id="div">
         * ARIA.setDOMAttribute(div, "class", "one");
         * div; // -> <div id="div" class="one");
         */
        setDOMAttribute(element, attribute, value) {
            element.setAttribute(attribute, value);
        },

        /**
         * A wrapper for getting the attribute on an element. This enables a
         * developer to replace this function if they want {@link ARIA} to work
         * with a virtual DOM.
         *
         * Used by {@link ARIA.set}, {@link ARIA.get}, {@link ARIA.remove},
         * {@link ARIA.add} and {@link ARIA.getRole}.
         *
         * @private
         * @param   {Element}     element
         *          Element whose attribute should be retrieved.
         * @param   {String}      attribute
         *          Attribute to access.
         * @return  {String|null}
         *          Value of the attribute or null if the attribute does not
         *          exist.
         *
         * @example
         * var div = document.getElementById("div"); // -> <div id="div">
         * ARIA.getDOMAttribute(div, "id"); // -> "div"
         */
        getDOMAttribute(element, attribute) {
            return element.getAttribute(attribute);
        },

        /**
         * A wrapper for checking whether or not an element has the given
         * attribute. This enables a developer to replace this function if they
         * want {@link ARIA} to work with a virtual DOM.
         *
         * Used by {@link ARIA.has} and {@ARIA.hasRole}
         *
         * @private
         * @param   {Element}  element
         *          Element that should be checked for an attribute.
         * @param   {String}   attribute
         *          Attribute to check.
         * @return  {Boolean}
         *          true if the element has the given attribute, false
         *          otherwise.
         *
         * @example
         * var div = document.getElementById("div"); // -> <div id="div">
         * ARIA.hasDOMAttribute(div, "class"); // -> false
         * ARIA.hasDOMAttribute(div, "id"); // -> true
         */
        hasDOMAttribute(element, attribute) {
            return element.hasAttribute(attribute);
        },

        /**
         * A wrapper for checking whether or not an element has the given
         * attribute. This enables a developer to replace this function if they
         * want {@link ARIA} to work with a virtual DOM.
         *
         * Used by {@link ARIA.remove} and {@ARIA.removeRole}
         *
         * @private
         * @param   {Element} element
         *          Element whose attribute should be removed.
         * @param   {String}  attribute
         *          Attribute to remove.
         *
         * @example
         * var div = document.getElementById("div"); // -> <div id="div">
         * ARIA.hasDOMAttribute(div, "id"); // -> true
         * ARIA.removeDOMAttribute(div, "id");
         * ARIA.hasDOMAttribute(div, "id"); // -> false
         */
        removeDOMAttribute(element, attribute) {
            element.removeAttribute(attribute);
        }

    });

    // Helper functions that we'll ue elsewhere.
    ARIA.extendHidden(/** @lends ARIA */{

        /**
         * Checks to see if the given object is array-like. That is, it could be
         * converted into an array.
         *
         * Used in {@link ARIA.asArray} and {@link new ARIA.List}
         *
         * @private
         * @param   {?}       object
         *          Object to test.
         * @return  {Boolean}
         *          true if the object is array-like, false otherwise.
         *
         * @example <caption>Values that would return true</caption>
         * ARIA.isArrayLike([]);
         * ARIA.isArrayLike(document.querySelectorAll("a"));
         * ARIA.isArrayLike("abc");
         * ARIA.isArrayLike({"0": "zero", "1": "one", "length": 2});
         * ARIA.isArrayLike(new Set());
         *
         * @example <caption>Values that would return false</caption>
         * ARIA.isArrayLike(123);
         * ARIA.isArrayLike(document.querySelector("a"));
         * ARIA.isArrayLike({"0": "zero", "1": "one"});
         */
        isArrayLike(object) {

            return object
                ? (
                    typeof object.length === "number"
                    || typeof object[Symbol.iterator] === "function"
                )
                : false;

        },

        /**
         * Returns an array containing the given object unless the object can be
         * converted into an array. A key exception is that a string is not
         * split but returned as an array containing the string.
         *
         * Uses {@link ARIA.isArrayLike}.
         *
         * Used in {@link ARIA.set}, {@link ARIA.remove}, {@link ARIA.add},
         * {@link ARIA.chain} and {@link ARIA.List#constructor}.
         *
         * @private
         * @param   {?}     object
         *          Object to convert into an array.
         * @return  {Array}
         *          Array based on the given object.
         *
         * @example <caption>Array-like structures are converted</caption>
         * ARIA.asArray(document.querySelectorAll("a")); // -> [<a>, <a>, ...]
         * ARIA.asArray(new Set(["one", "two"])); // -> ["one", "two"]
         * ARIA.asArray(["one", "two"]); // -> ["one", "two"]
         *
         * @example <caption>Non-array-like structures are wrapped</caption>
         * ARIA.asArray("abc"); // -> ["abc"];
         * ARIA.asArray(123); // -> [123];
         * ARIA.asArray({ "a": "Alpha" }); // -> [{ "a": "Alpha" }];
         *
         * @example <caption>null and undefined generate empty arrays</caption>
         * ARIA.asArray(null); // -> []
         * ARIA.asArray(undefined); // -> []
         * ARIA.asArray(); // -> []
         */
        asArray(object) {

            return (object === null || object === undefined)
                ? []
                : (typeof object !== "string" && ARIA.isArrayLike(object))
                    ? [...object]
                    : [object];

        },

        /**
         * Checks to see if the given object is a Node.
         *
         * Used in {@link ARIA.asString}.
         *
         * @private
         * @param   {?}       object
         *          Object to test.
         * @return  {Boolean}
         *          true if the given object is a node, false otherwise.
         *
         * @example <caption>Values that would return true</caption>
         * ARIA.isNode(document.createElement("div"));
         * ARIA.isNode(document.getElementById("real")); // If element exists.
         * ARIA.isNode(document.createTextNode("a"));
         * ARIA.isNode(document.createComment("a"));
         *
         * @example <caption>Results that would return false</caption>
         * ARIA.isNode({nodeName: "a", nodeType: 1});
         * ARIA.isNode(null);
         * ARIA.isNode(document.querySelectorAll("a"));
         */
        isNode(object) {
            return object instanceof Node;
        },

        /**
         * Converts the given object into a string. Special consideration is
         * given to Nodes (see {@link ARIA.isNode} which is converted by
         * returning the Node's ID (see {@link ARIA.identify}).
         *
         * Uses {@link ARIA.isNode} and {@link ARIA.identify}.
         *
         * Used in {@link ARIA.set}, {@link ARIA.remove} and {@link ARIA.add}.
         *
         * @private
         * @param   {?}      object
         *          Object to convert into a string.
         * @return  {String}
         *          String of the object.
         *
         * @example
         * ARIA.asString("abc"); // -> "abc"
         * ARIA.asString(123); // -> "123"
         * ARIA.asString({toString: function () { return "def"; }}); // -> "def"
         * ARIA.asString(document.getElementById("ghi")); // -> "ghi"
         */
        asString(object) {

            return ARIA.isNode(object)
                ? ARIA.identify(object)
                : String(object);

        }

    });

    /**
     * A List handles the space-separated WAI-ARIA and role attributes. All
     * values are unique.
     *
     * Used in {@link ARIA.set}, {@link ARIA.remove}, {@link ARIA.add},
     * {@link ARIA.hasRole}, {@link ARIA.addRole}, {@link ARIA.removeRole} and
     * {@link ARIA.getRef}.
     *
     * @class
     * @extends Set
     */
    ARIA.List = class extends Set {

        /**
         * The constructor is designed to take a list of values or the value of
         * an attribute.
         *
         * Uses {@link ARIA.asArray}.
         *
         * @constructs ARIA.List
         * @param      {[type]} value [description]
         *
         * @example
         * var list1 = new ARIA.List(
         *     document.getElementById("one").getAttribute("aria-controls")
         * );
         * var list2 = new ARIA.List("one two three");
         * var list3 = new ARIA.List(["one", "two", "three"]);
         */
        constructor(value) {

            //*
            let iterable = ARIA.asArray(value);

            if (iterable.length === 1 && typeof iterable[0] === "string") {

                let string = iterable[0].trim();

                iterable = string
                    ? string.split(/\s+/)
                    : [];

            }
            /*/
            let iterable = [];

            if (typeof value === "string") {

                value = value.trim();
                iterable = value
                    ? value.split(/\s+/)
                    : [];

            } else if (ARIA.isArrayLike(value)) {
                iterable = value;
            } else if (value) {
                iterable = [value];
            }
            //*/

            super(iterable);

        }

        /**
         * Adds one or more values to the list. Any value that already exists in
         * the list will not be duplicated. Values are trimmed before being
         * added.
         *
         * @param {...String} values
         *        Values to add to the list.
         */
        add(...values) {

            values.forEach(
                (value) => super.add.call(this, String(value).trim())
            );

        }

        /**
         * Removes one or more values from the list. Values are trimmed before
         * being removed.
         *
         * @param {...String} values
         *        Values to remove from the list.
         */
        delete(...values) {

            values.forEach(
                (value) => super.delete.call(this, String(value).trim())
            );

        }

        /**
         * Converts the current list into an array of values. Optionally, the
         * values can be modified by pasing a mapping function and a context.
         *
         * @param  {Function}       [handler]
         *         Optional function for converting the entries in the list.
         * @param  {?}              [context]
         *         Optional context for the optional function.
         * @return {Array.<String>}
         *         Array of the values.
         *
         * @example
         * var list = new ARIA.List("one two three");
         * list.toArray(); // -> ["one", "two", "three"]
         * list.toArray((v) => v.toUpperCase()); // -> ["ONE", "TWO", "THREE"]
         */
        toArray(handler, context) {
            return Array.from(this, handler, context);
        }

        /**
         * Converts the list into a string of space-separated values.
         *
         * @return {String}
         *         Space-separated string of values.
         *
         * @example
         * var list = new ARIA.List("one two three");
         * list.toString(); // -> "one two three"
         * String(list); // -> "one two three"
         */
        toString() {
            return this.toArray().join(" ");
        }

    };

    /**
     * A wrapper for getting an element by ID. This enables a developer to
     * replace this function if they want {@link ARIA} to work with a virtual
     * DOM.
     *
     * Used in {@link ARIA.identify}, {@ink ARIA.refExists} and
     * {@link ARIA.getRef}.
     *
     * @function
     * @param    {String} id
     *           ID of the element to access.
     * @return   {Element|null}
     *           The element with this given ID or null if the element cannot be
     *           found.
     *
     * @example
     * // Asuming markup is this:
     * // <div id="real"></div>
     * ARIA.getById("real"); // -> <div id="real">
     * ARIA.getById("not-real"); // -> null
     */
    ARIA.getById = document.getElementById.bind(document);

    let expando = 0;

    /**
     * Returns the ID of the given element. If the element does not have an ID,
     * a unique one is generated and assigned before being returned.
     *
     * Uses {@link ARIA.getById}.
     *
     * Used in {@link ARIA.asString}.
     *
     * @param  {Element} element
     *         The element whose ID should be returned.
     * @param  {String}  [prefix="anonymous-element-"]
     *         The prefix of the ID that could be generated.
     * @return {String}
     *         The element's ID.
     *
     * @example <caption>IDs are returned or generated and returned</caption>
     * // Assuming markup is:
     * // <div class="thing" id="one"></div>
     * // <div class="thing"></div>
     * var divs = document.querySelectorAll(".thing");
     * ARIA.identify(divs[0]); // -> "one"
     * ARIA.identify(divs[1]); // -> "anonymous-element-0"
     * // Markup is now:
     * // <div class="thing" id="one"></div>
     * // <div class="thing" id="anonymous-element-0"></div>
     *
     * @example <caption>Prefix can be changed</caption>
     * // Assuming markup is:
     * // <div class="thing"></div>
     * // <div class="thing"></div>
     * var divs = document.querySelectorAll(".thing");
     * ARIA.identify(divs[0]); // -> "anonymous-element-0"
     * ARIA.identify(divs[1], "id-"); // -> "id-1"
     * // Markup is now:
     * // <div class="thing" id="anonymous-element-0"></div>
     * // <div class="thing" id="id-1"></div>
     */
    ARIA.identify = function (element, prefix = "anonymous-element-") {

        let id = element.id;

        if (!id) {

            do {

                id = `${prefix}${expando}`;
                expando += 1;

            } while (ARIA.getById(id));

            element.id = id;

        }

        return id;

    };

    /**
     * Normalises an attribute name so that it is in lowercase and always starts
     * with "aria-". This function has the alias of {@link ARIA.normalize} and
     * changing one will update the other.
     *
     * Used in {@link ARIA.set}, {@link ARIA.get}, {@link ARIA.has},
     * {@link ARIA.remove} and {@link ARIA.add}.
     *
     * @memberof ARIA
     * @param    {String} attribute
     *           Attribute to normalise.
     * @return   {String}
     *           Normalised attribute.
     *
     * @example
     * ARIA.normalise("aria-busy"); // -> "aria-busy"
     * ARIA.normalise("busy"); // -> "aria-busy"
     * ARIA.normalise("  busy  "); // -> "aria-busy"
     * ARIA.normalise("BUSY"); // -> "aria-busy"
     */
    let normalise = function (attribute) {

        let string = String(attribute)
            .toLowerCase()
            .replace(/^(?:\s*aria\-)?|\s*$/g, "");

        return `aria-${string}`;

    };

    let normaliseDescriptor = {

        configurable: false,
        enumerable: true,

        get() {
            return normalise;
        },

        set(normaliser) {
            normalise = normaliser;
        }

    };

    Object.defineProperties(ARIA, {

        normalise: normaliseDescriptor,

        /**
         * An alias of {@link ARIA.normalise}.
         *
         * @memberof ARIA
         * @function
         */
        normalize: normaliseDescriptor

    });

}(window.ARIA));
