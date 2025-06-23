import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import Home from "./page/Home";
import Menu from "./page/Menu";
import About from "./page/About";
import Login from "./page/login";
import Newproduct from "./page/Newproduct";
import Signup from "./page/Signup";
import { store } from "./redux/index";
import { Provider } from "react-redux";
import Cart from "./page/Cart";
import Success from "./page/Success";
import Cancel from "./page/Cancel";
import AdminPanel from "./admin/AdminPanel";
import Filter from "./page/Filter";
import AllProduct from "./component/AllProduct";
import ListOfProducts from "./component/ListOfProducts";
import EditProduct from "./component/EditProduct";
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
      {/* <Route path="menu" element={<Menu />} /> */}
      <Route path="menu" element={<Menu />} />
      <Route path="about" element={<About />} />
      <Route path="login" element={<Login />} />
      <Route path="newproduct" element={<Newproduct />} />
      <Route path="signup" element={<Signup />} />
      <Route path="filter/:filterby" element={<Filter />} />
      <Route path="cart" element={<Cart />} />
      <Route path="success" element={<Success />} />
      <Route path="allproduct" element={<AllProduct />} />
      <Route path="listofproducts" element={<ListOfProducts />} />
      <Route path="/cancel" element={<Cancel />} />
      <Route path="/allusers" element={<AllUsers />} />
      <Route path="/edit-product/:productId" element={<EditProduct />} />
      <Route path="/edituser" element={<EditUser />} />
      <Route path="contact" element={<Contact />} />
      <Route path="allcontacts" element={<Complaints />} />
      <Route path="profile" element={<Profile />} />
      <Route path="address" element={<Address />} />
      <Route path="search" element={<Search />}/>
      <Route path="adminpanel" element={<AdminPanel />} />
      <Route path="feedback" element={<Feedbacks />} />
      <Route path="orders" element={<OrderList />} />
      <Route path="myorders" element={<MyOrders />}/>
      <Route path="review" element={<Review />}/>
      <Route path="profileinfo" element={<ProfileInformation />}/>
      <Route path="addresses" element={<AddressList />}/>
    </Route>
  )
);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
