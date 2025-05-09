import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const Login = () => {
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
            Login to Vigour
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
                    const response = await axios.post(
                      "http://localhost:3000/auth/login",
                      {
                        email,
                        password,
                      }
                    );
                    const { token, role } = response.data;

                    localStorage.setItem("token", token);
                    localStorage.setItem("role", role);

                    if (role === "coach") {
                      navigate("/coach/dashboard");
                    } else if (role === "user") {
                      navigate("/user/dashboard");
                    }
                  }}
                >
                  Login
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
            Login with Google
          </button> */}
        </div>
      </div>
    </div>
  );
};

export default Login;
