import React from "react";
import MakeCourse from "../components/MakeCourse";
import CoachSidebarDrawer from "../components/CoachDrawer";

function CreateCourse() {
  return (
    <div>
      <CoachSidebarDrawer />
      <MakeCourse />
    </div>
  );
}

export default CreateCourse;
