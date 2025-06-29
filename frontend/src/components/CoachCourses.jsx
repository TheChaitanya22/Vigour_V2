import React, { useEffect, useState } from "react";
import axios from "axios";
import { Trash2, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CoachCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchCourses = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:3000/creator/my-courses", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCourses(res.data);
    } catch (error) {
      console.error("Failed to load courses", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteCourse = async (courseId) => {
    const confirm = window.confirm(
      "Are you sure you want to delete this course?"
    );
    if (!confirm) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:3000/creator/courses/${courseId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCourses((prev) => prev.filter((course) => course._id !== courseId));
    } catch (error) {
      alert("Failed to delete course");
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
              key={course._id}
              className="bg-white shadow rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <h2 className="text-xl font-semibold text-gray-800">
                  {course.title}
                </h2>
                <p className="text-sm text-gray-600">{course.description}</p>
                <div className="text-sm text-gray-500 mt-1">
                  {course.videoCount} videos • {course.enrollmentCount} enrolled
                </div>
              </div>
              <div className="flex items-end gap-10">
                <button
                  onClick={() => navigate(`/coach/addvideo/${course._id}`)}
                  className="mt-2 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-green-600 to-green-700 rounded-lg hover:scale-105 transition-all"
                >
                  <Plus className="w-4 h-4" />
                  Add Video
                </button>
                <button
                  onClick={() =>
                    navigate(`/coach/dashboard/${course._id}/videos`)
                  }
                  className="mt-4 px-4 py-2 w-auto text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg hover:scale-105 transition-all"
                >
                  View Course
                </button>
                <button
                  onClick={() => deleteCourse(course._id)}
                  className="mt-4 sm:mt-0 btn btn-error text-white flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CoachCourses;
