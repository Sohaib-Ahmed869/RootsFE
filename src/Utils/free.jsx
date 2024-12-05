import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Users, BookOpen, UserCog, Shield, User } from 'lucide-react';
import logo from '../assets/logo.png';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Hero Section */}
      <div className="bg-[#800000] text-white py-16">
        <div className="container mx-auto px-6 text-center">
          <GraduationCap className="w-16 h-16 mx-auto mb-4" />
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Roots Management Portal</h1>
          <p className="text-xl opacity-90">Select your role to access the dashboard</p>
        </div>
      </div>

      {/* Logo Section */}
      <div className="container mx-auto px-6 py-12">
        <div className="flex items-center justify-center">
          <img src={logo} alt="logo" className="h-16" />
        </div>
      </div>

      {/* Dashboard Links */}
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Super Admin */}
          <Link 
            to="/super-admin/dashboard"
            className="group bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className="text-center">
              <Shield className="w-12 h-12 mx-auto mb-4 text-[#800000] group-hover:scale-110 transition-transform duration-300" />
              <h2 className="text-2xl font-bold mb-2 text-gray-800">Super Admin</h2>
              <p className="text-gray-600">Manage system-wide settings and access controls</p>
              <button className="mt-6 px-6 py-2 bg-[#800000] text-white rounded-full hover:bg-[#600000] transition-colors duration-300">
                Access Portal
              </button>
            </div>
          </Link>

          {/* Admin */}
          <Link 
            to="/admin/dashboard"
            className="group bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className="text-center">
              <UserCog className="w-12 h-12 mx-auto mb-4 text-[#800000] group-hover:scale-110 transition-transform duration-300" />
              <h2 className="text-2xl font-bold mb-2 text-gray-800">Admin</h2>
              <p className="text-gray-600">Manage school operations and administrative tasks</p>
              <button className="mt-6 px-6 py-2 bg-[#800000] text-white rounded-full hover:bg-[#600000] transition-colors duration-300">
                Access Portal
              </button>
            </div>
          </Link>

          {/* Teacher */}
          <Link 
            to="/teacher/dashboard"
            className="group bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className="text-center">
              <BookOpen className="w-12 h-12 mx-auto mb-4 text-[#800000] group-hover:scale-110 transition-transform duration-300" />
              <h2 className="text-2xl font-bold mb-2 text-gray-800">Teacher</h2>
              <p className="text-gray-600">Access class management and student assessments</p>
              <button className="mt-6 px-6 py-2 bg-[#800000] text-white rounded-full hover:bg-[#600000] transition-colors duration-300">
                Access Portal
              </button>
            </div>
          </Link>

          {/* Student */}
          <Link 
            to="/student/dashboard"
            className="group bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className="text-center">
              <User className="w-12 h-12 mx-auto mb-4 text-[#800000] group-hover:scale-110 transition-transform duration-300" />
              <h2 className="text-2xl font-bold mb-2 text-gray-800">Student</h2>
              <p className="text-gray-600">View academic progress and course materials</p>
              <button className="mt-6 px-6 py-2 bg-[#800000] text-white rounded-full hover:bg-[#600000] transition-colors duration-300">
                Access Portal
              </button>
            </div>
          </Link>

          {/* Parent */}
          <Link 
            to="/parent/dashboard"
            className="group bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className="text-center">
              <Users className="w-12 h-12 mx-auto mb-4 text-[#800000] group-hover:scale-110 transition-transform duration-300" />
              <h2 className="text-2xl font-bold mb-2 text-gray-800">Parent</h2>
              <p className="text-gray-600">Monitor your child's progress and activities</p>
              <button className="mt-6 px-6 py-2 bg-[#800000] text-white rounded-full hover:bg-[#600000] transition-colors duration-300">
                Access Portal
              </button>
            </div>
          </Link>

          {/* Login */}
          <Link 
            to="/"
            className="group bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className="text-center">
              <Shield className="w-12 h-12 mx-auto mb-4 text-[#800000] group-hover:scale-110 transition-transform duration-300" />
              <h2 className="text-2xl font-bold mb-2 text-gray-800">Login</h2>
              <p className="text-gray-600">Already have an account? Sign in here</p>
              <button className="mt-6 px-6 py-2 bg-[#800000] text-white rounded-full hover:bg-[#600000] transition-colors duration-300">
                Sign In
              </button>
            </div>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-12">
        <div className="container mx-auto px-6 text-center">
          <GraduationCap className="w-8 h-8 mx-auto mb-4" />
          <p className="text-gray-400">© 2024 School Management System. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;