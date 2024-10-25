import React from 'react';
import Login from "../components/Login";
import { LogoutButton } from "../components/LogoutButton";
import { Register } from "../components/Register";
import { AuthProvider } from "../context/AuthContext";

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100 w-screen">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Authentication Package Demo
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            A simple, secure, and customizable authentication solution for your React applications.
          </p>
        </div>

        <AuthProvider>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Login Card */}
            <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">Login</h2>
              <Login />
            </div>

            {/* Register Card */}
            <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">Register</h2>
              <Register />
            </div>

            {/* Logout Demo Card */}
            <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">Logout Demo</h2>
              <div className="flex flex-col items-center justify-center h-full">
                <p className="text-gray-600 mb-6 text-center">
                  Test the logout functionality once logged in
                </p>
                <LogoutButton />
              </div>
            </div>
          </div>

          {/* Features Section */}
          <div className="mt-20">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              Key Features
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-indigo-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Secure</h3>
                <p className="text-gray-600">Built with security best practices</p>
              </div>
              <div className="text-center">
                <div className="bg-indigo-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Fast</h3>
                <p className="text-gray-600">Optimized for performance</p>
              </div>
              <div className="text-center">
                <div className="bg-indigo-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Customizable</h3>
                <p className="text-gray-600">Easy to style and extend</p>
              </div>
            </div>
          </div>
        </AuthProvider>
      </div>
    </div>
  );
};

export default HomePage;