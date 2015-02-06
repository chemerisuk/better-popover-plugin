(function(DOM) {
    DOM.extend("*", {
        popover(content, hpos, vpos) {
            var popover = this.get("_popoverElement");

            if (!popover) {
                popover = DOM.create("div.btr-popover").css("visibility", "hidden");

                this.before(popover);

                popover.css({
                    // MUST set position:absolute for correct offset calculation
                    "position": "absolute",
                    // increases z-index of the related element by one to be on top
                    "z-index": this.css("z-index") | 0 + 1
                });

                this.set("_popoverElement", popover);
            }

            if (content != null) {
                popover.value(content).show();
            }

            if (typeof hpos === "string") {
                var offset = this.offset();
                var popoverOffset = popover.css("margin", "0").offset();

                popover.css({
                    // set appropriate margins
                    "margin-left": calcLeftMargin(hpos, offset, popoverOffset),
                    "margin-top": calcTopMargin(vpos, offset, popoverOffset)
                });
            }

            return popover;
        }
    });

    function calcLeftMargin(pos, offset, popoverOffset) {
        switch(pos) {
        case "left":
            return offset.left - popoverOffset.left;

        case "right":
            return offset.right - popoverOffset.left - popoverOffset.width;

        default: // position is "center" by default
            return offset.left - popoverOffset.left + (offset.width - popoverOffset.width) / 2;
        }
    }

    function calcTopMargin(pos, offset, popoverOffset) {
        switch(pos) {
        case "top":
            return offset.top - popoverOffset.bottom;

        case "bottom":
            return offset.bottom - popoverOffset.top;

        default: // position is "center" by default
            return offset.top - popoverOffset.top + (offset.height - popoverOffset.height) / 2;
        }
    }
}(window.DOM));
