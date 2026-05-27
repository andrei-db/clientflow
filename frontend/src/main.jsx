import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import AuthLoader from "./components/AuthLoader.jsx";
import App from "./App.jsx";
import "./index.css";

import { store } from "./app/store.js";
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <AuthLoader>
        <App />
      </AuthLoader>
    </Provider>
  </StrictMode>

);