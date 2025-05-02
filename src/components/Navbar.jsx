import React, { useContext, useState } from "react";
import { assets } from "../assets/assets_frontend/assets";
import { NavLink, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const Navbar = () => {
  const { token, setToken, userData } = useContext(AppContext);
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);

  const logout = () => {
    setToken(false);
    localStorage.removeItem("token");
  };

  return (
    <div className="flex items-center justify-between text-sm py-4 mb-5 border-b border-b-gray-400">
      {/* Logo */}
      <img
        onClick={() => navigate("/")}
        className="w-44 cursor-pointer"
        src={assets.logo}
        alt="logo"
      />

      {/* Desktop Menu */}
      <ul className="hidden md:flex items-start gap-5 font-medium">
        <NavLink to="/">
          <li className="py-1">Home</li>
        </NavLink>
        <NavLink to="/doctor">
          <li className="py-1">All Doctors</li>
        </NavLink>
        <NavLink to="/about">
          <li className="py-1">About</li>
        </NavLink>
        <NavLink to="/contact">
          <li className="py-1">Contact</li>
        </NavLink>
      </ul>

      {/* Right Side */}
      <div className="flex items-center gap-4">
        {/* Profile dropdown for desktop */}
        {token && userData ? (
          <div className="hidden md:flex items-center gap-2 cursor-pointer group relative">
            <img
              className="w-8 rounded-full"
              src={
                userData.image?.startsWith("http")
                  ? userData.image
                  : `http://localhost:4000/${userData.image}`
              }
              alt="profile"
            />

            <img className="w-2.5" src={assets.dropdown_icon} alt="" />
            <div className="absolute top-0 right-0 pt-14 text-base font-medium text-gray-500 z-20 hidden group-hover:block">
              <div className="min-w-48 bg-stone-100 rounded flex-col gap-4 p-4">
                <p
                  onClick={() => navigate("/my-profile")}
                  className="hover:text-black cursor-pointer"
                >
                  My Profile
                </p>
                <p
                  onClick={() => navigate("/my-appointment")}
                  className="hover:text-black cursor-pointer"
                >
                  My Appointment
                </p>
                <p onClick={logout} className="hover:text-black cursor-pointer">
                  Log Out
                </p>
              </div>
            </div>
          </div>
        ) : (
          <button
            onClick={() => navigate("/login")}
            className="text-white cursor-pointer bg-sky-500 px-8 py-3 rounded-full font-light hidden md:block"
          >
            Create Account
          </button>
        )}

        {/* Mobile Menu Icon */}
        <img
          onClick={() => setShowMenu(true)}
          className="w-6 md:hidden"
          src={assets.menu_icon}
          alt=""
        />

        {/* Mobile Menu */}
        <div
          className={`${
            showMenu ? "fixed w-full" : "h-0 w-0"
          } md:hidden right-0 top-0 z-20 bottom-0 overflow-y-auto bg-white transition-all`}
        >
          <div className="flex items-center justify-between px-5 py-6">
            <img className="w-36" src={assets.logo} alt="" />
            <img
              className="w-7"
              onClick={() => setShowMenu(false)}
              src={assets.cross_icon}
              alt=""
            />
          </div>
          <ul className="flex flex-col items-center gap-2 mt-5 px-5 text-lg font-medium">
            <NavLink onClick={() => setShowMenu(false)} to="/">
              <p className="px-4 py-2 rounded inline-block">Home</p>
            </NavLink>
            <NavLink onClick={() => setShowMenu(false)} to="/doctor">
              <p className="px-4 py-2 rounded inline-block">All Doctors</p>
            </NavLink>
            <NavLink onClick={() => setShowMenu(false)} to="/about">
              <p className="px-4 py-2 rounded inline-block">About</p>
            </NavLink>
            <NavLink onClick={() => setShowMenu(false)} to="/contact">
              <p className="px-4 py-2 rounded inline-block">Contact</p>
            </NavLink>

            {/* Mobile: Authenticated user options */}
            {token && (
              <>
                <NavLink onClick={() => setShowMenu(false)} to="/my-profile">
                  <p className="px-4 py-2 rounded inline-block">My Profile</p>
                </NavLink>
                <NavLink
                  onClick={() => setShowMenu(false)}
                  to="/my-appointment"
                >
                  <p className="px-4 py-2 rounded inline-block">
                    My Appointment
                  </p>
                </NavLink>
                <p
                  onClick={() => {
                    setToken(false);
                    setShowMenu(false);
                  }}
                  className="px-4 py-2 rounded inline-block text-red-500 cursor-pointer hover:text-red-700"
                >
                  Log Out
                </p>
              </>
            )}

            {/* Mobile: Not logged in */}
            {!token && (
              <button
                onClick={() => {
                  navigate("/login");
                  setShowMenu(false);
                }}
                className="px-4 py-2 rounded bg-sky-500 text-white mt-2"
              >
                Create Account
              </button>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
