(function (glob) {

    "use strict";

    let ARIA = {};
    let VERSION = "1.0.0";
    let previousAria = glob.ARIA;
    let hiddenDescriptor = {
        configurable: true,
        enumerable: false,
        writable: true
    };

    function extend(methods) {
        Object.assign(ARIA, methods);
    }

    function extendHidden(methods) {

        Object.entries(methods).forEach(function ([name, value]) {

            Object.defineProperty(
                ARIA,
                name,
                Object.assign({value}, hiddenDescriptor)
            );

        });

    }

    Object.defineProperty(ARIA, "VERSION", {
        configurable: false,
        enumerable: true,
        writable: false,
        value: VERSION
    });

    extendHidden({
        extend,
        extendHidden
    });

    ARIA.noConflict = function () {

        glob.ARIA = previousAria;

        return ARIA;

    };

    glob.ARIA = ARIA;

}(window));

(function (ARIA) {

    "use strict";

    // Wrappers for DOM attribute manipulation.
    ARIA.extendHidden({

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
        }

    });

    // Helper functions that we'll ue elsewhere.
    ARIA.extendHidden({

        isArrayLike(object) {

            return object
                ? (
                    typeof object.length === "number"
                    || typeof object[Symbol.iterator] === "function"
                )
                : false;

        },

        asArray(object) {

            return (object === null || object === undefined)
                ? []
                : (typeof object !== "string" && ARIA.isArrayLike(object))
                    ? [...object]
                    : [object];

        },

        isNode(object) {
            return object instanceof Node;
        },

        asString(object) {

            return ARIA.isNode(object)
                ? ARIA.identify(object)
                : String(object);

        }

    });

    ARIA.List = class extends Set {

        constructor(value) {

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

            super(iterable);

        }

        add(...values) {

            values.forEach(
                (value) => super.add.call(this, String(value).trim())
            );

        }

        delete(...values) {

            values.forEach(
                (value) => super.delete.call(this, String(value).trim())
            );

        }

        toArray(handler, context) {
            return Array.from(this, handler, context);
        }

        toString() {
            return this.toArray().join(" ");
        }

    };

    ARIA.getById = document.getElementById.bind(document);

    let expando = 0;

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

    let normalise = function (attribute) {

        let string = String(attribute)
            .trim()
            .toLowerCase();

        return string.startsWith("aria-")
            ? string
            : `aria-${string}`;

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
        normalize: normaliseDescriptor
    });

}(window.ARIA));

(function (ARIA) {

    "use strict";

    // ARIA.extendHidden({
    //
    //     refExists: function (ref) {
    //         return ARIA.getById(ref) !== null;
    //     }
    //
    // });

    ARIA.extend({

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

        get(element, attribute) {
            return ARIA.getDOMAttribute(element, ARIA.normalise(attribute));
        },

        getRef(element, attribute) {

            let list = new ARIA.List(ARIA.get(element, attribute));

            return list.toArray(ARIA.getById);

        },

        has(element, attribute) {
            return ARIA.hasDOMAttribute(element, ARIA.normalise(attribute));
        },

        hasRef(element, attribute) {

            return (
                ARIA.has(element, attribute)
                // && ARIA.getRef(element, attribute).every(ARIA.refExists)
                && !ARIA.getRef(element, attribute).includes(null)
            );

        },

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

                        remove(
                            element,
                            normalised,
                            value(element, current, normalised)
                        );

                    } else {

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

(function (ARIA) {

    "use strict";

    ARIA.extend({

        setRole(element, role) {
            ARIA.setDOMAttribute(element, "role", role);
        },

        getRole(element) {
            return ARIA.getDOMAttribute(element, "role");
        },

        hasRole(element, role) {

            let has = ARIA.hasDOMAttribute(element, "role");

            if (role && has) {

                let list = new ARIA.List(ARIA.getRole(element));

                has = list.has(role);

            }

            return has;

        },

        addRole(element, ...roles) {

            let list = new ARIA.List(ARIA.getRole(element));

            list.add(...roles);
            ARIA.setRole(element, list);

        },

        removeRole: function removeRole(element, ...roles) {

            if (roles.length) {

                let list = new ARIA.List(ARIA.getRole(element));

                list.delete(...roles);

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

}(window.ARIA));

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

    ARIA.extendHidden({

        is(element, selector) {
            return element.matches(selector);
        }

    });

    ARIA.extend({

        focusable,

        // isTabbable = false -> only programmatically focusable.
        makeFocusable(element, isTabbable) {

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

(function (ARIA) {

    "use strict";

    if (
        typeof Proxy !== "function"
        || !(/\{\s*\[native code\]\s*\}/).test(
            Function.prototype.toString.call(Proxy)
        )
    ) {

        throw new Error(
            "This browser does not have Proxy - ARIA.chain() is unavailable"
        );

    }

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
