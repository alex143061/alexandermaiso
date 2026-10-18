import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";
import "./index.css";

// Right-click / "Inspect element": the 3D OrbitControls is connected to the page root
// (Canvas eventSource=#root) and listens for `contextmenu` with preventDefault(), which
// kills the browser menu everywhere on the site. Stop contextmenu in the capture phase,
// before it ever reaches those handlers. We never call preventDefault() ourselves, so the
// native menu (including long-press on mobile) always shows.
window.addEventListener(
  "contextmenu",
  (e) => {
    e.stopPropagation();
  },
  true
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
