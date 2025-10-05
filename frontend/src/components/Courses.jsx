import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Loader, Users } from "lucide-react";
import UserSidebarDrawer from "./UserDrawer";

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/user/browse`,
          { timeout: 4000 }
        );
        setCourses(res.data.courses);
      } catch (err) {
        console.error("Failed to fetch courses", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white via-blue-100 to-blue-200 py-10 px-4 sm:px-10">
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-10">
          Explore Courses
        </h2>
        <div className="min-h-screen flex items-start justify-center text-gray-600">
          <Loader />
        </div>
      </div>
    );
  }

  if (error || courses.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center px-4">
        <p className="text-2xl font-semibold text-red-600">
          Server is waking up... Please Wait or Refresh.(might take upto
          2minutes).
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-blue-50 to-blue-200 py-10 px-4 sm:px-10">
      {token && <UserSidebarDrawer />}
      <h2 className="text-4xl font-bold text-center text-gray-800 mb-10">
        Explore Courses
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {courses.map((course) => (
          <div
            key={course._id}
            className="bg-white rounded-2xl shadow-md hover:shadow-lg transition duration-200 overflow-hidden"
          >
            <div className="p-6 space-y-2">
              <h3 className="text-xl font-semibold text-blue-800">
                {course.title}
              </h3>
              <p className="text-sm text-gray-500 mb-2">
                by{" "}
                <span className="font-medium">
                  {course.createdBy?.email || "Creator"}
                </span>
              </p>
              <div className="text-gray-600 text-sm space-y-1">
                <p>
                  📹 Videos:{" "}
                  <span className="font-medium">
                    {course.publicVideos} / {course.totalVideos}
                  </span>
                </p>
                <p className="flex items-center gap-1">
                  <Users className="w-4 h-4 text-blue-600" />
                  Enrolled:{" "}
                  <span className="font-medium">{course.enrollmentCount}</span>
                </p>
                <p className="text-xl text-black">₹ {course.price}</p>
              </div>
              <button
                onClick={() => navigate(`/browse/${course._id}`)}
                className="mt-4 px-4 py-2 w-full text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg hover:scale-105 transition-all"
              >
                View Course
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Courses;
