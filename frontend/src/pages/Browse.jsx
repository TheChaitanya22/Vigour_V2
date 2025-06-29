import React from "react";
import Courses from "../components/Courses";
import UserSidebarDrawer from "../components/UserDrawer";

function Browse() {
  return (
    <div className="bg-gradient-to-br from-slate-800 to-slate-900 overflow-hidden shadow-xl border-slate-700">
      <Courses />
    </div>
  );
}

export default Browse;
