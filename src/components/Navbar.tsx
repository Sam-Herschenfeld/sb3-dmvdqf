import React from 'react';
import { GraduationCap } from 'lucide-react';

export function Navbar() {
  return (
    <nav className="bg-white shadow-lg fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <GraduationCap className="h-8 w-8 text-indigo-600" />
            <span className="ml-2 text-xl font-bold text-gray-900">Elite Tutoring</span>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-700 hover:text-indigo-600 transition">Features</a>
            <a href="#testimonials" className="text-gray-700 hover:text-indigo-600 transition">Testimonials</a>
            <a 
              href="#payment" 
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition"
            >
              Set Up Payment
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}