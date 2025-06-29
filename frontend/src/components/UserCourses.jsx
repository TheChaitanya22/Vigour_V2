import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const UserCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchCourses = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        "http://localhost:3000/user/enrolled-courses",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setCourses(res.data.enrolledCourses);
    } catch (error) {
      console.error("Failed to load courses", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  if (loading) return <div className="text-center mt-10">Loading...</div>;

  return (
    <div className="min-h-screen pt-20 bg-gradient-to-b from-white via-blue-50 to-blue-100 py-10 px-4 sm:px-10">
      <h1 className="text-3xl font-bold mb-6">My Courses</h1>
      {courses.length === 0 ? (
        <p className="text-gray-500">No courses found.</p>
      ) : (
        <div className="grid gap-6">
          {courses.map((course) => (
            <div
              key={course.id}
              className="bg-white shadow rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <h2 className="text-xl font-semibold text-gray-800">
                  {course.title}
                </h2>
                <p className="text-sm text-gray-600">{course.description}</p>
                <div className="text-sm text-gray-500 mt-1">
                  <p className="text-sm text-gray-500">
                    Price: ₹{course.price}
                  </p>
                  <p className="text-sm text-gray-500">
                    Enrolled on:{" "}
                    {new Date(course.enrollmentDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-end gap-10">
                <button
                  onClick={() => navigate(`/browse/${course.id}`)}
                  className="mt-4 px-4 py-2 w-auto text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg hover:scale-105 transition-all"
                >
                  View Course
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserCourses;
