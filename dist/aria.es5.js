"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

/*! aria - v0.1.0 - MIT license - 2018-4-1 */
(function (globalVariable) {
    "use strict";

    /**
     * @file    A library for handling WAI-ARIA attributes, the role attribute and
     *          other accessibility functions.
     * @author  James "Skateside" Long <sk85ide@hotmail.com>
     * @version 0.1.0
     */

    /**
     * Namespace for the WAI-ARIA functions.
     *
     * @namespace
     */

    var ARIA = {};

    /**
     * The current version. This is written in Semantic Versioning (SemVer).
     *
     * @memberof ARIA
     * @constant
     * @type     {String}
     */
    var VERSION = "0.1.0";

    var previousAria = globalVariable.ARIA;
    var hiddenDescriptor = {
        configurable: true,
        enumerable: false,
        writable: true
    };

    /**
     * @memberof ARIA
     * @param    {Object} methods
     *           Methods to publicly add to the {@link ARIA} namespace.
     */
    function extend(methods) {
        Object.assign(ARIA, methods);
    }

    /**
     * @memberof ARIA
     * @param    {Object} methods
     *           Methods to privately add to the {@link ARIA} namespace.
     */
    function extendHidden(methods) {

        Object.entries(methods).forEach(function (_ref) {
            var _ref2 = _slicedToArray(_ref, 2),
                name = _ref2[0],
                value = _ref2[1];

            Object.defineProperty(ARIA, name, Object.assign({ value: value }, hiddenDescriptor));
        });
    }

    Object.defineProperty(ARIA, "VERSION", {
        configurable: false,
        enumerable: true,
        writable: false,
        value: VERSION
    });

    extendHidden({
        extend: extend,
        extendHidden: extendHidden
    });

    /**
     * Removes the {@link ARIA} namespace from the global object and restores
     * any previous value that may have been there.
     *
     * @return {Object}
     *         The {@link ARIA} namespace.
     */
    ARIA.noConflict = function () {

        globalVariable.ARIA = previousAria;

        return ARIA;
    };

    globalVariable.ARIA = ARIA;

    // Wrappers for DOM attribute manipulation.
    ARIA.extendHidden( /** @lends ARIA */{

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
        setDOMAttribute: function setDOMAttribute(element, attribute, value) {
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
        getDOMAttribute: function getDOMAttribute(element, attribute) {
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
        hasDOMAttribute: function hasDOMAttribute(element, attribute) {
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
        removeDOMAttribute: function removeDOMAttribute(element, attribute) {
            element.removeAttribute(attribute);
        }
    });

    // Helper functions that we'll ue elsewhere.
    ARIA.extendHidden( /** @lends ARIA */{

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
        isArrayLike: function isArrayLike(object) {

            return object ? typeof object.length === "number" || typeof object[Symbol.iterator] === "function" : false;
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
        isObjectLike: function isObjectLike(object) {

            return object !== null && (typeof object === "undefined" ? "undefined" : _typeof(object)) === "object" && !ARIA.isArrayLike(object);
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
        asArray: function asArray(object) {

            return object === null || object === undefined ? [] : typeof object !== "string" && ARIA.isArrayLike(object) ? [].concat(_toConsumableArray(object)) : [object];
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
        isNode: function isNode(object) {
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
        asString: function asString(object) {

            return ARIA.isNode(object) ? ARIA.identify(object) : String(object);
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
    ARIA.List = function (_Set) {
        _inherits(_class, _Set);

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
        function _class(value) {
            _classCallCheck(this, _class);

            var iterable = ARIA.asArray(value);

            if (iterable.length === 1 && typeof iterable[0] === "string") {

                var string = iterable[0].trim();

                iterable = string ? string.split(/\s+/) : [];
            }

            return _possibleConstructorReturn(this, (_class.__proto__ || Object.getPrototypeOf(_class)).call(this, iterable));
        }

        /**
         * Adds one or more values to the list. Any value that already exists in
         * the list will not be duplicated. Values are trimmed before being
         * added.
         *
         * @param {...String} values
         *        Values to add to the list.
         */


        _createClass(_class, [{
            key: "add",
            value: function add() {
                var _this2 = this;

                for (var _len = arguments.length, values = Array(_len), _key = 0; _key < _len; _key++) {
                    values[_key] = arguments[_key];
                }

                values.forEach(function (value) {
                    return _get(_class.prototype.__proto__ || Object.getPrototypeOf(_class.prototype), "add", _this2).call(_this2, String(value).trim());
                });
            }

            /**
             * Removes one or more values from the list. Values are trimmed before
             * being removed.
             *
             * @param {...String} values
             *        Values to remove from the list.
             */

        }, {
            key: "delete",
            value: function _delete() {
                var _this3 = this;

                for (var _len2 = arguments.length, values = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                    values[_key2] = arguments[_key2];
                }

                values.forEach(function (value) {
                    return _get(_class.prototype.__proto__ || Object.getPrototypeOf(_class.prototype), "delete", _this3).call(_this3, String(value).trim());
                });
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

        }, {
            key: "toArray",
            value: function toArray(handler, context) {
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

        }, {
            key: "toString",
            value: function toString() {
                return this.toArray().join(" ");
            }
        }]);

        return _class;
    }(Set);

    var expando = 0;

    ARIA.extend( /** @lends ARIA */{

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
        identify: function identify(element) {
            var prefix = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : ARIA.defaultIdentifyPrefix;


            var id = ARIA.getDOMAttribute(element, "id");

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
    var normalise = function normalise(attribute) {

        var string = String(attribute).toLowerCase().replace(/^\s*(?:aria\-)?|\s*$/g, "");

        return "aria-" + string;
    };

    var normaliseDescriptor = {

        configurable: false,
        enumerable: true,

        get: function get() {
            return normalise;
        },
        set: function set(normaliser) {
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

    ARIA.extendHidden( /** @lends ARIA */{

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
        asRef: function asRef(value) {

            var list = new ARIA.List(value);

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
        asState: function asState(value) {

            return value === "mixed" || typeof value === "boolean" ? value : typeof value === "string" ? value === "true" : false;
        }
    });

    /**
     * This callback can be used to create the value that a {@link ARIA} method
     * will use. The value returned from this callback will be treated as if it
     * had been passed into the {@link ARIA} method. So, for example, the value
     * returned from this callback in {@link ARIA.set} will be set on the
     * element. Specific information will be found in the methods which use this
     * callback.
     *
     * @callback ARIA~callback
     * @param    {Element} element
     *           Element that will be modified.
     * @param    {String}  value
     *           Current value of the attribute.
     * @param    {String}  attribute
     *           Normalised attribute being manipulated.
     * @return   {Boolean|Element|String}
     *           Value that will be used by the {@link ARIA} method.
     */

    ARIA.extend( /** @lends ARIA */{

        /**
         * Sets one or more WAI-ARIA attributes on the given element. Attribute
         * names will be normalised (see {@link ARIA.normalise}). When passing
         * in an object of multiple attributes to set, the values of the object
         * can be anything that the "value" parameter can be, including
         * {@link ARIA~callback}.
         *
         * Uses {@link ARIA.isObjectLike}, {@link ARIA.normalise},
         * {@link ARIA.getDOMAttribute}, {@link ARIA.asArray},
         * {@link ARIA.asString}, {@link ARIA.setDOMAttribute} and
         * {@link ARIA.List}
         *
         * @param {Element}       element
         *        Element to modify.
         * @param {Object|String} attribute
         *        Either the string of the attribute to set or an object of
         *        attributes to values.
         * @param {Array.<Element>|Boolean|Element|NodeList|String|ARIA~callback} [value]
         *        Value of the attribute to set. Only necessary if the attribute
         *        parameter is a string.
         *
         * @example <caption>Setting single attributes</caption>
         * // Assuming markup is
         * // <div id="one"></div>
         * // <div id="two"></div>
         * var div = document.getElementById("one");
         * ARIA.set(div, "busy", true);
         * ARIA.set(div, "label", "abc");
         * ARIA.set(div, "controls", document.getElementById("two"));
         * // Now markup is
         * // <div id="one"
         * //     aria-busy="true"
         * //     aria-label="abc"
         * //     aria-controls="two"></div>
         * // <div id="two"></div>
         *
         * @example <caption>Setting an attribute with a function</caption>
         * // Assuming markup is
         * // <div id="one" aria-label="abc"></div>
         * var div = document.getElementById("one");
         * ARIA.set(div, "label", function (element, value, attribute) {
         *     return value.toUpperCase() + "__" + attribute;
         * });
         * // Now markup is
         * // <div id="one" aria-label="ABC__aria-label"></div>
         *
         * @example <caption>Setting multiple attributes</caption>
         * // Assuming markup is
         * // <div id="one"></div>
         * // <div id="two"></div>
         * var div = document.getElementById("one");
         * ARIA.set(div, {
         *     busy: true,
         *     label: "abc",
         *     controls: document.getElementById("two")
         * });
         * // Now markup is
         * // <div id="one"
         * //     aria-busy="true"
         * //     aria-label="abc"
         * //     aria-controls="two"></div>
         * // <div id="two"></div>
         */
        set: function set(element, attribute, value) {

            if (ARIA.isObjectLike(attribute)) {

                Object.entries(attribute).forEach(function (_ref3) {
                    var _ref4 = _slicedToArray(_ref3, 2),
                        attr = _ref4[0],
                        val = _ref4[1];

                    return set(element, attr, val);
                });
            } else {

                var attr = ARIA.normalise(attribute);

                if (typeof value === "function") {

                    value = value(element, ARIA.getDOMAttribute(element, attr), attr);
                }

                var list = new ARIA.List(ARIA.asArray(value).map(ARIA.asString));

                ARIA.setDOMAttribute(element, attr, list);
            }
        },

        /**
         * Gets the value of the given attribute from the given element. The
         * attribute is normalised (see {@link ARIA.normalise}) before being
         * retrieved.
         *
         * Uses {@link ARIA.getDOMAttribute} and {@link ARIA.normalise}.
         *
         * Used by {@link ARIA.getRef}.
         *
         * @param  {Element}     element
         *         Element whose attribute should be retrieved.
         * @param  {String}      attribute
         *         Attribute that should be retrieved.
         * @return {String|null}
         *         Value of the attribute or null if the attribute is not set.
         *
         * @example
         * // Assuming markup is
         * // <div id="one" aria-busy="true" aria-label="abc" aria-hidden><div>
         * var div = document.getElementById("one");
         * ARIA.get(div, "busy"); // -> "true"
         * ARIA.get(div, "label"); // -> "abc"
         * ARIA.get(div, "hidden"); // -> ""
         * ARIA.get(div, "checked"); // -> null
         */
        get: function get(element, attribute) {
            return ARIA.getDOMAttribute(element, ARIA.normalise(attribute));
        },


        /**
         * Gets the references from the given element's attribute. The attribute
         * is normalised (see {@link ARIA.normalise}) and the results are
         * returned in an array.
         *
         * Uses {@link ARIA.asRef} and {@link ARIA.get}.
         *
         * Used in {@link ARIA.hasRef}
         *
         * @param  {Element}         element
         *         Element whose references should be retrieved.
         * @param  {String}          attribute
         *         Attribute containing the references.
         * @return {Array.<Element>}
         *         Array containing the elements referenced. If the element
         *         cannot be found, null will be in its place.
         *
         * @example
         * // Assuming markup is:
         * // <div id="one" aria-controls="two three"></div>
         * // <div id="two"></div>
         * ARIA.getRef(element, "controls"); // -> [<div id="two">, null]
         *
         * @example <caption>Duplicated referneced are discarded</caption>
         * // Assuming markup is:
         * // <div id="one" aria-controls="two three two"></div>
         * // <div id="two"></div>
         * ARIA.getRef(element, "controls"); // -> [<div id="two">, null]
         */
        getRef: function getRef(element, attribute) {
            return ARIA.asRef(ARIA.get(element, attribute));
        },


        /**
         * Gets the state value of teh given attribute of the given element. The
         * attribute name is normalised (see {@link ARIA.normalise}).
         *
         * Uses {@link ARIA.asState} and {@link ARIA.get}
         *
         * @param  {Element} element
         *         Element whose state should be returned.
         * @param  {String}  attribute
         *         Attribute to get.
         * @return {Bolean|String}
         *         State.
         *
         * @example <caption>Recognised values</caption>
         * // Assuming markup is
         * // <div id="one"
         * //     aria-busy="true" aria-checked="mixed" aria-disabled="false"
         * // ></div>
         * var div = document.getElementById("one");
         * ARIA.getState(div, "busy"); // -> true
         * ARIA.getState(div, "checked"); // -> "mixed"
         * ARIA.getState(div, "disabled"); // -> false
         *
         * @example <caption>Missing attributes and other values are false</caption>
         * // Assuming markup is
         * // <div id="one" aria-label="abc" aria-checked="  true  ">
         * var div = document.getElementById("one");
         * ARIA.getState(div, "busy"); // -> false
         * ARIA.getState(div, "label"); // -> false
         * ARIA.getState(div, "checked"); // -> false
         */
        getState: function getState(element, attribute) {
            return ARIA.asState(ARIA.get(element, attribute));
        },


        /**
         * Checks to see if the given element has the attribute. The attribute
         * is normalised (see {@link ARIA.normalise}) before being checked.
         *
         * Uses {@link ARIA.hasDOMAttribute} and {@link ARIA.normalise}.
         *
         * Used in {@link ARIA.hasRef}
         *
         * @param  {Element} element
         *         Element whose attribute should be checked.
         * @param  {String}  attribute
         *         Attribute that should be checked.
         * @return {Boolean}
         *         true if the element has the attribute, false otherwise.
         *
         * @example
         * // Assuming markup is:
         * // <div id="one" aria-busy="true"></div>
         * var div = document.getElementById("one");
         * ARIA.has(div, "busy"); // -> true
         * ARIA.has(div, "checked"); // -> false
         */
        has: function has(element, attribute) {
            return ARIA.hasDOMAttribute(element, ARIA.normalise(attribute));
        },


        /**
         * Checks to see that the given element has all the references defined
         * in the given attribute. This function will return false if one of
         * the references does not exist even if other ones do. The attribute is
         * normalised before being checked (see {@link ARIA.normalise}). This
         * function will return false if the attribute is not set.
         *
         * Uses {@link ARIA.has} and {@link ARIA.getRef} and
         *
         * @param  {Element} element
         *         Element whose references should be checked.
         * @param  {String}  attribute
         *         Attribute containing the reference(s).
         * @return {Boolean}
         *         true if all references exist, false otherwise.
         *
         * @example
         * // Assuming markup is:
         * // <div id="a" aria-labelledby="b" aria-controls="b c"></div>
         * // <div id="b"></div>
         * var div = document.getElementById("a");
         * ARIA.hasRef(div, "labelledby"); // -> true
         * ARIA.hasRef(div, "controls"); // -> false
         * ARIA.hasRef(div, "describedby"); // -> false
         */
        hasRef: function hasRef(element, attribute) {

            return ARIA.has(element, attribute) && !ARIA.getRef(element, attribute).includes(null);
        },


        /**
         * Either removes the attribute from the given element or removes a part
         * of the attribute. Attributes can be removed/modified one at a time by
         * passing a string as the attribute parameter or multiple can be
         * manipulated by passing an object (to remove the entire attribute
         * when passing an object, set the value to null or undefined).
         *
         * The value can be a {@link ARIA~callback} and the returned value from
         * this callback will be treated as if it has been passed to the
         * function originally.
         *
         * When removing part of the attribute, if the attribute value becomes
         * blank then the attribute will be removed.
         *
         * Uses {@link ARIA.isObjectLike}, {@link ARIA.normalise},
         * {@link ARIA.List}, {@link ARIA.asArray}, {@link ARIA.asString},
         * {@link ARIA.removeDOMAttribute}, {@link ARIA.getDOMAttribute}, and
         * {@link ARIA.setDOMAttribute}
         *
         * @param {Element}       element
         *        Element to modify.
         * @param {Object|String} attribute
         *        Either the string of the attribute to remove/modify or an
         *        object of attributes to values.
         * @param {Array.<Element>|Boolean|Element|NodeList|String|ARIA~callback} [value]
         *        Value of the attribute to remove/modify. Only necessary if the
         *        attribute parameter is a string.
         *
         * @example <caption>Removing the attribute</caption>
         * // Assuming markup is
         * // <div id="one" aria-controls="two"></div>
         * var div = document.getElementById("div");
         * // All of these will remove the attribute
         * ARIA.remove(div, "controls");
         * ARIA.remove(div, "controls", undefined);
         * ARIA.remove(div, "controls", null);
         * ARIA.remove(div, "controls", function () {
         *     return undefined;
         * });
         * ARIA.remove(div, "controls", function () {
         *     return null;
         * });
         * ARIA.remove(div, "controls", function () {
         *     // not returning is the same as returning undefined
         * });
         * ARIA.remove(div, {
         *     controls: undefined
         * });
         * ARIA.remove(div, {
         *     controls: null
         * });
         * ARIA.remove(div, {
         *     controls: function () {
         *         return undefined;
         *     }
         * });
         * ARIA.remove(div, {
         *     controls: function () {
         *         return null;
         *     }
         * });
         * ARIA.remove(div, {
         *     controls: function () {
         *         // not returning is the same as returning undefined
         *     }
         * });
         * // Removing all values will remove the attribute
         * ARIA.remove(div, "controls", "two");
         * ARIA.remove(div, "controls", document.getElementById("two"));
         * ARIA.remove(div, "controls", function () {
         *     return "two";
         * });
         * ARIA.remove(div, "controls", function () {
         *     return document.getElementById("two");
         * });
         * ARIA.remove(div, {
         *     controls: "two"
         * });
         * ARIA.remove(div, {
         *     controls: document.getElementById("two")
         * });
         * ARIA.remove(div, {
         *     controls: function () {
         *        return "two";
         *     }
         * });
         * ARIA.remove(div, {
         *     controls: function () {
         *        return document.getElementById("two");
         *     }
         * });
         * // In each of these cases, the markup will now be.
         * // <div id="one"></div>
         *
         * @example <caption>Removing part of the attribute</caption>
         * // Assuming markup is
         * // <div id="one" aria-controls="two three"></div>
         * var div = document.getElementById("one");
         * // Each of these have the same effect.
         * ARIA.remove(div, "controls", "two");
         * ARIA.remove(div, "controls", document.getElementById("two"));
         * ARIA.remove(div, "controls", function () {
         *     return "two";
         * });
         * ARIA.remove(div, "controls", function () {
         *     return document.getElementById("two");
         * });
         * ARIA.remove(div, {
         *     controls: "two"
         * });
         * ARIA.remove(div, {
         *     controls: document.getElementById("two")
         * });
         * ARIA.remove(div, {
         *     controls: function () {
         *        return "two";
         *     }
         * });
         * ARIA.remove(div, {
         *     controls: function () {
         *        return document.getElementById("two");
         *     }
         * });
         * // In each of these cases, the markup will now be.
         * // <div id="one" aria-controls="three"></div>
         */
        remove: function remove(element, attribute, value) {

            if (ARIA.isObjectLike(attribute)) {

                Object.entries(attribute).forEach(function (_ref5) {
                    var _ref6 = _slicedToArray(_ref5, 2),
                        attr = _ref6[0],
                        val = _ref6[1];

                    return remove(element, attr, val);
                });
            } else {

                var normalised = ARIA.normalise(attribute);

                if (value === null || value === undefined) {
                    ARIA.removeDOMAttribute(element, normalised);
                } else {

                    var current = ARIA.getDOMAttribute(element, normalised);

                    if (typeof value === "function") {

                        remove(element, normalised, value(element, current, normalised));
                    } else {

                        var list = new ARIA.List(current);
                        var values = ARIA.asArray(value).map(ARIA.asString);

                        list.delete.apply(list, _toConsumableArray(values));

                        if (list.size) {
                            ARIA.setDOMAttribute(element, normalised, list);
                        } else {
                            ARIA.removeDOMAttribute(element, normalised);
                        }
                    }
                }
            }
        },

        /**
         * Adds a value to the given WAI-ARIA attribute for the given element.
         * If the element does not have the attribute, it is created. If the
         * value is a function, the result is added to the attribute. Attributes
         * can be either created/modified individually by passing a string as
         * the attribute parameter or mutliple can be set at once by passing an
         * object. Any duplicated values wil be ignored so you will not be able
         * to add a value that is already in the value.
         *
         * Uses {@link ARIA.isObjectLike}, {@link ARIA.normalise},
         * {@link ARIA.getDOMAttribute}, {@link ARIA.List},
         * {@link ARIA.asArray}, {@link ARIA.asString} and
         * {@link ARIA.setDOMAttribute}.
         *
         * @param {Element}       element
         *        Element to modify.
         * @param {Object|String} attribute
         *        Either the string of the attribute to create/modify or an
         *        object of attributes to values.
         * @param {Array.<Element>|Boolean|Element|NodeList|String|ARIA~callback} [value]
         *        Value of the attribute to create/modify. Only necessary if the
         *        attribute parameter is a string.
         *
         * @example <caption>Creating/adding to an attribute</caption>
         * // Assuming markup is
         * // <div id="a"></div>
         * // <div id="d"></div>
         * // <div id="g"></div>
         * var divA = document.getElementById("a");
         * var divD = document.getElementById("d");
         * var divG = document.getElementById("g");
         * ARIA.add(divA, "controls", "b");
         * // Now div "a" is
         * // <div id="a" aria-controls="b"></div>
         * ARIA.add(divA, "controls", function () { return "c"; });
         * // Now div "a" is
         * // <div id="a" aria-controls="b c"></div>
         * ARIA.add(divA, "controls", divD);
         * // Now div "a" is
         * // <div id="a" aria-controls="b c d"></div>
         * ARIA.add(divA, {controls: "e"});
         * // Now div "a" is
         * // <div id="a" aria-controls="b c d e"></div>
         * ARIA.add(divA, {controls: function () { return "f"; }});
         * // Now div "a" is
         * // <div id="a" aria-controls="b c d e f"></div>
         * ARIA.add(divA, {controls: function () { return divG; }});
         * // Now div "a" is
         * // <div id="a" aria-controls="b c d e f g"></div>
         *
         * @example <caption>Duplicate values are ignored</caption>
         * // Assuming markup is
         * // <div id="one" aria-controls="two"></div>
         * // <div id="two"></div>
         * var div1 = document.getElementById("one");
         * var div2 = document.getElementById("two");
         * ARIA.add(div1, "controls", "two");
         * // Div "one" is still
         * // <div id="one" aria-controls="two"></div>
         * ARIA.add(div1, "controls", function () { return "two"; });
         * // Div "one" is still
         * // <div id="one" aria-controls="two"></div>
         * ARIA.add(div1, "controls", div2);
         * // Div "one" is still
         * // <div id="one" aria-controls="two"></div>
         * ARIA.add(div1, "controls", function () { return div2; });
         * // Div "one" is still
         * // <div id="one" aria-controls="two"></div>
         * ARIA.add(div1, {controls: "two"});
         * // Div "one" is still
         * // <div id="one" aria-controls="two"></div>
         * ARIA.add(div1, {controls: function () { return "two"; }});
         * // Div "one" is still
         * // <div id="one" aria-controls="two"></div>
         * ARIA.add(div1, {controls: div2});
         * // Div "one" is still
         * // <div id="one" aria-controls="two"></div>
         * ARIA.add(div1, {controls: function () { return div2; }});
         * // Div "one" is still
         * // <div id="one" aria-controls="two"></div>
         */
        add: function add(element, attribute, value) {

            if (ARIA.isObjectLike(attribute)) {

                Object.entries(attribute).forEach(function (_ref7) {
                    var _ref8 = _slicedToArray(_ref7, 2),
                        attr = _ref8[0],
                        val = _ref8[1];

                    return add(element, attr, val);
                });
            } else {

                var attr = ARIA.normalise(attribute);
                var current = ARIA.getDOMAttribute(element, attr);

                if (typeof value === "function") {
                    value = value(element, current, attr);
                }

                var list = new ARIA.List(current);
                var values = ARIA.asArray(value).map(ARIA.asString);

                list.add.apply(list, _toConsumableArray(values));
                ARIA.setDOMAttribute(element, attr, list);
            }
        }

    });

    ARIA.extend( /** @lends ARIA */{

        /**
         * Sets the role of the given element.
         *
         * Uses {@link ARIA.setDOMAttribute}
         *
         * @param {Element} element
         *        Element whose role should be set.
         * @param {String}  role
         *        Value of the role to set.
         *
         * @example
         * // Assuming markup is:
         * // <div id="one"></div>
         * var div = document.getElementById("one");
         * ARIA.setRole(div, "tablist");
         * // Now markup is
         * // <div id="one" role="tablist"></div>
         * ARIA.setRole(div, "presentation");
         * // Now markup is
         * // <div id="one" role="presentation"></div>
         */
        setRole: function setRole(element, role) {
            ARIA.setDOMAttribute(element, "role", role);
        },


        /**
         * Gets the role of the given element.
         *
         * Uses {@link ARIA.getDOMAttribute}
         *
         * Used by {@link ARIA.hasRole}, {@link ARIA.addRole} and
         * {@link ARIA.removeRole}
         *
         * @param  {Element}     element
         *         Element whose role should be returned.
         * @return {String|null}
         *         The value of the role or null if the element does not have a
         *         role attribute.
         *
         * @example
         * // Assuming markup is:
         * // <div id="one" role="tablist"></div>
         * // <div id="two"></div>
         * ARIA.getRole(document.getElementById("one")); // -> "tablist"
         * ARIA.getRole(document.getElementById("two")); // -> null
         */
        getRole: function getRole(element) {
            return ARIA.getDOMAttribute(element, "role");
        },


        /**
         * Checks to see if the given element has a role. If the role is
         * defined, the check is to see whether or not the role contains the
         * given value.
         *
         * Uses {@ARIA.hasDOMAttribute}, {@link ARIA.List} and {@ARIA.getRole}.
         *
         * @param  {Element}  element
         *         Element to test.
         * @param  {String}   [role]
         *         Option role to check.
         * @return {Boolean}
         *         true if the element has a role (or the specific role), false
         *         otherwise.
         *
         * @example <caption>Checking for a role</caption>
         * // Assuming markup is:
         * // <div id="one" role="tablist"></div>
         * // <div id="two"></div>
         * ARIA.hasRole(document.getElementById("one")); // -> true
         * ARIA.hasRole(document.getElementById("two")); // -> false
         *
         * @example <caption>Checking for a specific role</caption>
         * // Assuming markup is:
         * // <div id="one" role="tablist"></div>
         * var div = document.getElementById("one");
         * ARIA.hasRole(div, "tablist"); // -> true
         * ARIA.hasRole(div, "tab"); // -> false
         * ARIA.hasRole(div, "presentation"); // -> false
         */
        hasRole: function hasRole(element, role) {

            var has = ARIA.hasDOMAttribute(element, "role");

            if (role && has) {

                var list = new ARIA.List(ARIA.getRole(element));

                has = list.has(role);
            }

            return has;
        },


        /**
         * Adds one or more roles to the given element. If the element didn't
         * have a role attribute before adding, the attribute is created.
         *
         * Uses {@link ARIA.List}, {@link ARIA.getRole} and
         * {@link ARIA.setRole}.
         *
         * @param {Element}   element
         *        Element whose role should be manipulated.
         * @param {...String} roles
         *        Roles to add.
         *
         * @example
         * // Assuming markup is:
         * // <div id="one" role="presentation"></div>
         * // <div id="two"></div>
         * var div1 = document.getElementById("one");
         * var div2 = document.getElementById("two");
         * ARIA.addRole(div1, "tablist");
         * // Now markup is:
         * // <div id="one" role="presentation tablist"></div>
         * // <div id="two"></div>
         * ARIA.addRole(div1, "image", "tab");
         * // Now markup is:
         * // <div id="one" role="presentation tablist image tab"></div>
         * // <div id="two"></div>
         * ARIA.addRole(div2, "panel");
         * // Now markup is:
         * // <div id="one" role="presentation tablist image tab"></div>
         * // <div id="two" role="panel"></div>
         *
         * @example <caption>Roles are not duplicated</caption>
         * // Assuming markup is:
         * // <div id="one" role="tablist"></div>
         * var div = document.getElementById("one");
         * ARIA.addRole(div, "tablist");
         * // Markup is still:
         * // <div id="one" role="tablist"></div>
         * ARIA.addRole(div, "tablist", "presentation", "tablist");
         * // Markup is now:
         * // <div id="one" role="tablist presentation"></div>
         */
        addRole: function addRole(element) {

            var list = new ARIA.List(ARIA.getRole(element));

            for (var _len3 = arguments.length, roles = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
                roles[_key3 - 1] = arguments[_key3];
            }

            list.add.apply(list, _toConsumableArray(roles));
            ARIA.setRole(element, list);
        },


        /**
         * Removes one or more roles from the given element. If no roles are
         * defined or all roles are removed, the role attribute is removed.
         *
         * Uses {@link ARIA.List}, {@link ARIA.getRole}, {@link ARIA.setRole}
         * and {@link ARIA.removeDOMAttribute}.
         *
         * @param {Element}   element
         *        Element whose roles should be manipulated.
         * @param {...String} [roles]
         *        Optional roles to removed.
         *
         * @example <caption>Removing individual roles</caption>
         * // Assuming markup is:
         * // <div id="one" role="image tab panel banner"></div>
         * var div = document.getElementById("one");
         * ARIA.removeRole(div, "tab");
         * // Now markup is:
         * // <div id="one" role="image panel banner"></div>
         * ARIA.removeRole(div, "banner", "image");
         * // Now markup is:
         * // <div id="one" role="panel"></div>
         *
         * @example <caption>Removing the role attribute</caption>
         * // Assuming markup is:
         * <div id="one" role="banner"></div>
         * <div id="two" role="image"></div>
         * ARIA.removeRole(document.getElementById("one"), "banner");
         * // Assuming markup is:
         * <div id="one"></div>
         * <div id="two" role="image"></div>
         * ARIA.removeRole(document.getElementById("two"));
         * // Assuming markup is:
         * <div id="one"></div>
         * <div id="two"></div>
         */
        removeRole: function removeRole(element) {
            for (var _len4 = arguments.length, roles = Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
                roles[_key4 - 1] = arguments[_key4];
            }

            if (roles.length) {

                var list = new ARIA.List(ARIA.getRole(element));

                list.delete.apply(list, roles);

                if (list.size) {
                    ARIA.setRole(element, list);
                } else {
                    removeRole(element);
                }
            } else {
                ARIA.removeDOMAttribute(element, "role");
            }
        }

    });

    var focusable = ["a[href]", "button", "iframe", "input:not([type=\"hidden\"]):not([type=\"file\"])", "select", "textarea", "[tabindex]", "[contentEditable=\"true\"]"].map(function (sel) {
        return sel + ":not([disabled]):not([hidden]):not([inert])";
    }).join(",");

    ARIA.extendHidden( /** @lends ARIA */{

        /**
         * A wrapped for matching an element with a CSS selector.
         *
         * Used in {@link ARIA.makeFocusable}.
         *
         * @private
         * @param   {Element}  element
         *          Element to test.
         * @param   {String}   selector
         *          CSS selector to match.
         * @return  {Boolean}
         *          true if the element matches, false otherwise.
         *
         * @example
         * var div // -> <div id="one">
         * ARIA.is(div, "div"); // -> true
         * ARIA.is(div, "#one"); // -> true
         * ARIA.is(div, "[id]"); // -> true
         * ARIA.is(div, ".class"); // -> false
         */
        is: function is(element, selector) {
            return element.matches(selector);
        }
    });

    ARIA.extend( /** @lends ARIA */{

        /**
         * A CSS selector that matches elements which are already focusable.
         *
         * Used in {@link ARIA.makeFocusable}.
         *
         * @type {String}
         */
        focusable: focusable,

        /**
         * Makes the given element focusable. If the isTabbable flag is set to
         * true then the element will be added to the tab order, if not then
         * the element will only be programmatically focusable. This function
         * will not affect any element that is already focusable (identified
         * using the {@link ARIA.focusable} selector).
         *
         * Uses {@link ARIA.is} and {@link ARIA.focusable} and
         * {@link ARIA.setDOMAttribute}.
         *
         * @param {Element} element
         *        Element that should become focusable.
         * @param {Boolean} [isTabbable=false]
         *        true if the element should be added to the tab order.
         *
         * @example
         * // Assuming markup is:
         * // <div id="one"></div>
         * // <div id="two"></div>
         * var div1 = document.getElementById("one");
         * var div2 = document.getElementById("two");
         * ARIA.makeFocusable(div1);
         * // Now markup is:
         * // <div id="one" tabindex="-1"></div>
         * // <div id="two"></div>
         * ARIA.makeFocusable(div2, true);
         * // Now markup is:
         * // <div id="one" tabindex="-1"></div>
         * // <div id="two" tabindex="0"></div>
         *
         * @example <caption>No effect to already focusable elements</caption>
         * // Assuming markup is:
         * // <a href="#" class=".one"></a>
         * // <div tabindex="0" class=".one"></div>
         * // <button type="button" class=".one"></button>
         * // <input type="text" class=".one">
         * document.querySelectorAll(".one").forEach(function (element) {
         *     ARIA.makeFocusable(element);
         * });
         * // Markup is still:
         * // <a href="#" class=".one"></a>
         * // <div tabindex="0" class=".one"></div>
         * // <button type="button" class=".one"></button>
         * // <input type="text" class=".one">
         */
        makeFocusable: function makeFocusable(element) {
            var isTabbable = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;


            if (!ARIA.is(element, ARIA.focusable)) {

                ARIA.setDOMAttribute(element, "tabindex", isTabbable ? 0 : -1);
            }
        }
    });

    /**
     * A helper function that chains together methods and can work with a
     * collection of elements. This function aims to make working with the
     * {@link ARIA} methods easier. The methods will manipulate the element(s)
     * but they will not return anything that the methods would. For example,
     * you can chain {@link ARIA.set} but you will not get anything back from
     * {@link ARIA.get}.
     *
     * The chaining functions work by automatically passing the element as the
     * first argument to the original {@link ARIA} method.
     *
     * Uses {@link ARIA.asArray}.
     *
     * @param  {Array.<Element>|Element} elements
     *         Element or elements to manipulate.
     * @return {Object}
     *         Chain object.
     *
     * @example <caption>Working with an element</caption>
     * // Assuming markup is:
     * // <div id="one"></div>
     * ARIA.chain(document.getElementById("one"))
     *     .set({
     *         busy: true,
     *         label: "abc"
     *     })
     *     .makeFocusable()
     * // Now markup is:
     * // <div id="one" aria-busy="true" aria-label="abc" tabindex="-1"></div>
     *
     * @example <caption>Working with multiple elements</caption>
     * // Assuming markup is:
     * // <div id="one"></div>
     * // <div class="thing"></div>
     * // <div class="thing"></div>
     * ARIA.chain(document.querySelectorAll(".thing"))
     *     .identify()
     *     .set("labelledby", document.getElementById("one"));
     * // Now markup is
     * // <div id="one"></div>
     * // <div class="thing" id="anonymous-element-0" aria-labelledby="one"></div>
     * // <div class="thing" id="anonymous-element-1" aria-labelledby="one"></div>
     */
    ARIA.chain = function (elements) {

        return new Proxy(ARIA, {

            get: function get(target, name) {

                return typeof target[name] === "function" ? function () {
                    for (var _len5 = arguments.length, args = Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
                        args[_key5] = arguments[_key5];
                    }

                    ARIA.asArray(elements).forEach(function (element) {
                        target[name].apply(target, [element].concat(args));
                    });

                    return this;
                } : target[name];
            }

        });
    };

    ARIA.extendHidden( /** @lends ARIA */{

        /**
         * The WeakMap used to store the MutationObserver that makes the events
         * work.
         *
         * Used in {@link ARIA.startListening} and {@link ARIA.stopListening}.
         *
         * @private
         * @type    {WeakMap}
         */
        observerStore: new WeakMap(),

        /**
         * A wrapper for adding an event listener to an element. The event is
         * always bound in the bubbling phase. The event object is passed to the
         * hander. This function enables a developer to replace this function if
         * they want {@link ARIA} to work with a virtual DOM.
         *
         * Used in {@link ARIA.on}.
         *
         * @private
         * @param   {Element}  element
         *          Element that should gain the event listener.
         * @param   {String}   event
         *          Name of the event to bind.
         * @param   {Function} handler
         *          Handler for the event listener.
         *
         * @example
         * // Assuming markup is:
         * // <div id="one"></div>
         * var div = document.getElementById("one");
         * ARIA.addEventListener(one, "click", function (event) {
         *     console.log("hi");
         * });
         * // Event listener is now bound.
         */
        addEventListener: function addEventListener(element, event, handler) {
            element.addEventListener(event, handler);
        },


        /**
         * A wrapper for removing an event listener from an element. The event
         * listener is always in the bubbling phase. This function enables a
         * developer to replace this function if they want {@link ARIA} to work
         * with a virtual DOM.
         *
         * Used in {@link ARIA.off}.
         *
         * @private
         * @param   {Element}  element
         *          Element whose event handler sound be removed.
         * @param   {String}   event
         *          Name of the event.
         * @param   {Function} handler
         *          Function to remove.
         *
         * @example
         * // Assuming markup is:
         * // <div id="one"></div>
         * var div = document.getElementById("one");
         * var handler = function () {
         *     console.log("hi");
         * };
         * ARIA.addEventListener(one, "click", handler);
         * // Event listener is now bound.
         * ARIA.removeEventListener(one, "click", handler);
         * // Event listener is now un-bound.
         */
        removeEventListener: function removeEventListener(element, event, handler) {
            element.removeEventListener(event, handler);
        },


        /**
         * A wrapper for dispatching an event on an element. The dispatched
         * event always bubbles. This function enables a developer to replace
         * this function if they want {@link ARIA} to work with a virtual DOM.
         *
         * Used in {@link ARIA.startListening}.
         *
         * @private
         * @param   {Element} element
         *          Element that should have an event dispatched.
         * @param   {String}  event
         *          Name of the vent to dispatch.
         * @param   {Object}  [detail={}]
         *          Optional information for the event.
         *
         * @example
         * // Assuming markup is:
         * // <div id="one"></div>
         * var div = document.getElementById("one");
         * div.addEventListener("test", function () {
         *     console.log("hi");
         * });
         * ARIA.dispatchEvent(div, "test"); // logs: "hi"
         *
         * @example <caption>Padding information to the handler</caption>
         * // Assuming markup is:
         * // <div id="one"></div>
         * var div = document.getElementById("one");
         * div.addEventListener("test", function (e) {
         *     console.log(e.detail.data);
         * });
         * ARIA.dispatchEvent(div, "test" {data: "abc"}); // logs: "abc"
         */
        dispatchEvent: function dispatchEvent(element, event) {
            var detail = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};


            element.dispatchEvent(new CustomEvent(event, {
                bubbles: true,
                cancelable: true,
                detail: detail
            }));
        },


        /**
         * Creates the function that will handle the mutations detected by a
         * MutationObserver listening to the given element.
         *
         * Uses {@link ARIA.handleMutation}.
         *
         * Used in {@link ARIA.startListening}.
         *
         * @private
         * @param   {Element}  element
         *          Element that has the MutationObserver listening for changes.
         * @return  {Function}
         *          Function that will handle mutations.
         */
        createMutationHandler: function createMutationHandler(element) {

            return function (mutationList) {
                mutationList.forEach(ARIA.handleMutation, element);
            };
        },


        /**
         * Checks to see whether the mutation was aa WAI-ARIA attribute and
         * whether the value has actually changed before dispatching an event on
         * the element bound as the function's context.
         *
         * Uses {@link ARIA.dispatchEvent}, {@link ARIA.makeEventName} and
         * {@link ARIA.getDOMAttribute}.
         *
         * Used in {@link ARIA.createMutationHandler}.
         *
         * @private
         * @this    {Element}
         *          Element upon which the mutations were heard.
         * @param   {MutationRecord} mutation
         *          Object with information about the mutation.
         */
        handleMutation: function handleMutation(mutation) {
            var type = mutation.type,
                attributeName = mutation.attributeName,
                oldValue = mutation.oldValue;

            var element = this;

            if (type === "attributes" && attributeName.startsWith("aria-")) {

                var value = ARIA.getDOMAttribute(element, attributeName);

                if (value !== oldValue) {

                    var event = ARIA.makeEventName(attributeName);

                    ARIA.dispatchEvent(element, event, {
                        attributeName: attributeName,
                        value: value,
                        oldValue: oldValue
                    });
                }
            }
        }
    });

    ARIA.extend( /** @lends ARIA */{

        eventNamePrefix: "wai-aria__",

        /**
         * Creates the event name from the given attribute. The event is
         * normalised (see {@link ARIA.normalise}) and prefixed with
         * {@link ARIA.eventNamePrefix}.
         *
         * Uses {@link ARIA.eventNamePrefix} and {@link ARIA.normalise}.
         *
         * @param {String} attribute
         *        Attribute to convert into an event name.
         *
         * @example
         * ARIA.makeEventName("busy"); // -> "wai-aria__aria-busy"
         * ARIA.makeEventName("aria-checked"); // -> "wai-aria__aria-checked"
         */
        makeEventName: function makeEventName(attribute) {
            return ARIA.eventNamePrefix + ARIA.normalise(attribute);
        },


        /**
         * Starts listening to WAI-ARIA attribute changes and dispatching an
         * event when a change occurs. Listening occurs through a
         * MutationObserver which is stored on the element using
         * {@link ARIA.observer}. If the element is already listening for
         * attribute changes, no action is taken. The MutationObserver can be
         * disconnected using {@link ARIA.stopListening}.
         *
         * Uses {@link ARIA.observerStore}, {@link ARIA.createMutationHandler}.
         *
         * Used in {@link ARIA.on}.
         *
         * @param {Element} element
         *        Element whose WAI-ARIA attribute changes should be listened
         *        for.
         *
         * @example
         * // Assuming markup is:
         * // <div id="one"></div>
         * var div = document.getElementById("one");
         * ARIA.startListening(div);
         * div[ARIA.observer]; // -> MutationObserver
         */
        startListening: function startListening(element) {

            var store = ARIA.observerStore;

            if (!store.has(element)) {

                var observer = new MutationObserver(ARIA.createMutationHandler(element));

                observer.observe(element, {
                    attributes: true,
                    attributeOldValue: true
                });

                store.set(element, observer);
            }
        },


        /**
         * Disconnects the MutationObserver added in {@link ARIA.startListening}
         * and removes it from the given element (if it was there in the first
         * place). This function isn't called in the {@link ARIA} library but it
         * may be useful for unloading elements.
         *
         * Uses {@link ARIA.observerStore}.
         *
         * @param {Element} element
         *        Element whose MutationObserver should disconnect and be
         *        removed.
         *
         * @example
         * // Assuming markup is:
         * // <div id="one"></div>
         * var div = document.getElementById("one");
         * ARIA.startListening(div);
         * div[ARIA.observer]; // -> MutationObserver
         * ARIA.stopListening(div);
         * div[ARIA.observer]; // -> undefined
         */
        stopListening: function stopListening(element) {

            var store = ARIA.observerStore;
            var observer = store.get(element);

            if (observer) {

                observer.disconnect();
                store.delete(element);
            }
        },


        /**
         * Adds one or more event listeners to an element. The event listeners
         * listen for changes to WAI-ARIA attributes and the role attribute.
         * This function will only work if the changes on the element are being
         * listened to so this function will automatically call
         * {@link ARIA.startListening}. Calling {@link ARIA.stopListening} on
         * the element will prevent the event handlers from executing.
         *
         * To remove an event listener, use {@link ARIA.off}.
         *
         * Uses {@link ARIA.isObjectLike}, {@link ARIA.List},
         * {@link ARIA.makeEventName} and {@link ARIA.addEventListener}.
         *
         * @param {Element}                      element
         *        Element to bind listeners.
         * @param {Array.<String>|Object|String} attributes
         *        Either an object of attributes to handlers, an array of
         *        attributes or a string of space-separated attributes.
         * @param {Function}                     [handler]
         *        Handler to execute when the attribute changes. This is only
         *        required if the attributes parameters is not an object.
         *
         * @example <caption>Listening for one attribute change</caption>
         * // Assuming markup is:
         * // <div id="one" aria-busy="true"></div>
         * var div = document.getElementById("one");
         * ARIA.on(div, "busy", function (e) {
         *     console.log(
         *         "'%s' changed from '%s' to '%s'",
         *         e.detail.attributeName,
         *         e.detail.oldValue,
         *         e.detail.value
         *     );
         * });
         * ARIA.set(div, "busy", false);
         * // Logs "'aria-busy' changed from 'true' to 'false'"
         *
         * @example <caption>Listening for multiple attribute changes</caption>
         * // Assuming markup is:
         * // <div id="one" aria-busy="true" aria-checked="true"></div>
         * var div = document.getElementById("one");
         * // You can use either an array of strings ...
         * ARIA.on(div, ["busy", "checked"], function (e) {
         *     console.log("'%s' changed", e.detail.attributeName);
         * });
         * // ... or a space-separated string.
         * ARIA.on(div, "busy checked", function () {
         *     console.log("'%s' changed", e.detail.attributeName);
         * });
         * ARIA.set(div, "busy", false);
         * // Logs "'aria-busy' changed"
         * ARIA.set(div, "checked", false);
         * // Logs "'aria-checked' changed"
         *
         * @example <caption>Multiple events and handlers</caption>
         * // Assuming markup is:
         * // <div id="one" aria-busy="true" aria-checked="true"></div>
         * var div = document.getElementById("one");
         * ARIA.on(div, {
         *     busy: function (e) {
         *         console.log("'%s' changed (1)", e.detail.attributeName);
         *     },
         *     checked: function (e) {
         *         console.log("'%s' changed (2)", e.detail.attributeName);
         *     }
         * });
         * ARIA.set(div, "busy", false);
         * // Logs "'aria-busy' changed (1)"
         * ARIA.set(div, "checked", false);
         * // Logs "'aria-checked' changed (2)"
         */
        on: function on(element, attributes, handler) {

            if (ARIA.isObjectLike(attributes)) {

                Object.entries(attributes).forEach(function (_ref9) {
                    var _ref10 = _slicedToArray(_ref9, 2),
                        attr = _ref10[0],
                        func = _ref10[1];

                    return on(element, attr, func);
                });
            } else {

                var list = new ARIA.List(attributes);

                ARIA.startListening(element);
                list.toArray(ARIA.makeEventName).forEach(function (event) {
                    ARIA.addEventListener(element, event, handler);
                });
            }
        },

        /**
         * Removes an event listener from the given element. The event listener
         * would have been triggered if a WAI-ARIA attribute changed.
         *
         * Used {@link ARIA.List}, {@link ARIA.makeEventName} and
         * {@link ARIA.removeEventListener}.
         *
         * @param {Element}                      element
         *        Element from which the event handler should be removed.
         * @param {Array.<String>|Object|String} attributes
         *        Either an array of attributes, a space-separated string of
         *        attributes or an object of attributes to functions.
         * @param {Function}                     [handler]
         *        Function to remove.
         *
         * @example <caption>Removing a single handler</caption>
         * // Assuming markup is:
         * // <div id="one"></div>
         * var div = document.getElementById("one");
         * var handler = function () {
         *     // ...
         * };
         * // ...
         * ARIA.off(div, "busy", handler);
         *
         * @example <caption>Removing a handler from multiple attributes</caption>
         * // Assuming markup is:
         * // <div id="one"></div>
         * var div = document.getElementById("one");
         * var handler = function () {
         *     // ...
         * };
         * // ...
         * // Either:
         * ARIA.off(div, ["busy", "checked"], handler);
         * // Or:
         * ARIA.off(div, "busy checked", handler);
         *
         * @example <caption>Removing multiple handlers</caption>
         * // Assuming markup is:
         * // <div id="one"></div>
         * var div = document.getElementById("one");
         * var handler1 = function () {
         *     // ...
         * };
         * var handler2 = function () {
         *     // ...
         * };
         * // ...
         * ARIA.off(div, {
         *     busy: handler1,
         *     checked: handler2
         * });
         */
        off: function off(element, attributes, handler) {

            if (ARIA.isObjectLike(attributes)) {

                Object.entries(attributes).forEach(function (_ref11) {
                    var _ref12 = _slicedToArray(_ref11, 2),
                        attr = _ref12[0],
                        func = _ref12[1];

                    return off(element, attr, func);
                });
            } else {

                var list = new ARIA.List(attributes);

                list.toArray(ARIA.makeEventName).forEach(function (event) {
                    ARIA.removeEventListener(element, event, handler);
                });
            }
        }

    });
})(window);
//# sourceMappingURL=aria.js.map
//# sourceMappingURL=aria.es5.js.map
