import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "./style/global.scss";

import { Catagories, Menus, Orders, Users } from "./components";
import SignIn from "./pages/login/SignIn";
import NavBar from "./components/navbar/Navbar";
import Home from "./pages/login/home/Home";
import Footer from "./components/footer/Footer";
import Notification from "./pages/notification/notification";
import ApprovalWaiting from "./pages/approvalWaiting/ApprovalWaiting";
import OrderDetailsView from "./pages/oderDetails/orderDetailsView";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return getCookieValue("loggedIn") !== null;
  });

  console.log("isLoggedIn", isLoggedIn);

  useEffect(() => {
    console.log(getCookieValue("loggedIn"));
    const loggedInValue = getCookieValue("loggedIn");
    console.log(loggedInValue);
    if (loggedInValue !== null) {
      setIsLoggedIn(true);
    }
  }, []);

  function getCookieValue(cookieName) {
    const cookies = document.cookie.split("; ");
    for (const cookie of cookies) {
      const [name, value] = cookie.split("=");
      if (name === cookieName) {
        return decodeURIComponent(value);
      }
    }
    return null;
  }

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<SignIn />} />
        <Route path="/approvalWaiting" element={<ApprovalWaiting />} />

        {/* Authenticated routes are nested within AuthenticatedLayout */}
        <Route
          path="/*"
          element={<AuthenticatedLayout isLoggedIn={isLoggedIn} />}
        />
      </Routes>
    </Router>
  );
};

// authenticated routes
const AuthenticatedLayout = ({ isLoggedIn }) => {
  console.log("// authenticated routes");
  if (!isLoggedIn) {
    console.log(" authenticated");

    return <Navigate to="/login" />;
  }

  return (
    <div className="main">
      <NavBar />
      <div className="homeContainer">
        <div className="menuContainer">
          <Menus />
        </div>
        <div className="contentContainer">
          {/* Nested routes for authenticated pages */}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/users" element={<Users />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/notifications" element={<Notification />} />
            <Route path="/orderDetailsView" element={<OrderDetailsView />} />
          </Routes>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default App;
