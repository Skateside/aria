(function (ARIA) {

    "use strict";

    ARIA.chain = function (elements) {

        var chain = {};

        Object.getOwnPropertyNames(ARIA).forEach(function (name) {

            var descriptor = Object.getOwnPropertyDescriptor(ARIA, name);
            var value = descriptor.value;

            if (typeof value === "function") {

                descriptor.value = function () {

                    var args = Array.prototype.slice.call(arguments);

                    ARIA.asArray(elements).forEach(function (element) {
                        value.apply(undefined, [element].concat(args));
                    });

                    return chain;

                };

            }

            Object.defineProperty(chain, name, descriptor);

        });

        return chain;

    };

}(window.ARIA));
