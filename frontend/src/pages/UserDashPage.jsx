import React from "react";
import UserCourses from "../components/UserCourses";
import UserSidebarDrawer from "../components/UserDrawer";

function UserDashPage() {
  return (
    <div>
      <UserSidebarDrawer />
      <UserCourses />
    </div>
  );
}

export default UserDashPage;
