import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { BASE_URL } from "../../../pages/Urls/Urls";

function Navbar({ admin, setAdmin }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  const handleLogout = () => {
    axios
      .get(`${BASE_URL}/logout`, { withCredentials: true })
      .then(() => {
        setAdmin(null);
        closeMenu();
        navigate("/");
      })
      .catch((error) => console.error("Logout failed", error));
  };

  return (
    <nav className="bg-gradient-to-r from-gray-900 to-gray-800 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              {/* <span className="text-2xl font-bold text-white hover:text-blue-400 transition-colors duration-200">
                Admin Panel
              </span> */}

              <h1 className="text-2xl md:text-3xl font-black bg-gradient-to-r from-white dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent">
                King Cart
              </h1>
            </Link>
          </div>

          <div className="flex items-center md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-200 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white transition-colors duration-200"
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d={
                    isMenuOpen
                      ? "M6 18L18 6M6 6l12 12"
                      : "M4 6h16M4 12h16M4 18h16"
                  }
                />
              </svg>
            </button>
          </div>

          <div className="hidden md:flex md:items-center md:space-x-8">
            <NavLinks
              admin={admin}
              handleLogout={handleLogout}
              isMobile={false}
              closeMenu={closeMenu}
              currentPath={location.pathname}
            />
          </div>
        </div>

        <div className={`${isMenuOpen ? "block" : "hidden"} md:hidden`}>
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <NavLinks
              admin={admin}
              handleLogout={handleLogout}
              isMobile={true}
              closeMenu={closeMenu}
              currentPath={location.pathname}
            />
          </div>
        </div>
      </div>
    </nav>
  );
}

const NavLinks = ({
  admin,
  handleLogout,
  isMobile,
  closeMenu,
  currentPath,
}) => {
  const links = [
    { path: "/", label: "Home" },
    { path: "/dashboard", label: "Dashboard" },
    { path: "/total-orders", label: "Order History" },
  ];

  const baseStyles = "transition-colors duration-200 rounded-md font-medium";
  const mobileBase = `block px-3 py-2 text-base ${baseStyles}`;
  const desktopBase = `px-3 py-2 text-sm ${baseStyles}`;

  const inactiveStyles = isMobile
    ? `${mobileBase} text-gray-100 hover:text-white hover:bg-gray-700`
    : `${desktopBase} text-gray-100 hover:text-white hover:bg-gray-700`;

  const activeStyles = isMobile
    ? `${mobileBase} text-white bg-blue-600`
    : `${desktopBase} text-white border-2 border-blue-500`;

  return (
    <>
      {admin ? (
        <div className="gradient-border inline-block rounded-md p-0.5">
          <button
            onClick={handleLogout}
            className="bg-black text-white rounded-md px-4 py-2 shadow-sm text-sm font-medium  focus:outline-none transition-all duration-300"
          >
            {admin.Name} / Logout
          </button>
        </div>
      ) : (
        <Link
          to="/login"
          onClick={closeMenu}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
        >
          Login
        </Link>
      )}

      {links.map(({ path, label }) => (
        <Link
          key={path}
          to={path}
          onClick={closeMenu}
          className={currentPath === path ? activeStyles : inactiveStyles}
        >
          {label}
        </Link>
      ))}
    </>
  );
};

export default Navbar;
