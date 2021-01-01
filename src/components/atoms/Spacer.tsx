import { createElement } from "react";

function Spacer({ as = "div", className = "" }) {
  return createElement(as, { className });
}

export default Spacer;
