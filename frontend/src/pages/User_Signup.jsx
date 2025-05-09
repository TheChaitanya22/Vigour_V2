import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function User_Signup() {
  // const handleGoogleLogin = () => {
  //   window.location.href = "http://localhost:3000/auth/google";
  // };

  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="card w-full max-w-md shadow-2xl bg-base-100">
        <div className="card-body">
          <h2 className="text-3xl font-bold text-center mb-4">
            Signup As a User
          </h2>

          <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
            <div className="card-body">
              <fieldset className="fieldset">
                <label className="label">Email</label>
                <input
                  type="email"
                  className="input"
                  placeholder="Example@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <label className="label">Password</label>
                <input
                  type="password"
                  className="input"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  className="btn btn-neutral mt-4"
                  onClick={async () => {
                    try {
                      const response = await axios.post(
                        "http://localhost:3000/auth/register",
                        {
                          email,
                          password,
                          role: "user",
                        }
                      );
                      localStorage.setItem("token", response.data.token);
                      navigate("/user/dashboard");
                    } catch (error) {
                      alert(error.response?.data?.message || "Signup failed");
                    }
                  }}
                >
                  Signup
                </button>
              </fieldset>
            </div>
          </div>

          {/* <div className="divider">OR</div>

          <button onClick={handleGoogleLogin} className="btn btn-outline">
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google"
              className="w-5 h-5 mr-2"
            />
            Continue with Google
          </button> */}
        </div>
      </div>
    </div>
  );
}

export default User_Signup;
