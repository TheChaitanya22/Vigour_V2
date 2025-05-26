import React, { useState } from "react";
import axios from "axios";

function UploadVideo() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [videoFile, setVideoFile] = useState(null);
  const [isPublic, setIsPublic] = useState(true);

  const handleVideoUpload = async () => {
    if (!videoFile) return alert("Please select a video");

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("videoFile", videoFile);
    formData.append("isPublic", isPublic);

    try {
      const response = await axios.post(
        "http://localhost:3000/creator/upload",
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Uploaded successfully:", response.data);
      alert("Video uploaded!");
    } catch (error) {
      console.error("Upload error:", error);
      alert("Error uploading video");
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto bg-white shadow-lg rounded">
      <h2 className="text-xl font-bold mb-4">Upload Video</h2>

      <input
        type="text"
        placeholder="Title"
        className="input input-bordered w-full mb-2"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <textarea
        placeholder="Description"
        className="textarea textarea-bordered w-full mb-2"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <input
        type="file"
        accept="video/*"
        className="file-input w-full mb-2"
        onChange={(e) => setVideoFile(e.target.files[0])}
      />
      <button
        className="btn btn-primary w-full mt-4"
        onClick={handleVideoUpload}
      >
        Upload
      </button>
    </div>
  );
}
export default UploadVideo;
