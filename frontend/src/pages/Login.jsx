import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Lock, User } from "lucide-react";

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(username, password);
            navigate("/dashboard");
        } catch (err) {
            setError(
                err.response?.data?.error ||
                "Login failed. Please check your credentials."
            );
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 relative">
            {/* Top Blue Section */}
            <div className="absolute top-0 left-0 w-full h-1/3 bg-blue-900"></div>

            <div className="bg-white p-10 rounded-2xl shadow-2xl z-10 w-full max-w-md">
                {/* Logo */}
                <div className="flex justify-center mb-6">
                    <img
                        src="/aai-logo.png"
                        alt="AAI Logo"
                        className="h-20 object-contain"
                    />
                </div>

                <h1 className="text-2xl font-bold text-center text-gray-800 mb-2">
                    Change Management System
                </h1>
                <p className="text-center text-gray-500 mb-8 text-sm">
                    Sign in to your account
                </p>

                {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Username */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Username
                        </label>
                        <div className="relative">
                            <User className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                            <input
                                type="text"
                                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none text-sm"
                                placeholder="Enter username (e.g., admin1)"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Password
                        </label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                            <input
                                type="password"
                                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none text-sm"
                                placeholder="Enter password (default: password123)"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    {/* Button */}
                    <button
                        type="submit"
                        className="w-full py-2.5 rounded-lg bg-blue-900 text-white font-medium hover:bg-blue-800 transition duration-200"
                    >
                        Sign In
                    </button>
                </form>

                <div className="mt-8 text-center text-xs text-gray-500">
                    © 2026 Airport Authority of India. For Internal Use Only.
                </div>
            </div>
        </div>
    );
};

export default Login;