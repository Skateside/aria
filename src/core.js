/**
 * @file    A library for handling WAI-ARIA attributes, the role attribute and
 *          other accessibility functions.
 * @author  James "Skateside" Long <sk85ide@hotmail.com>
 * @version <%= version %>
 */
(function (globalVariable) {

    "use strict";

    let previousAria = globalVariable.ARIA;

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
    let VERSION = "<%= version %>";

    Object.defineProperty(ARIA, "VERSION", {
        configurable: false,
        enumerable: true,
        writable: false,
        value: VERSION
    });

    /**
     * @memberof ARIA
     * @param    {Function|Object} methods
     *           Either the methods to add to {@link ARIA} or a function that
     *           creates the methods.
     * @throws   {Error}
     *           Cannot replace {@link ARIA.extend} with this method.
     */
    ARIA.extend = function (methods) {

        if (typeof methods === "function") {
            methods = methods(ARIA);
        }

        if (methods) {

            if (methods.extend) {
                throw new Error("Cannot replace ARIA.extend");
            }

            Object.assign(ARIA, methods);

        }

    };

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

}(window));
