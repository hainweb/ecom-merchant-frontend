import { useState } from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import { BASE_URL } from "../Urls/Urls";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [verified, setVerified] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState(""); 

  const navigate = useNavigate();

 const handleSendOtp = async () => {
  setError("");
  setMessage("");
  if (!email) {
    setError("Please enter your email.");
    return;
  }
  try {
    const res = await axios.post(`${BASE_URL}/forgot-password`, { email });

    if (res.status === 200) {
      setOtpSent(true);
      setMessage(res.data.message || "OTP sent to your email.");
    } else {
      setError(res.data.message || "Failed to send OTP.");
    }
  } catch (err) {
    setError(err.response?.data?.message || "Failed to send OTP. Try again.");
  }
};


const handleVerifyOtp = async () => {
  setError("");
  setMessage("");
  if (!otp) {
    setError("Enter the OTP.");
    return;
  }
  try {
    const res = await axios.post(`${BASE_URL}/verify-otp`, { email, otp });

    if (res.status === 200) {
      setVerified(true);
      setMessage(res.data.message || "OTP verified! You can now reset your password.");
    } else {
      setError(res.data.message || "Invalid OTP.");
    }
  } catch (err) {
    setError(err.response?.data?.message || "OTP verification failed.");
  }
};


const handleResetPassword = async () => {
  setError("");
  setMessage("");

  if (!newPassword || !confirmPassword) {
    setError("Enter both password fields.");
    return;
  }

  if (newPassword !== confirmPassword) {
    setError("Passwords do not match.");
    return;
  }

  try {
    const res = await axios.post(`${BASE_URL}/reset-password`, {
      email,
      newPassword,
    });

    if (res.status === 200) {
      setMessage(res.data.message || "Password reset successfully.");
      setTimeout(() => {    
        navigate("/login");
        }, 2000); // Redirect after 2 seconds
    } else {
      setError(res.data.message || "Password reset failed.");
    }
  } catch (err) {
    setError(err.response?.data?.message || "Server error. Try again.");
  }
};


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center mb-6 text-blue-700">
          Forgot Password
        </h2>

        {!otpSent && (
          <>
            <label className="block mb-2 text-sm font-medium">Email</label>
            <input
              type="email"
              className="w-full p-2 border rounded-lg mb-4"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button
              onClick={handleSendOtp}
              className="w-full bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700"
            >
              Send OTP
            </button>
          </>
        )}

        {otpSent && !verified && (
          <>
            <label className="block mt-4 mb-2 text-sm font-medium">OTP</label>
            <input
              type="text"
              className="w-full p-2 border rounded-lg mb-4"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            <button
              onClick={handleVerifyOtp}
              className="w-full bg-green-600 text-white p-2 rounded-lg hover:bg-green-700"
            >
              Verify OTP
            </button>
          </>
        )}

        {verified && (
          <>
            <label className="block mt-4 mb-2 text-sm font-medium">
              New Password
            </label>
            <input
              type="password"
              className="w-full p-2 border rounded-lg mb-3"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <label className="block mb-2 text-sm font-medium">
              Confirm Password
            </label>
            <input
              type="password"
              className="w-full p-2 border rounded-lg mb-4"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <button
              onClick={handleResetPassword}
              className="w-full bg-purple-600 text-white p-2 rounded-lg hover:bg-purple-700"
            >
              Reset Password
            </button>
          </>
        )}

        {(message || error) && (
          <p
            className={`mt-4 text-center text-sm ${
              message ? "text-green-600" : "text-red-500"
            }`}
          >
            {message || error}
          </p>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
