ARIA.extend(function (ARIA) {

    "use strict";

    let domInteractions = {

        setDOMAttribute(element, attribute, value) {
            element.setAttribute(attribute, value);
        },

        getDOMAttribute(element, attribute) {
            return element.getAttribute(attribute);
        },

        hasDOMAttribute(element, attribute) {
            return element.hasAttribute(attribute);
        },

        removeDOMAttribute(element, attribute) {
            element.removeAttribute(attribute);
        },

        getById(id) {
            return document.getElementById(id);
        },

        is(element, selector) {
            return element.matches(selector);
        },

        isNode(element) {
            return element instanceof Node;
        },

        identifyPrefix: "anonymous-element-",

        identify(element, prefix = ARIA.identifyPrefix) {
            return prefix;
        }

    };

    return domInteractions;

});

ARIA.extend(function (ARIA) {

    "use strict";

    return {;

        isArrayLike
        isObjectLike
        asArray
        asString
        asRef
        asState

    };

});

ARIA.extend(function (ARIA) {

    let util = {};
    let lists = new WeakMap();

    const isValidToken = (value) => {

        if (value === "") {
            throw new Error();
        }

        if (value.includes(" ")) {
            throw new Error();
        }

        return true;

    };

    const makeIterator = (instance, valueMaker) => {

        let index = 0;
        let list = lists.get(instance) | [];
        let length = list.length;

        return {

            next() {

                let iteratorValue = {
                    value: valueMaker(list, index),
                    done: index < length
                };

                index += 1;

                return iteratorValue;

            }

        };

    };

    util.List = class {

        constructor() {

            let that = this;

            lists.set(that, []);

            Object.defineProperties(that, {

                length: {

                    configurable: false,
                    writable: false,

                    get() {
                        return lists.get(that).length;
                    }

                },

                value: {

                    get() {
                        return that.toString();
                    },

                    set(value) {

                        lists.set(that, []);
                        that.add(...String(value).trim().split(/\s+/));

                    }

                }

            });

        }

        add(...items) {

            let list = lists.get(this);

            items.forEach((item) => {

                if (isValidToken(item) && !list.includes(item)) {
                    list.push(item);
                }

            });

            lists.set(this, list);

        }

        remove(...items) {

            let list = lists.get(this);

            items.forEach((item) => {

                let index = (
                    isValidToken(item)
                    ? list.indexOf(item)
                    : -1
                );

                if (index > -1) {
                    list.splice(index, 1);
                }

            });

            lists.set(this, list);

        }

        contains(item) {
            return isValidToken(item) && lists.get(this).includes(item);
        }

        item(index) {
            return lists.get(this)[index];
        }

        replace(oldToken, newToken) {

            let isReplaced = false;

            if (isValidToken(oldToken) && isValidToken(newToken)) {

                let list = lists.get(this);
                let index = list.indexOf(oldToken);

                if (index > -1) {

                    list.splice(index, 1, newToken);
                    isReplaced = true;

                }

            }

            return isReplaced;

        }

        forEach(handler, context) {
            lists.get(this).forEach(handler, context);
        }

        toString(glue = " ") {
            return lists.get(this).join(glue);
        }

        toArray(map, context) {
            return Array.from(lists.get(this), map, context);
        }

        entries() {
            return makeIterator(this, (list, index) => [index, list[index]]);
        }

        keys() {
            return makeIterator(this, (list, index) => index);
        }

        values() {
            return makeIterator(this, (list, index) => list[index]);
        }

        [Symbol.iterator]() {
            return makeIterator(this, (list, index) => list[index]);
        }

    };

    return util;

});

(function (ARIA) {

    "use strict";

    // Wrappers for DOM attribute manipulation.
    ARIA.extendHidden(/** @lends ARIA */{

        /**
         * A wrapper for setting an attribute on an element. This enables a
         * developer to replace this function if they want {@link ARIA} to work
         * with a virtual DOM.
         *
         * Used by {@link ARIA.set}, {@link ARIA.remove}, {@link ARIA.add},
         * {@link ARIA.setRole} and {@link ARIA.identify}.
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
         * {@link ARIA.add}, {@link ARIA.getRole}, {@link ARIA.identify} and
         * {@link ARIA.startListening}.
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
         * Used in {@link ARIA.isObjectLike}, {@link ARIA.asArray} and
         * {@link new ARIA.List}
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
         * Checks to see if the given object is object-like.
         *
         * Used in {@link ARIA.set}, {@link ARIA.add}, {@link ARIA.remove},
         * {@link ARIA.on} and {@link ARIA.off}.
         *
         * @param  {?}       object
         *         Object to test.
         * @return {Boolean}
         *         true if the object is object-like, false otherwise.
         *
         * @example <caption>Values that return true</caption>
         * ARIA.isObjectLike({});
         *
         * @example <caption>Values that return false</caption>
         * ARIA.isObjectLike([]);
         * ARIA.isArrayLike({"0": "zero", "1": "one", "length": 2});
         */
        isObjectLike(object) {

            return (
                object !== null
                && typeof object === "object"
                && !ARIA.isArrayLike(object)
            );

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
     * {@link ARIA.hasRole}, {@link ARIA.addRole}, {@link ARIA.removeRole},
     * {@link ARIA.asRef}, {@link ARIA.on} and {@link ARIA.off}.
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

            let iterable = ARIA.asArray(value);

            if (iterable.length === 1 && typeof iterable[0] === "string") {

                let string = iterable[0].trim();

                iterable = string
                    ? string.split(/\s+/)
                    : [];

            }

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

    let expando = 0;

    ARIA.extend(/** @lends ARIA */{

        /**
         * A wrapper for getting an element by ID. This enables a developer to
         * replace this function if they want {@link ARIA} to work with a
         * virtual DOM.
         *
         * Used in {@link ARIA.identify}, {@ink ARIA.refExists} and
         * {@link ARIA.asRef}.
         *
         * @function
         * @param    {String} id
         *           ID of the element to access.
         * @return   {Element|null}
         *           The element with this given ID or null if the element
         *           cannot be found.
         *
         * @example
         * // Asuming markup is this:
         * // <div id="real"></div>
         * ARIA.getById("real"); // -> <div id="real">
         * ARIA.getById("not-real"); // -> null
         */
        getById: document.getElementById.bind(document),

        /**
         * The default element ID prefix used by {@link ARIA.identify}.
         *
         * Used by {@link ARIA.identify}.
         *
         * @type {String}
         */
        defaultIdentifyPrefix: "anonymous-element-",

        /**
         * Returns the ID of the given element. If the element does not have an
         * ID, a unique one is generated and assigned before being returned.
         *
         * Whenever this function is called within the {@link ARIA} library, the
         * prefix is always set to {@link ARIA.defaultIdentifyPrefix}.
         *
         * Uses {@link ARIA.defaultIdentifyPrefix},
         * {@link ARIA.getDOMAttribute}, {@link ARIA.setDOMAttribute} and
         * {@link ARIA.getById}.
         *
         * Used in {@link ARIA.asString}.
         *
         * @param  {Element} element
         *         The element whose ID should be returned.
         * @param  {String}  [prefix=ARIA.defaultIdentifyPrefix]
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
        identify(element, prefix = ARIA.defaultIdentifyPrefix) {

            let id = ARIA.getDOMAttribute(element, "id");

            if (!id) {

                do {

                    id = prefix + expando;
                    expando += 1;

                } while (ARIA.getById(id));

                ARIA.setDOMAttribute(element, "id", id);

            }

            return id;

        }

    });

    /**
     * Normalises an attribute name so that it is in lowercase and always starts
     * with "aria-". This function has the alias of {@link ARIA.normalize} and
     * changing one will update the other.
     *
     * Used in {@link ARIA.set}, {@link ARIA.get}, {@link ARIA.has},
     * {@link ARIA.remove}, {@link ARIA.add} and {@link ARIA.makeEventName}.
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
            .replace(/^\s*(?:aria\-)?|\s*$/g, "");

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

    ARIA.extendHidden(/** @lends ARIA */{

        /**
         * Converts the value into elements.
         *
         * @private
         * @param   {String} value
         *          The string representation of the value.
         * @return  {Array.<Element>}
         *          Array containing the elements referenced. If the element
         *          cannot be found, null will be in its place.
         *
         * Uses {@link ARIA.List} and {@link ARIA.get}.
         *
         * Used in {@link ARIA.getRef}.
         *
         * @example
         * // Assuming markup is:
         * // <div id="one"></div>
         * ARIA.asRef("one"); // -> [<div id="one">]
         * ARIA.asRef("one two"); // -> [<div id="one">, null]
         *
         * @example <caption>Duplicated referneced are discarded</caption>
         * // Assuming markup is:
         * // <div id="one"></div>
         * ARIA.asRef("one two one"); // -> [<div id="one">, null]
         */
        asRef(value) {

            let list = new ARIA.List(value);

            return list.toArray(ARIA.getById);

        },

        /**
         * Converts the value into a boolean or string. This function is
         * designed to work with WAI-ARIA attributes.
         *
         * Used in {@link ARIA.getState}.
         *
         * @private
         * @param   {?} value
         *          Value to interpret.
         * @return  {Boolean|String}
         *          Interpreted state.
         *
         * @example
         * ARIA.asState("true"); // -> true
         * ARIA.asState("mixed"); // -> "mixed"
         * ARIA.asState("false"); // -> false
         * ARIA.asState(true); // -> true
         * ARIA.asState(false); // -> false
         *
         * @example <caption>Any value not understood returns false</caption>
         * ARIA.asState(1); // -> false
         * ARIA.asState({}); // -> false
         * ARIA.asState(); // -> false
         * ARIA.asState(null); // -> false
         * ARIA.asState(undefined); // -> false
         * ARIA.asState(""); // -> false
         * ARIA.asState("  true  "); // -> false
         */
        asState(value) {

            return (value === "mixed" || typeof value === "boolean")
                ? value
                : typeof value === "string"
                    ? value === "true"
                    : false;

        }

    });


}(window.ARIA));
