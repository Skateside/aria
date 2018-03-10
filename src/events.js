(function (ARIA) {

    "use strict";

    let observer = Symbol("WAI-ARIA observer");

    ARIA.extendHidden(/** @lends ARIA */{

        /**
         * The property used to contain the MutationObserver that makes the
         * events work.
         *
         * Used in {@link ARIA.startListening} and {@link ARIA.stopListening}.
         *
         * @private
         * @type    {Symbol}
         */
        observer,

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
        addEventListener(element, event, handler) {
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
        removeEventListener(element, event, handler) {
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
        dispatchEvent(element, event, detail = {}) {

            element.dispatchEvent(new CustomEvent(event, {
                bubbles: true,
                cancelable: true,
                detail
            }));

        }

    });

    ARIA.extend(/** @lends ARIA */{

        /**
         * Creates the event name from the given attribute. The event is
         * normalised (see {@link ARIA.normalise}) and prefixed with
         * "wai-aria__"
         *
         * Uses {@link ARIA.normalise}.
         *
         * @param {String} attribute
         *        Attribute to convert into an event name.
         *
         * @example
         * ARIA.makeEventName("busy"); // -> "wai-aria__aria-busy"
         * ARIA.makeEventName("aria-checked"); // -> "wai-aria__aria-checked"
         */
        makeEventName(attribute) {
            return `wai-aria__${ARIA.normalise(attribute)}`;
        },

        /**
         * Starts listening to WAI-ARIA attribute changes and dispatching an
         * event when a change occurs. Listening occurs through a
         * MutationObserver which is stored on the element using
         * {@link ARIA.observer}. If the element is already listening for
         * attribute changes, no action is taken. The MutationObserver can be
         * disconnected using {@link ARIA.stopListening}.
         *
         * Uses {@link ARIA.observer}, {@link ARIA.dispatchEvent},
         * {@link ARIA.makeEventName} and {@link ARIA.getDOMAttribute}.
         *
         * @param {Element} element
         *        Element whose WAI-ARIA attribute changes should be listened
         *        for.
         */
        startListening(element) {

            if (!element[ARIA.observer]) {

                let observer = new MutationObserver(function (mutationsList) {

                    mutationsList.forEach(function (mutation) {

                        let {
                            type,
                            attributeName,
                            oldValue
                        } = mutation;

                        if (
                            type === "attributes"
                            && attributeName.startsWith("aria-")
                        ) {

                            ARIA.dispatchEvent(
                                element,
                                ARIA.makeEventName(attributeName),
                                {
                                    value: ARIA.getDOMAttribute(attributeName),
                                    oldValue
                                }
                            );

                        }

                    });

                });

                observer.observe(element, {
                    attributes: true,
                    attributeOldValue: true
                });

                element[ARIA.observer] = observer;

            }

        },

        stopListening(element) {

            if (element[ARIA.observer]) {

                element[ARIA.observer].disconnect();
                delete element[ARIA.observer];

            }

        },

        on(element, attributes, handler) {

            let list = new ARIA.List(attributes);

            ARIA.startListening(element);
            list
                .toArray(ARIA.makeEventName)
                .forEach(function (event) {
                    ARIA.addEventListener(element, event, handler);
                });

        },

        off(element, attributes, handler) {

            let list = new ARIA.List(attributes);

            list
                .toArray(ARIA.makeEventName)
                .forEach(function (event) {
                    ARIA.removeEventListener(element, event, handler);
                });

        }

    });

}(window.ARIA));
