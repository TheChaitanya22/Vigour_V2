import React, { useEffect, useState } from "react";
import axios from "axios";

function Courses() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await axios.get("http://localhost:3000/videos");
        setVideos(response.data);
      } catch (error) {
        console.error(
          "Error fetching videos:",
          error.response?.data || error.message
        );
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">All Courses</h1>

      {loading ? (
        <p>Loading...</p>
      ) : videos.length === 0 ? (
        <p>No videos available.</p>
      ) : (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {videos.map((video) => (
            <div key={video._id} className="card bg-base-100 shadow-xl">
              <figure className="w-full h-48 bg-black overflow-hidden">
                <video
                  controls
                  className="w-full h-full object-cover"
                  src={video.cloudinaryUrl}
                />
              </figure>
              <div className="card-body">
                <h2 className="card-title">{video.title}</h2>
                <p>{video.description}</p>
                <p className="text-sm text-gray-500">
                  By {video.uploadedBy?.name || "Unknown"}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Courses;
