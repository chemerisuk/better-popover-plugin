(function(DOM) {


    DOM.extend("*", {
        popover: function(content, hpos, vpos) {
            var popover = this.get("_popover"),
                css = {}, offset, popoverOffset;

            if (!popover) {
                popover = DOM.create("div.better-popover").css("visibility", "hidden");

                this.before(popover);

                popover.css({
                    // MUST set position:absolute for correct offset calculation
                    "position": "absolute",
                    "z-index": 1 + (this.css("z-index") | 0)
                });

                this.set("_popover", popover);
            }

            if (content !== void 0) {
                popover.set(content).show();
            }

            if (typeof hpos === "string") {
                offset = this.offset();
                popoverOffset = popover.css("margin", "0").offset();

                // position is "center" by default
                hpos = hpos || "center";
                vpos = vpos || "center";

                switch(hpos) {
                case "left":
                    css["margin-left"] = offset.left - popoverOffset.left;
                    break;

                case "center":
                    css["margin-left"] = offset.left - popoverOffset.left + (offset.width - popoverOffset.width) / 2;
                    break;

                case "right":
                    css["margin-left"] = offset.right - popoverOffset.left - popoverOffset.width;
                    break;
                }
            }

            if (typeof vpos === "string") {
                switch(vpos) {
                case "top":
                    css["margin-top"] = offset.top - popoverOffset.bottom;
                    break;

                case "center":
                    css["margin-top"] = offset.top - popoverOffset.top + (offset.height - popoverOffset.height) / 2;
                    break;

                case "bottom":
                    css["margin-top"] = offset.bottom - popoverOffset.top;
                    break;
                }
            }

            return popover.css(css);
        }
    });
}(window.DOM));