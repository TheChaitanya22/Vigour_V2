import React from "react";
import VideoCard from "../components/VideoCard";
import Drawer from "../components/Drawer";
import UploadVideo from "../components/UploadVideo";

function Creator_Dashboard() {
  return (
    <div>
      <Drawer label1={"My Couses"} label2={"Upload Course"} />
      <UploadVideo />
    </div>
  );
}

export default Creator_Dashboard;
