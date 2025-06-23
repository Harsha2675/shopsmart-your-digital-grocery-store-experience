import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { Provider } from "react-redux";
import store from "./redux/store"; // ✅ Ensure this matches your file path and default export

import {
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Route
} from "react-router-dom";

import Home from "./pages/Home"; // ✅ Changed from "page/Home" to "pages/Home" — make sure the folder name matches

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route index element={<Home />} />
      {/* Add other routes here */}
    </Route>
  ),
  {
    basename: "/shopsmart-your-digital-grocery-store-experience" // ✅ Needed for GitHub Pages routing
  }
);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
);
