import { useState, useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "../Urls/Urls";
import { Link, useNavigate } from "react-router-dom";

const Signup = ({ setApproved }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState("");
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    Name: "",
    BusinessName: "",
    GSTNumber: "",
    BusinessType: "",
    BusinessAddress: "",
    Mobile: "",
    Email: "",
    Password: "",
    ConfirmPassword: "",
  });

  useEffect(() => {
    const handleMouseMove = (e) =>
      setMousePosition({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleStep1 = (e) => {
    e.preventDefault();
    setErr("");
    if (
      !formData.Name ||
      !formData.BusinessName ||
      !formData.BusinessType ||
      !formData.BusinessAddress
    ) {
      setErr("Please fill all required fields");
      return;
    }
    setStep(2);
  };

  // Step 2 → Send OTP
  const handleStep2 = async (e) => {
    e.preventDefault();
    setErr("");
    if (
      !formData.Mobile ||
      !formData.Email ||
      !formData.Password ||
      !formData.ConfirmPassword
    ) {
      setErr("Please fill all required fields");
      return;
    }
    if (formData.Mobile.length !== 10) {
      setErr("Invalid Mobile Number");
      return;
    }
    if (formData.Password !== formData.ConfirmPassword) {
      setErr("Passwords do not match");
      return;
    }
    try {
      setLoading(true);

      let res = await axios.post(`${BASE_URL}/send-otp`, {
        email: formData.Email,
        mobile: formData.Mobile,
      });
      if (res.data.status) {
        setStep(3);
      } else {
        setErr(res.data.message || "Failed to send OTP");
      }
    } catch (error) {
      setErr("Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  // Step 3 → Verify OTP
  const handleOtpVerify = async (e) => {
    e.preventDefault();
    setErr("");
    try {
      setLoading(true);
      const res = await axios.post(
        `${BASE_URL}/verify-merchant`,
        {
          email: formData.Email,
          mobile: formData.Mobile,
          otp,
          data: formData,
        },
        { withCredentials: true }
      );

      if (res.data.status) {
        setApproved(false);
        navigate("/application");
        setStep(4);
      } else setErr(res.data.message || "Invalid OTP");
    } catch (error) {
      setErr("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex justify-center items-center bg-white overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute w-96 h-96 bg-gradient-to-br from-cyan-300/70 to-transparent blur-xl opacity-20"
          style={{
            transform: `translate(${mousePosition.x / 10}px, ${
              mousePosition.y / 10
            }px)`,
          }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(transparent_95%,rgba(56,189,248,0.05)_95%),linear-gradient(90deg,transparent_95%,rgba(56,189,248,0.05)_95%)] bg-[length:40px_40px] animate-[grid-move_20s_linear_infinite]" />
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

      {/* Main Form */}
      <div className="relative max-w-md w-full bg-white/90 backdrop-blur-lg rounded-xl p-8 border border-gray-200 shadow-lg z-10">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-800">Merchant Signup</h2>
          <p className="text-gray-500 mb-6">Create your merchant account</p>
        </div>

        {step === 1 && (
          <form onSubmit={handleStep1} className="space-y-4">
            <input
              className="w-full p-3 bg-gray-100 border border-gray-300 rounded-md"
              type="text"
              name="Name"
              placeholder="Full Name"
              value={formData.Name}
              onChange={handleChange}
              required
            />
            <input
              className="w-full p-3 bg-gray-100 border border-gray-300 rounded-md"
              type="text"
              name="BusinessName"
              placeholder="Business Name"
              value={formData.BusinessName}
              onChange={handleChange}
              required
            />
            <input
              className="w-full p-3 bg-gray-100 border border-gray-300 rounded-md"
              type="text"
              name="GSTNumber"
              placeholder="GST Number (Optional)"
              value={formData.GSTNumber}
              onChange={handleChange}
            />
            <select
              className="w-full p-3 bg-gray-100 border border-gray-300 rounded-md"
              name="BusinessType"
              value={formData.BusinessType}
              onChange={handleChange}
              required
            >
              <option value="">Select Business Type</option>
              <option value="Individual">Individual</option>
              <option value="Proprietor">Proprietor</option>
              <option value="Private Ltd">Private Ltd</option>
              <option value="LLP">LLP</option>
            </select>
            <input
              className="w-full p-3 bg-gray-100 border border-gray-300 rounded-md"
              type="text"
              name="BusinessAddress"
              placeholder="Business Address"
              value={formData.BusinessAddress}
              onChange={handleChange}
              required
            />
            {err && <p className="text-red-500 text-sm">{err}</p>}
            <button
              type="submit"
              className="w-full py-3 bg-blue-500 text-white font-bold rounded-md hover:bg-blue-600"
            >
              Next
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleStep2} className="space-y-4">
            <input
              className="w-full p-3 bg-gray-100 border border-gray-300 rounded-md"
              type="text"
              name="Mobile"
              placeholder="Mobile Number"
              value={formData.Mobile}
              onChange={handleChange}
              required
            />
            <input
              className="w-full p-3 bg-gray-100 border border-gray-300 rounded-md"
              type="email"
              name="Email"
              placeholder="Email Address"
              value={formData.Email}
              onChange={handleChange}
              required
            />
            <input
              className="w-full p-3 bg-gray-100 border border-gray-300 rounded-md"
              type="password"
              name="Password"
              placeholder="Password"
              value={formData.Password}
              onChange={handleChange}
              required
            />
            <input
              className="w-full p-3 bg-gray-100 border border-gray-300 rounded-md"
              type="password"
              name="ConfirmPassword"
              placeholder="Confirm Password"
              value={formData.ConfirmPassword}
              onChange={handleChange}
              required
            />
            {err && <p className="text-red-500 text-sm">{err}</p>}
            <button
              type="submit"
              className="w-full py-3 bg-blue-500 text-white font-bold rounded-md hover:bg-blue-600"
            >
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={handleOtpVerify} className="space-y-4">
            <input
              className="w-full p-3 bg-gray-100 border border-gray-300 rounded-md"
              type="text"
              name="otp"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
            {err && <p className="text-red-500 text-sm">{err}</p>}
            <button
              type="submit"
              className="w-full py-3 bg-green-500 text-white font-bold rounded-md hover:bg-green-600"
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </form>
        )}

        {step === 4 && (
          <div className="text-center">
            <h3 className="text-xl font-bold text-green-600 mb-4">
              Your application is submitted!
            </h3>
            <p className="text-gray-600">
              Once our team approves your account, you can log in and start
              using the platform.
            </p>
          </div>
        )}

        {step !== 4 && (
          <div className="flex justify-center items-center mt-1">
            <Link to="/login">
              <p className="text-blue-500 text-sm hover:text-blue-600 mt-2">
                Already have an account?
              </p>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Signup;
