import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Creator_Signup from "./pages/Creator_Signup";
import User_Signup from "./pages/User_Signup";
import Dashboard from "./pages/Creator_Dashboard";
import User_Dashboard from "./pages/User_Dashboard";
import Creator_Dashboard from "./pages/Creator_Dashboard";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/register/user" element={<User_Signup />} />
          <Route path="/auth/register/creator" element={<Creator_Signup />} />
          <Route path="/user/dashboard" element={<User_Dashboard />} />
          <Route path="/coach/dashboard" element={<Creator_Dashboard />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
