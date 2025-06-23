import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { Provider } from "react-redux";
import { store } from "./redux";
import {
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Route
} from "react-router-dom";

// Import all necessary pages
import Home from "./page/Home";
import About from "./page/About";
import Login from "./page/login";
import Signup from "./page/Signup";
import Menu from "./page/Menu";
import Cart from "./page/Cart";
import Success from "./page/Success";
import Cancel from "./page/Cancel";
import Filter from "./page/Filter";
import AllProduct from "./component/AllProduct";
import ListOfProducts from "./component/ListOfProducts";
import EditProduct from "./component/EditProduct";
import Newproduct from "./page/Newproduct";
import AdminPanel from "./admin/AdminPanel";
import AllUsers from "./admin/AllUsers";
import Contact from "./page/Contact";
import Complaints from "./admin/Complaints";
import Profile from "./customer/Profile";
import Address from "./customer/Address";
import Feedbacks from "./admin/Feedbacks";
import Search from "./component/Search";
import EditUser from "./customer/EditUser";
import OrderList from "./admin/OrderList";
import MyOrders from "./customer/MyOrders";
import Review from "./customer/Review";
import AddressList from "./admin/AllAddresses";
import ProfileInformation from "./customer/ProfileInformation";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route index element={<Home />} />
      <Route path="about" element={<About />} />
      <Route path="login" element={<Login />} />
      <Route path="signup" element={<Signup />} />
      <Route path="menu" element={<Menu />} />
      <Route path="cart" element={<Cart />} />
      <Route path="success" element={<Success />} />
      <Route path="cancel" element={<Cancel />} />
      <Route path="filter/:filterby" element={<Filter />} />
      <Route path="allproduct" element={<AllProduct />} />
      <Route path="listofproducts" element={<ListOfProducts />} />
      <Route path="edit-product/:productId" element={<EditProduct />} />
      <Route path="newproduct" element={<Newproduct />} />
      <Route path="adminpanel" element={<AdminPanel />} />
      <Route path="allusers" element={<AllUsers />} />
      <Route path="contact" element={<Contact />} />
      <Route path="allcontacts" element={<Complaints />} />
      <Route path="profile" element={<Profile />} />
      <Route path="address" element={<Address />} />
      <Route path="feedback" element={<Feedbacks />} />
      <Route path="search" element={<Search />} />
      <Route path="edituser" element={<EditUser />} />
      <Route path="orders" element={<OrderList />} />
      <Route path="myorders" element={<MyOrders />} />
      <Route path="review" element={<Review />} />
      <Route path="profileinfo" element={<ProfileInformation />} />
      <Route path="addresses" element={<AddressList />} />
    </Route>
  ),
  {
    basename: "/shopsmart-your-digital-grocery-store-experience"
  }
);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
);
