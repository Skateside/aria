describe("focus", function () {

    // https://gist.github.com/jonathantneal/7935589
    var createElement = (function (createElement) {
    	var
    	MATCH = '(-?[_a-zA-Z]+[_a-zA-Z0-9-]*)',
    	REGEX = '^(?:' + MATCH + ')|^#' + MATCH + '|^\\.' + MATCH + '|^\\[' + MATCH + '(?:([*$|~^]?=)(["\'])((?:(?=(\\\\?))\\8.)*?)\\6)?\\]';

    	return function (selector) {
    		for (var node = createElement.call(document, 'div'), match, className = ''; selector && (match = selector.match(REGEX));) {
    			if (match[1]) node = createElement.call(document, match[1]);
    			if (match[2]) node.id = match[2];
    			if (match[3]) className += ' ' + match[3];
    			if (match[4]) node.setAttribute(match[4], match[7] || '');

    			selector = selector.slice(match[0].length);
    		}

    		if (className) node.className = className.slice(1);

    		return node;
    	};
    })(document.createElement);

    describe("is", function () {

        it("should match elements with a CSS selector", function () {

            var div = document.createElement("div");
            div.id = "one";

            chai.assert.isTrue(ARIA.is(div, "div"));
            chai.assert.isTrue(ARIA.is(div, "#one"));
            chai.assert.isTrue(ARIA.is(div, "[id]"));
            chai.assert.isFalse(ARIA.is(div, "[class]"));
            chai.assert.isFalse(ARIA.is(div, ".class"));

        });

    });

    describe("focusable", function () {

        it("should be a string", function () {
            chai.assert.isTrue(typeof ARIA.focusable === "string");
        });

        it("should be a valid CSS selector", function () {

            chai.assert.doesNotThrow(function () {
                document.querySelector(ARIA.focusable);
            });

        });

    });

    describe("makeFocusable", function () {

        it("should make an element focusable", function () {

            var div1 = document.createElement("div");
            var div2 = document.createElement("div");

            chai.assert.isFalse(div1.hasAttribute("tabindex"));
            chai.assert.isFalse(div2.hasAttribute("tabindex"));
            ARIA.makeFocusable(div1);
            ARIA.makeFocusable(div2, true);
            chai.assert.isTrue(div1.hasAttribute("tabindex"));
            chai.assert.isTrue(div2.hasAttribute("tabindex"));
            chai.assert.equal(div1.getAttribute("tabindex"), "-1");
            chai.assert.equal(div2.getAttribute("tabindex"), "0");

        });

        it("should not affect elements that are already focusable", function () {

            var selectors = ARIA.focusable
                .split(",")
                .filter(function (selector) {
                    return !selector.includes("[tabindex]");
                });
            var elements = selectors.map(createElement);

            chai.assert.isTrue(elements.every(function (element) {
                return !element.hasAttribute("tabindex");
            }), "before");
            elements.forEach(function (element) {
                ARIA.makeFocusable(element);
            });
            chai.assert.isTrue(elements.every(function (element) {
                return !element.hasAttribute("tabindex");
            }), "after");

        });

        it("should not affect an existing tabindex", function () {

            var number = Math.floor(Math.random() * 1000);
            var div = document.createElement("div");
            div.setAttribute("tabindex", number);

            chai.assert.equal(Number(div.getAttribute("tabindex")), number);
            ARIA.makeFocusable(div);
            chai.assert.equal(Number(div.getAttribute("tabindex")), number);

        });

    });

});
