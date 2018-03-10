describe("role", function () {

    describe("setRole", function () {

        it("should set the role of a DOM element", function () {

            var div = document.createElement("div");
            var role = "tablist";

            chai.assert.isFalse(div.hasAttribute("role"));
            ARIA.setRole(div, role);
            chai.assert.isTrue(div.hasAttribute("role"));
            chai.assert.equal(div.getAttribute("role"), role);

        });

    });

    describe("getRole", function () {

        it("should get the role of a DOM element", function () {

            var div = document.createElement("div");
            var role = "tablist";
            div.setAttribute("role", role);

            chai.assert.equal(div.getAttribute("role"), role);
            chai.assert.equal(ARIA.getRole(div), role);

        });

        it("should return null if the element doesn't have a role", function () {

            var div = document.createElement("div");

            chai.assert.isNull(ARIA.getRole(div));

        });

    });

    describe("hasRole", function () {

        it("should check to see if an element has a role", function () {

            var div1 = document.createElement("div");
            var div2 = document.createElement("div");
            div2.setAttribute("role", "tablist");

            chai.assert.isFalse(div1.hasAttribute("role"));
            chai.assert.isTrue(div2.hasAttribute("role"));
            chai.assert.isFalse(ARIA.hasRole(div1));
            chai.assert.isTrue(ARIA.hasRole(div2));

        });

        it("should check to see if an element has a specific role", function () {

            var div = document.createElement("div");
            div.setAttribute("role", "tablist presentation");

            chai.assert.isTrue(ARIA.hasRole(div, "tablist"));
            chai.assert.isTrue(ARIA.hasRole(div, "presentation"));
            chai.assert.isFalse(ARIA.hasRole(div, "tab"));

        });

        it("should not throw an error when the element doesn't have the attribute", function () {

            var div = document.createElement("div");

            chai.assert.doesNotThrow(function () {
                ARIA.hasRole(div, "tablist");
            });
            chai.assert.isFalse(ARIA.hasRole(div, "tablist"));

        });

    });

    describe("addRole", function () {

        it("should add one or more roles to an element", function () {

            var div = document.createElement("div");
            div.setAttribute("role", "tablist");

            chai.assert.equal(div.getAttribute("role"), "tablist");

            ARIA.addRole(div, "presentation");
            chai.assert.equal(div.getAttribute("role"), "tablist presentation");

            ARIA.addRole(div, "image", "panel");
            chai.assert.equal(
                div.getAttribute("role"),
                "tablist presentation image panel"
            );

        });

        it("should create the attribute if it doesn't exist yet", function () {

            var div = document.createElement("div");

            chai.assert.isFalse(div.hasAttribute("role"));
            ARIA.addRole(div, "panel");
            chai.assert.isTrue(div.hasAttribute("role"));
            chai.assert.equal(div.getAttribute("role"), "panel");

        });

        it("should not duplicate roles", function () {

            var div = document.createElement("div");
            div.setAttribute("role", "panel");

            chai.assert.equal(div.getAttribute("role"), "panel");
            ARIA.addRole(div, "panel");
            chai.assert.equal(div.getAttribute("role"), "panel");
            ARIA.addRole(div, "panel", "tab", "panel", "presentation", "panel");
            chai.assert.equal(div.getAttribute("role"), "panel tab presentation");

        });

    });

    describe("removeRole", function () {

        it("should remove one or more roles from an element", function () {

            var div = document.createElement("div");
            div.setAttribute("role", "image tab panel banner");

            chai.assert.equal(div.getAttribute("role"), "image tab panel banner");

            ARIA.removeRole(div, "tab");
            chai.assert.equal(div.getAttribute("role"), "image panel banner");

            ARIA.removeRole(div, "banner", "image");
            chai.assert.equal(div.getAttribute("role"), "panel");

        });

        it("should remove the role attribute", function () {

            var div1 = document.createElement("div");
            div1.setAttribute("role", "banner");
            var div2 = document.createElement("div");
            div2.setAttribute("role", "image");

            chai.assert.isTrue(div1.hasAttribute("role"));
            chai.assert.isTrue(div2.hasAttribute("role"));
            ARIA.removeRole(div1, "banner");
            ARIA.removeRole(div2);
            chai.assert.isFalse(div1.hasAttribute("role"));
            chai.assert.isFalse(div2.hasAttribute("role"));

        });

        it("should not throw errors if the attribute isn't set", function () {

            var div = document.createElement("div");

            chai.assert.doesNotThrow(function () {
                ARIA.removeRole(div);
            });
            chai.assert.doesNotThrow(function () {
                ARIA.removeRole(div, "banner");
            });

        });

    });

});
