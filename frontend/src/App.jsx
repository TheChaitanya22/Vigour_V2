import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Creator_Signup from "./pages/Creator_Signup";
import User_Signup from "./pages/User_Signup";
import User_Dashboard from "./pages/Browse";
import CreateCourse from "./pages/CreateCourse";
import AddVideo from "./pages/AddVideo";
import ViewCourse from "./pages/ViewCourse";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/register/user" element={<User_Signup />} />
          <Route path="/auth/register/creator" element={<Creator_Signup />} />
          <Route path="/browse" element={<User_Dashboard />} />
          <Route path="/browse/:courseId" element={<ViewCourse />} />
          <Route path="/coach/create-course" element={<CreateCourse />} />
          <Route path="/coach/addvideo/:courseId" element={<AddVideo />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
