import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import CoachSidebarDrawer from "../components/CoachDrawer";

const CourseVideos = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCourseVideos = async () => {
    try {
      const res = await axios.get(
        `${
          import.meta.env.VITE_API_BASE_URL
        }/creator/courses/${courseId}/videos`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setCourse(res.data.course);
      setVideos(res.data.videos);
    } catch (err) {
      console.error("Error loading videos:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourseVideos();
  }, [courseId]);

  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (!course) return <div className="text-center py-8">Course not found.</div>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-blue-50 to-blue-100 py-10 px-4 sm:px-10">
      <CoachSidebarDrawer />
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-800">{course.title}</h1>
        <p className="text-gray-600 text-xl mt-2">{course.description}</p>
      </div>

      {videos.length === 0 ? (
        <p className="text-center text-gray-500">No videos uploaded yet.</p>
      ) : (
        <div className="grid gap-4 pl-10">
          {videos?.map((video, index) => (
            <div key={video.id} className="bg-white rounded-xl shadow p-4">
              {/* Title + Description */}
              <div className="w-full">
                <h3 className="text-3xl font-semibold text-gray-800">
                  {index + 1}. {video.title}
                </h3>
                <p className="text-xl text-gray-500 my-4 ml-7 ">
                  {video.description}
                </p>
              </div>

              <div className="w-full flex justify-start">
                <div className="w-full max-w-4xl aspect-video overflow-hidden rounded-lg">
                  <video
                    controls
                    controlsList="nodownload"
                    className="w-full h-full object-cover"
                  >
                    <source
                      src={video.streamingUrl || video.directUrl}
                      type="video/mp4"
                    />
                    Your browser does not support the video tag.
                  </video>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CourseVideos;
