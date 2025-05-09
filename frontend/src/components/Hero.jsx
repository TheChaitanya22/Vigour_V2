import React from "react";

const Hero = () => {
  return (
    <div className="hero min-h-screen bg-gradient-to-r from-[#0f172a] via-[#1e293b] to-[#334155] text-white">
      <div className="hero-content text-center">
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
            <button className="btn btn-secondary">Start Learning</button>
            <button className="btn btn-outline">Become a Creator</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
