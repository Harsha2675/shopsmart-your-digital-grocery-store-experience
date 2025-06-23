import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { Provider } from "react-redux";
import { store } from "./redux/store"; // ✅ Adjust this if your store file is somewhere else

import {
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Route
} from "react-router-dom";

import Home from "./page/Home";
// import other pages as needed

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route index element={<Home />} />
      {/* Add other <Route path="..." element={<... />} /> as needed */}
    </Route>
  ),
  {
    basename: "/shopsmart-your-digital-grocery-store-experience" // ✅ For GitHub Pages routing
  }
);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
);
