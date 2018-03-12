(function (ARIA) {

    "use strict";

    ARIA.extendHidden(/** @lends ARIA */{

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
        createMutationHandler(element) {

            return (mutationList) => {
                mutationList.forEach(ARIA.handleMutation, element)
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
        handleMutation(mutation) {

            let {
                type,
                attributeName,
                oldValue
            } = mutation;
            let element = this;

            if (type === "attributes" && attributeName.startsWith("aria-")) {

                let value = ARIA.getDOMAttribute(element, attributeName);

                if (value !== oldValue) {

                    let event = ARIA.makeEventName(attributeName);

                    ARIA.dispatchEvent(element, event, {
                        attributeName,
                        value,
                        oldValue
                    });

                }

            }

        }


    });

    ARIA.extend(/** @lends ARIA */{

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
        makeEventName(attribute) {
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
        startListening(element) {

            let store = ARIA.observerStore;

            if (!store.has(element)) {

                let observer = new MutationObserver(
                    ARIA.createMutationHandler(element)
                );

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
        stopListening(element) {

            let store = ARIA.observerStore;
            let observer = store.get(element);

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

                Object
                    .entries(attributes)
                    .forEach(([attr, func]) => on(element, attr, func));

            } else {

                let list = new ARIA.List(attributes);

                ARIA.startListening(element);
                list
                    .toArray(ARIA.makeEventName)
                    .forEach(function (event) {
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

                Object
                    .entries(attributes)
                    .forEach(([attr, func]) => off(element, attr, func));

            } else {

                let list = new ARIA.List(attributes);

                list
                    .toArray(ARIA.makeEventName)
                    .forEach(function (event) {
                        ARIA.removeEventListener(element, event, handler);
                    });

            }

        }

    });

}(window.ARIA));
