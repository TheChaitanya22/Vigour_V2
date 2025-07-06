import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BookOpen, Users } from "lucide-react";

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/user/browse`
        );
        setCourses(res.data.courses);
      } catch (err) {
        console.error("Failed to fetch courses", err);
      }
    };
    fetchCourses();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-blue-50 to-blue-100 py-10 px-4 sm:px-10">
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
