import React from "react";
import Drawer from "../components/Drawer";
import Courses from "../components/Courses";

function Browse() {
  return (
    <div className="bg-gradient-to-br from-slate-800 to-slate-900 overflow-hidden shadow-xl border-slate-700">
      <Courses />
    </div>
  );
}

export default Browse;
