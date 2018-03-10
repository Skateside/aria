(function (ARIA) {

    "use strict";

    ARIA.extend(/** @lends ARIA */{

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
        setRole(element, role) {
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
        getRole(element) {
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
        hasRole(element, role) {

            let has = ARIA.hasDOMAttribute(element, "role");

            if (role && has) {

                let list = new ARIA.List(ARIA.getRole(element));

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
        addRole(element, ...roles) {

            let list = new ARIA.List(ARIA.getRole(element));

            list.add(...roles);
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
