import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import {
  FiMail,
  FiLock,
  FiLogIn,
  FiEye,
  FiEyeOff,
  FiUser,
  FiHome,
  FiSettings,
} from "react-icons/fi";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await login({ email, password });
    setLoading(false);

    if (res.user?.role) {
      switch (res.user.role) {
        case "admin":
          navigate("/admin");
          break;
        case "user":
          navigate("/user");
          break;
        case "owner":
          navigate("/owner");
          break;
        default:
          navigate("/login");
      }
    } else {
      setError(res.message || "Login failed. Please check your credentials.");
    }
  };

  const RoleInfo = ({ icon: Icon, role, description }) => (
    <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
      <Icon className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
      <div>
        <div className="font-medium text-gray-900 text-xs">{role}</div>
        <div className="text-gray-600 text-xs">{description}</div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4 -mt-8">
      <div className="max-w-sm w-full">
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-5 text-center">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <FiLogIn className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold text-white mb-1">Welcome Back</h1>
            <p className="text-blue-100 text-xs">Sign in to your account</p>
          </div>

          <div className="p-5">
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-2">
                <div className="w-4 h-4 bg-red-100 text-red-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs">!</span>
                </div>
                <div className="text-red-700 text-xs flex-1">{error}</div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="block text-xs font-medium text-gray-700 mb-1"
                >
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
                    className="block w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-xs font-medium text-gray-700 mb-1"
                >
                  Password
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
                    className="block w-full pl-9 pr-10 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
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
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 disabled:from-gray-400 disabled:to-gray-500 text-white py-2.5 px-4 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center space-x-2 disabled:cursor-not-allowed text-sm"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <FiLogIn className="w-4 h-4" />
                    <span>Sign In</span>
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="text-center mb-4">
                <p className="text-gray-600 text-xs">
                  Don't have an account?{" "}
                  <a
                    href="/signup"
                    className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
                  >
                    Create account
                  </a>
                </p>
              </div>

              <h3 className="text-xs font-semibold text-gray-900 mb-2 text-center">
                Platform Access
              </h3>
              <div className="space-y-2 flex items-center">
                <RoleInfo
                  icon={FiUser}
                  role="User"
                  description="Browse & rate stores"
                />
                <RoleInfo
                  icon={FiHome}
                  role="Owner"
                  description="Manage your store"
                />
                <RoleInfo
                  icon={FiSettings}
                  role="Admin"
                  description="Platform management"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
