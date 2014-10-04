describe("popover", function() {
    "use strict";

    it("exposes public method popover", function() {
        expect(typeof DOM.popover).toBe("function");
        expect(typeof DOM.create("a").popover).toBe("function");
    });

    it("creates a new element only once", function() {
        var link = DOM.create("a"),
            popover = link.popover();

        expect(popover).toBeDefined();
        expect(link.popover()).toBe(popover);

        expect(DOM.create("a").popover()).not.toBe(popover);
    });

    it("sets content to the popover element", function() {
        var link = DOM.create("a"),
            popover = link.popover("test1");

        expect(popover.get()).toBe("test1");
        link.popover("<i>test2</i>");
        expect(popover.child(0)).toBeDefined();
    });

    it("respects parent element z-index", function() {
        var link = DOM.create("a"),
            popover = link.popover();

        expect(popover.css("z-index")).toBe("1");

        link = DOM.create("b").css("z-index", "100");
        popover = link.popover();
        expect(popover.css("z-index")).toBe("101");
    });

    it("supports arguments hpos and vpos", function() {
        var link = DOM.create("a"),
            popover = link.popover(),
            linkOffset = {left: 1, top: 1, right: 3, bottom: 5},
            popoverOffset = {left: 10, top: 10, right: 30, bottom: 50};

        spyOn(link, "offset").and.returnValue(linkOffset);
        spyOn(popover, "offset").and.returnValue(popoverOffset);

        link.popover("...", "left", "top");
        expect(popover.css("margin-left")).toBe("-9px");
        expect(popover.css("margin-top")).toBe("-49px");

        link.popover("...", "left", "center");
        expect(popover.css("margin-left")).toBe("-9px");
        expect(popover.css("margin-top")).toBe("0px");

        link.popover("...", "left", "bottom");
        expect(popover.css("margin-left")).toBe("-9px");
        expect(popover.css("margin-top")).toBe("-5px");

        link.popover("...", "center", "top");
        expect(popover.css("margin-left")).toBe("0px");
        expect(popover.css("margin-top")).toBe("-49px");

        link.popover("...", "center", "center");
        expect(popover.css("margin-left")).toBe("0px");
        expect(popover.css("margin-top")).toBe("0px");

        link.popover("...", "center", "bottom");
        expect(popover.css("margin-left")).toBe("0px");
        expect(popover.css("margin-top")).toBe("-5px");

        link.popover("...", "right", "top");
        expect(popover.css("margin-left")).toBe("0px");
        expect(popover.css("margin-top")).toBe("-49px");

        link.popover("...", "right", "center");
        expect(popover.css("margin-left")).toBe("0px");
        expect(popover.css("margin-top")).toBe("0px");

        link.popover("...", "right", "bottom");
        expect(popover.css("margin-left")).toBe("0px");
        expect(popover.css("margin-top")).toBe("-5px");
    });
});
