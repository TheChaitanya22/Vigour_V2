import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Lock, Play, Unlock, LoaderCircle } from "lucide-react";
import UserSidebarDrawer from "../components/UserDrawer";

const ViewCourse = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [videos, setVideos] = useState([]);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchCourse = async () => {
    try {
      const token = localStorage.getItem("token");
      const config = token
        ? {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        : {};
      const res = await axios.get(
        `http://localhost:3000/user/browse/${courseId}/videos`,
        config
      );
      setCourse(res.data.course);
      setVideos(res.data.videos);
      setIsEnrolled(res.data.isEnrolled);
      setLoading(false);
    } catch (err) {
      console.error("Failed to load course", err);
    }
  };

  useEffect(() => {
    fetchCourse();
  }, [courseId]);

  const handleEnroll = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/auth/login");
      return;
    }
    try {
      const res = await axios.post(
        `http://localhost:3000/user/enroll/${courseId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert(res.data.message || "Enrolled successfully!");
      fetchCourse();
    } catch (err) {
      if (err.response?.status === 401) {
        alert("Session expired. Please login again.");
        navigate("/login");
      } else {
        alert(err.response?.data?.message || "Failed to enroll");
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <LoaderCircle className="w-10 h-10 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen py-10 px-4 sm:px-10 bg-gradient-to-b from-white via-blue-50 to-blue-100">
      {isEnrolled && <UserSidebarDrawer />}
      <h1 className="text-4xl font-bold text-gray-800 mb-4 pl-10">
        {course.title}
      </h1>
      <p className="text-gray-700 mb-4 pl-10">{course.description}</p>

      {!isEnrolled && (
        <button
          onClick={handleEnroll}
          className="mb-6 px-6 ml-10 py-2 text-white font-semibold bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg shadow hover:scale-105 transition"
        >
          Enroll Now
        </button>
      )}

      <div className="grid gap-4 pl-10">
        {videos?.map((video, index) => (
          <div
            key={video.id}
            className="bg-white rounded-xl shadow p-4" // removed flex here
          >
            {/* Title + Description */}
            <div className="w-full">
              <h3 className="text-lg font-semibold text-gray-800">
                {index + 1}. {video.title}
              </h3>
              <p className="text-sm text-gray-500 mb-4">{video.description}</p>
            </div>

            {/* Video or Locked */}
            {video.locked ? (
              <div className="flex items-center gap-2 text-red-500 font-medium text-gray-700">
                <Lock className="w-5 h-5" />
                <span>Locked</span>
              </div>
            ) : (
              <div className="w-full">
                <video
                  controls
                  controlsList="nodownload"
                  className="rounded-lg w-5xl"
                >
                  <source
                    src={video.streamingUrl || video.directUrl}
                    type="video/mp4"
                  />
                  Your browser does not support the video tag.
                </video>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ViewCourse;
