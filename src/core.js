/**
 * @file    A library for handling WAI-ARIA attributes, the role attribute and
 *          other accessibility functions.
 * @author  James "Skateside" Long <sk85ide@hotmail.com>
 * @version 1.0.0
 */
(function (glob) {

    "use strict";

    /**
     * Namespace for the WAI-ARIA functions.
     *
     * @namespace
     */
    let ARIA = {};

    /**
     * The current version. This is written in Semantic Versioning (SemVer).
     *
     * @memberof ARIA
     * @constant
     * @type     {String}
     */
    let VERSION = "1.0.0";

    let previousAria = glob.ARIA;
    let hiddenDescriptor = {
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

        Object
            .entries(methods)
            .forEach(function ([name, value]) {

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

    /**
     * Removes the {@link ARIA} namespace from the global object and restores
     * any previous value that may have been there.
     *
     * @return {Object}
     *         The {@link ARIA} namespace.
     */
    ARIA.noConflict = function () {

        glob.ARIA = previousAria;

        return ARIA;

    };

    glob.ARIA = ARIA;

}(window));
