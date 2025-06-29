import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Creator_Signup from "./pages/Creator_Signup";
import User_Signup from "./pages/User_Signup";
import CreateCourse from "./pages/CreateCourse";
import ViewCourse from "./pages/ViewCourse";
import CoachDashPage from "./pages/CoachDashPage";
import CourseVideos from "./pages/CoachVideos";
import UserDashPage from "./pages/UserDashPage";
import Browse from "./pages/Browse";
import UploadPage from "./pages/UploadPage";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/register/user" element={<User_Signup />} />
          <Route path="/auth/register/creator" element={<Creator_Signup />} />
          <Route path="/browse" element={<Browse />} />
          <Route path="/user/dashboard" element={<UserDashPage />} />
          <Route path="/browse/:courseId" element={<ViewCourse />} />
          <Route path="/coach/dashboard" element={<CoachDashPage />} />
          <Route
            path="/coach/dashboard/:courseId/videos"
            element={<CourseVideos />}
          />
          <Route path="/coach/create-course" element={<CreateCourse />} />
          <Route path="/coach/addvideo/:courseId" element={<UploadPage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
