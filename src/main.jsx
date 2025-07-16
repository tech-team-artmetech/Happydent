import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { FullscreenProvider } from "./contexts/FullscreenContext";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <FullscreenProvider>
      <App />
    </FullscreenProvider>
  </StrictMode>
);
