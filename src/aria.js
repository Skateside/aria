(function (ARIA) {

    "use strict";

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

    ARIA.extend(/** @lends ARIA */{

        /**
         * Sets one or more WAI-ARIA attributes on the given element. Attribute
         * names will be normalised (see {@link ARIA.normalise}). When passing
         * in an object of multiple attributes to set, the values of the object
         * can be anything that the "value" parameter can be, including
         * {@link ARIA~callback}.
         *
         * Uses {@link ARIA.normalise}, {@link ARIA.getDOMAttribute},
         * {@link ARIA.asArray}, {@link ARIA.asString},
         * {@link ARIA.setDOMAttribute} and {@link ARIA.List}
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

            if (attribute && typeof attribute === "object") {

                Object
                    .entries(attribute)
                    .forEach(([attr, val]) => set(element, attr, val));

            } else {

                let attr = ARIA.normalise(attribute);

                if (typeof value === "function") {

                    value = value(
                        element,
                        ARIA.getDOMAttribute(element, attr),
                        attr
                    );

                }

                let list = new ARIA.List(
                    ARIA.asArray(value).map(ARIA.asString)
                );

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
        get(element, attribute) {
            return ARIA.getDOMAttribute(element, ARIA.normalise(attribute));
        },

        /**
         * Gets the references from the given element's attribute. The attribute
         * is normalised (see {@link ARIA.normalise}) and the results are
         * returned in an array.
         *
         * Uses {@link ARIA.List} and {@link ARIA.get}.
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
        getRef(element, attribute) {

            let list = new ARIA.List(ARIA.get(element, attribute));

            return list.toArray(ARIA.getById);

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
        has(element, attribute) {
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
        hasRef(element, attribute) {

            return (
                ARIA.has(element, attribute)
                && !ARIA.getRef(element, attribute).includes(null)
            );

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
         * Uses {@link ARIA.normalise}, {@link ARIA.List},
         * {@link ARIA.asArray}, {@link ARIA.asString},
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

            if (attribute && typeof attribute === "object") {

                Object
                    .entries(attribute)
                    .forEach(([attr, val]) => remove(element, attr, val));

            } else {

                let normalised = ARIA.normalise(attribute);

                if (value === null || value === undefined) {
                    ARIA.removeDOMAttribute(element, normalised);
                } else {

                    let current = ARIA.getDOMAttribute(element, normalised);

                    if (typeof value === "function") {
                        value = value(element, current, normalised);
                    }

                    let list = new ARIA.List(current);
                    let values = ARIA.asArray(value).map(ARIA.asString);

                    list.delete(...values);

                    if (list.size) {
                        ARIA.setDOMAttribute(element, normalised, list);
                    } else {
                        ARIA.removeDOMAttribute(element, normalised);
                    }

                }

            }

        },

        add: function add(element, attribute, value) {

            if (attribute && typeof attribute === "object") {

                Object
                    .entries(attribute)
                    .forEach(([attr, val]) => add(element, attr, val));

            } else {

                let attr = ARIA.normalise(attribute);
                let current = ARIA.getDOMAttribute(element, attr);

                if (typeof value === "function") {
                    value = value(element, current, attr);
                }

                let list = new ARIA.List(current);
                let values = ARIA.asArray(value).map(ARIA.asString);

                list.add(...values);
                ARIA.setDOMAttribute(element, attr, list);

            }

        }

    });

}(window.ARIA));