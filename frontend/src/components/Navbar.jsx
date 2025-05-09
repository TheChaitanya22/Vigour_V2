import React from "react";
import { useNavigate } from "react-router-dom";
import { Link, Element } from "react-scroll";

function Navbar() {
  const navigate = useNavigate();
  return (
    <div>
      <div className="navbar bg-base-100 shadow-sm">
        <div className="navbar-start">
          <div className="dropdown">
            <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {" "}
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h8m-8 6h16"
                />{" "}
              </svg>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
            >
              <li>
                <a>Courses</a>
              </li>
              <li>
                <a>Register</a>
                <ul className="p-2">
                  <li>
                    <a>User</a>
                  </li>
                  <li>
                    <a>Creator</a>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
          <a className="btn btn-ghost text-xl">VIGOUR</a>
        </div>
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1">
            <li>
              <a>Courses</a>
            </li>
            <li>
              <details>
                <summary>Register</summary>
                <ul className="p-2">
                  <li>
                    <button
                      className="btn btn-outline mr-2"
                      onClick={() => navigate("/auth/register/user")}
                    >
                      User
                    </button>
                  </li>
                  <li>
                    <button
                      className="btn btn-outline mt-1"
                      onClick={() => navigate("/auth/register/creator")}
                    >
                      Creator
                    </button>
                  </li>
                </ul>
              </details>
            </li>
            <li>
              <Link to="about" smooth={true} offset={40} duration={500}>
                About Us
              </Link>
            </li>
          </ul>
        </div>
        <div className="navbar-end">
          <button
            className="btn btn-primary mr-3"
            onClick={() => navigate("/auth/login")}
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
