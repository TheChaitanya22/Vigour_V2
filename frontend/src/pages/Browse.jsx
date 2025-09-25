import React from "react";
import Courses from "../components/Courses";
import UserSidebarDrawer from "../components/UserDrawer";

function Browse() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-blue-100 to-blue-300 py-10 px-4 sm:px-10">
      <Courses />
    </div>
  );
}

export default Browse;
