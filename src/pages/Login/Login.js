import axios from "axios";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BASE_URL } from "../Urls/Urls";

const Login = ({ setAdmin }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    Email: "",
    Password: "",
  });
  const [loginErr, setLoginErr] = useState("");

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    setLoading(true);
    e.preventDefault();
    axios
      .post(`${BASE_URL}/login`, formData, { withCredentials: true })
      .then((response) => {
        if (response.data.status) {
          setAdmin(response.data.admin);
          navigate("/");
        } else {
          setLoginErr(response.data.message || "Invalid mobile or password");
        }
        setLoading(false);
      })
      .catch(() => {
        setLoginErr("Something went wrong!");
        setLoading(false);
      });
  };

  return (
    <div className="relative min-h-screen flex justify-center items-center bg-white overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Gradient Orb */}
        <div
          className="absolute w-96 h-96 bg-gradient-to-br from-cyan-300/70 to-transparent blur-xl opacity-20"
          style={{
            transform: `translate(${mousePosition.x / 10}px, ${
              mousePosition.y / 10
            }px)`,
          }}
        />

        {/* Grid Background */}
        <div className="absolute inset-0 bg-[linear-gradient(transparent_95%,rgba(56,189,248,0.05)_95%),linear-gradient(90deg,transparent_95%,rgba(56,189,248,0.05)_95%)] bg-[length:40px_40px] animate-[grid-move_20s_linear_infinite]" />

        {/* Floating Elements */}
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-gradient-to-br from-blue-100/10 to-transparent rounded-full blur-lg animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 200 + 50}px`,
              height: `${Math.random() * 200 + 50}px`,
              animationDelay: `${Math.random() * -10}s`,
            }}
          />
        ))}
      </div>

      {/* Main Container */}
      <div className="relative max-w-md w-full bg-white/90 backdrop-blur-lg rounded-xl p-8 border border-gray-200 shadow-lg z-10">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-800">Admin Login</h2>
          <p className="text-gray-500 mb-6">Access your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            {/* User Icon */}
            <svg
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>

            {/* Input Field */}
            <input
              className="w-full pl-10 py-3 bg-gray-100 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none text-gray-700"
              type="email"
              name="Email"
              value={formData.Email}
              onChange={handleChange}
              placeholder="Email"
            />
          </div>

          <div className="relative">
            {/* Lock Icon */}
            <svg
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>

            {/* Input Field */}
            <input
              className="w-full pl-10 py-3 bg-gray-100 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none text-gray-700"
              type="password"
              name="Password"
              value={formData.Password}
              onChange={handleChange}
              placeholder="Password"
            />
          </div>
          <Link to="/forgot-password">
            <p className="text-blue-500 text-sm hover:text-blue-600 mt-2">
              Forgot password?
            </p>
          </Link>
          {loginErr && <p className="text-red-500 text-sm">{loginErr}</p>}

          <button
            type="submit"
            className="w-full py-3 bg-blue-500 text-white font-bold rounded-md hover:bg-blue-600 focus:ring-2 focus:ring-blue-400 focus:outline-none flex justify-center items-center"
          >
            {loading ? (
              <div className="flex items-center justify-center p-2">
                <style>{`
        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
            opacity: 0.3;
          }
          50% {
            transform: translateY(-12px);
            opacity: 1;
          }
        }
        .dot {
          animation: bounce 0.8s infinite;
        }
        .dot:nth-child(2) {
          animation-delay: 0.2s;
        }
        .dot:nth-child(3) {
          animation-delay: 0.4s;
        }
      `}</style>
                <div className="flex space-x-2">
                  <div className="dot w-2 h-2 bg-white rounded-full" />
                  <div className="dot w-2 h-2 bg-white rounded-full" />
                  <div className="dot w-2 h-2 bg-white rounded-full" />
                </div>
              </div>
            ) : (
              "Login"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
