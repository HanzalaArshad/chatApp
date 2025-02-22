import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom"; // ✅ Add BrowserRouter
import { Provider } from "./components/ui/provider";
import ChatProvider from "./context/chatProvider";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import App from "./App";
import { ToastContainer } from "react-toastify";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter> {/* ✅ Wrap App inside BrowserRouter */}
      <ChatProvider>
        <Provider>
          <App />
        </Provider>
      </ChatProvider>
      <ToastContainer
  position="top-right"
  autoClose={5000}
  hideProgressBar={false}
  newestOnTop={false}
  closeOnClick
  rtl={false}
  pauseOnFocusLoss
  draggable
  pauseOnHover
  style={{ zIndex: 9999 }} // To ensure it stays on top
/>
    </BrowserRouter>
  </StrictMode>
);
