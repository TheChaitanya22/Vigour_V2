import React from "react";
import Drawer from "../components/Drawer";
import Courses from "../components/Courses";

function User_Dashboard() {
  return (
    <div>
      <Drawer label1={"All courses"} label2={"Purchased Courses"} />
      <Courses />
    </div>
  );
}

export default User_Dashboard;
