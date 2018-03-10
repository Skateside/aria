(function (ARIA) {

    "use strict";

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

            get: function (target, name) {

                return typeof target[name] === "function"
                    ? function (...args) {

                        ARIA.asArray(elements).forEach(function (element) {
                            target[name](element, ...args);
                        });

                        return this;

                    }
                    : target[name];

            }

        });

    };

}(window.ARIA));
