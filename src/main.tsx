import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

if (typeof window !== "undefined") {
  // Gracefully silence harmless Vite development WebSocket warnings
  window.addEventListener("unhandledrejection", (event) => {
    const errorStr = String(event.reason || "");
    const errorMsg = event.reason?.message || "";
    if (
      errorStr.includes("WebSocket") ||
      errorStr.includes("websocket") ||
      errorMsg.includes("WebSocket") ||
      errorMsg.includes("websocket") ||
      errorMsg.includes("vite")
    ) {
      event.stopImmediatePropagation();
      event.preventDefault();
    }
  });

  window.addEventListener("error", (event) => {
    const errorMsg = event.message || "";
    if (
      errorMsg.includes("WebSocket") ||
      errorMsg.includes("websocket") ||
      errorMsg.includes("vite")
    ) {
      event.stopImmediatePropagation();
      event.preventDefault();
    }
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

