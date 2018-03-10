(function (ARIA) {

    "use strict";

    let focusable = [
            "a[href]",
            "button",
            "iframe",
            "input:not([type=\"hidden\"]):not([type=\"file\"])",
            "select",
            "textarea",
            "[tabindex]",
            "[contentEditable=\"true\"]"
        ]
        .map((sel) => `${sel}:not([disabled]):not([hidden]):not([inert])`)
        .join(",");

    ARIA.extendHidden(/** @lends ARIA */{

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
        is(element, selector) {
            return element.matches(selector);
        }

    });

    ARIA.extend(/** @lends ARIA */{

        /**
         * A CSS selector that matches elements which are already focusable.
         *
         * Used in {@link ARIA.makeFocusable}.
         *
         * @type {String}
         */
        focusable,

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
        makeFocusable(element, isTabbable = false) {

            if (!ARIA.is(element, ARIA.focusable)) {

                ARIA.setDOMAttribute(
                    element,
                    "tabindex",
                    isTabbable
                        ? 0
                        : -1
                );

            }

        }

    });

}(window.ARIA));
