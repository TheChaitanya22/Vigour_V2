import { Crown } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-[#0f172a] via-[#1e293b] to-[#20467b] text-white">
      <div className="text-center">
        <div className="max-w-md">
          <h1 className="text-5xl font-bold mb-4">
            Unleash Your Full Potential with Vigour
          </h1>
          <p className="py-6">
            Join Vigour, where expert trainers and dieticians create
            personalized fitness courses. Whether you're a fitness enthusiast or
            a coach, we provide the tools to help you achieve your goals.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={() => navigate("/browse")}
              className="px-6 py-2 sm:w-auto bg-white text-gray-800 cursor-pointer font-semibold rounded-lg shadow-md hover:bg-gray-100 transition-all duration-200 transform hover:scale-105"
            >
              Start Learning
            </button>
            <button
              onClick={() => navigate("/auth/register/creator")}
              className="flex items-center justify-center cursor-pointer space-x-1 px-6 py-2 sm:w-auto bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg transition-all duration-200 font-medium shadow-md hover:shadow-lg transform hover:scale-105"
            >
              <Crown className="w-4 h-4" />
              <span>Become a Creator</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
