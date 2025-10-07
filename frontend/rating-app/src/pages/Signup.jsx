import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import {
  FiUser,
  FiMail,
  FiMapPin,
  FiLock,
  FiUserPlus,
  FiEye,
  FiEyeOff,
  FiCheckCircle,
} from "react-icons/fi";

export default function Signup() {
  const { register } = useContext(AuthContext);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [showNotification, setShowNotification] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [notificationClass, setNotificationClass] = useState("animate-fade-in");

  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr(null);
    setValidationErrors({});
    setLoading(true);

    try {
      const res = await register({ name, email, address, password, role: "user" });
      setLoading(false);

      if (
        res?.token ||
        res?.success ||
        (res?.message && res.message.toLowerCase().includes("user registered"))
      ) {
        setSuccessMessage("You have been successfully registered!");
        setShowNotification(true);
        setNotificationClass("animate-fade-in");

        setTimeout(() => setNotificationClass("animate-fade-out-up"), 2200);
        setTimeout(() => {
          setShowNotification(false);
          navigate("/login");
        }, 3000);
      } else if (res?.errors) {
        setValidationErrors(res.errors);
        setErr("Validation failed. Check the fields below.");
      } else {
        setErr(res?.message || "Signup failed");
      }
    } catch (error) {
      setLoading(false);
      setErr("An unexpected error occurred. Please try again.");
    }
  };

  const hasError = (field) => validationErrors[field] || (err && err.includes(field));

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4 relative">

      {showNotification && (
        <div
          className={`fixed top-6 left-1/2 transform -translate-x-1/2 z-50 ${notificationClass}`}
          role="alert"
        >
          <div className="backdrop-blur-md bg-green-50/90 border border-green-200 rounded-xl shadow-lg p-4 flex items-center space-x-3 min-w-[320px] max-w-md">
            <FiCheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
            <div className="flex-1">
              <div className="text-green-800 font-medium text-sm">Registration Complete 🎉</div>
              <div className="text-green-700 text-xs">{successMessage}</div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-sm w-full">
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-green-600 to-emerald-700 p-5 text-center">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <FiUserPlus className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold text-white mb-1">Create Account</h1>
            <p className="text-green-100 text-xs">Join our platform today</p>
          </div>

          <div className="p-5">
            {err && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-2">
                <div className="w-4 h-4 bg-red-100 text-red-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs">!</span>
                </div>
                <div className="text-red-700 text-xs flex-1">{err}</div>
              </div>
            )}

            <form onSubmit={onSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-xs font-medium text-gray-700 mb-1">
                  Full Name <span className="text-gray-500">(20–60 chars)</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiUser className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    id="name"
                    type="text"
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className={`block w-full pl-9 pr-3 py-2 text-sm border ${
                      hasError("name") ? "border-red-500" : "border-gray-300"
                    } rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200`}
                  />
                </div>
                {validationErrors.name && (
                  <p className="text-red-500 text-xs mt-1">{validationErrors.name}</p>
                )}
              </div>

              <div>
                <label htmlFor="email" className="block text-xs font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiMail className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className={`block w-full pl-9 pr-3 py-2 text-sm border ${
                      hasError("email") ? "border-red-500" : "border-gray-300"
                    } rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200`}
                  />
                </div>
                {validationErrors.email && (
                  <p className="text-red-500 text-xs mt-1">{validationErrors.email}</p>
                )}
              </div>

              <div>
                <label htmlFor="address" className="block text-xs font-medium text-gray-700 mb-1">
                  Address <span className="text-gray-500">(Max 400 chars)</span>
                </label>
                <div className="relative">
                  <div className="absolute top-3 left-3 flex items-center pointer-events-none">
                    <FiMapPin className="h-4 w-4 text-gray-400" />
                  </div>
                  <textarea
                    id="address"
                    placeholder="Enter your address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    rows="3"
                    className={`block w-full pl-9 pr-3 py-2 text-sm border ${
                      hasError("address") ? "border-red-500" : "border-gray-300"
                    } rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200 resize-none`}
                  />
                </div>
                {validationErrors.address && (
                  <p className="text-red-500 text-xs mt-1">{validationErrors.address}</p>
                )}
              </div>

              <div>
                <label htmlFor="password" className="block text-xs font-medium text-gray-700 mb-1">
                  Password <span className="text-gray-500">(8–16 chars, 1 uppercase, 1 special)</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiLock className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className={`block w-full pl-9 pr-10 py-2 text-sm border ${
                      hasError("password") ? "border-red-500" : "border-gray-300"
                    } rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? (
                      <FiEyeOff className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <FiEye className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
                {validationErrors.password && (
                  <p className="text-red-500 text-xs mt-1">{validationErrors.password}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 disabled:from-gray-400 disabled:to-gray-500 text-white py-2.5 px-4 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center space-x-2 disabled:cursor-not-allowed text-sm mt-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Creating Account...</span>
                  </>
                ) : (
                  <>
                    <FiUserPlus className="w-4 h-4" />
                    <span>Create Account</span>
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 pt-4 border-t border-gray-200 text-center">
              <p className="text-gray-600 text-xs">
                Already have an account?{" "}
                <a
                  href="/login"
                  className="text-green-600 hover:text-green-700 font-medium transition-colors"
                >
                  Sign in
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
