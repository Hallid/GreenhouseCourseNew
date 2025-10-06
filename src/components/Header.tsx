import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="bg-white shadow-sm border-b-2 border-brand-teal">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link to="/" className="flex items-center">
            <img
              src="/WhatsApp Image 2025-10-04 at 21.11.12_b8120d5e.jpg"
              alt="Greenhouse Business Development"
              className="h-14 w-auto"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8">
            <Link
              to="/"
              className={`px-3 py-2 text-sm font-medium transition-colors ${
                isActive('/')
                  ? 'text-brand-teal border-b-2 border-brand-teal'
                  : 'text-gray-700 hover:text-brand-teal'
              }`}
            >
              Home
            </Link>
            <Link
              to="/courses"
              className={`px-3 py-2 text-sm font-medium transition-colors ${
                isActive('/courses')
                  ? 'text-brand-teal border-b-2 border-brand-teal'
                  : 'text-gray-700 hover:text-brand-teal'
              }`}
            >
              Courses
            </Link>
            <Link
              to="/contact"
              className={`px-3 py-2 text-sm font-medium transition-colors ${
                isActive('/contact')
                  ? 'text-brand-teal border-b-2 border-brand-teal'
                  : 'text-gray-700 hover:text-brand-teal'
              }`}
            >
              Contact
            </Link>
            <Link
              to="/admin"
              className="px-4 py-2 bg-brand-teal text-white text-sm font-medium rounded-lg hover:bg-[#188770] transition-colors"
            >
              Admin
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-brand-teal focus:outline-none focus:text-brand-teal"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-gray-200">
              <Link
                to="/"
                className={`block px-3 py-2 text-base font-medium transition-colors ${
                  isActive('/') ? 'text-brand-teal' : 'text-gray-700 hover:text-brand-teal'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/courses"
                className={`block px-3 py-2 text-base font-medium transition-colors ${
                  isActive('/courses') ? 'text-brand-teal' : 'text-gray-700 hover:text-brand-teal'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Courses
              </Link>
              <Link
                to="/contact"
                className={`block px-3 py-2 text-base font-medium transition-colors ${
                  isActive('/contact') ? 'text-brand-teal' : 'text-gray-700 hover:text-brand-teal'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
              <Link
                to="/admin"
                className="block px-3 py-2 bg-brand-teal text-white text-base font-medium rounded-lg hover:bg-[#188770] transition-colors mx-3"
                onClick={() => setIsMenuOpen(false)}
              >
                Admin Login
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}