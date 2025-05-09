import React, { useState } from "react";
import axios from "axios";

function UploadVideo() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [videoFile, setVideoFile] = useState(null);
  const [isPublic, setIsPublic] = useState(true);

  const handleVideoUpload = async () => {
    if (!videoFile) return alert("Please select a video");

    // Convert to base64
    const reader = new FileReader();
    reader.readAsDataURL(videoFile);

    reader.onloadend = async () => {
      const base64Video = reader.result;

      try {
        const response = await axios.post(
          "http://localhost:3000/upload",
          {
            title,
            description,
            videoData: base64Video,
            isPublic,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
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

      <label className="label cursor-pointer">
        <span className="label-text">Make public?</span>
        <input
          type="checkbox"
          checked={isPublic}
          onChange={(e) => setIsPublic(e.target.checked)}
          className="checkbox"
        />
      </label>

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
