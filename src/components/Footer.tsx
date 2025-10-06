import React from 'react';
import { Leaf, Mail, Phone } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-brand-teal/20 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Leaf className="h-6 w-6 text-brand-green-light" />
              <div>
                <div className="font-bold text-lg">Greenhouse</div>
                <div className="text-sm text-brand-green-light">Business Development</div>
              </div>
            </div>
            <p className="text-gray-400 mb-4">
              Empowering professionals through accredited business development courses
              and workplace essential skills training.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="/" className="text-gray-400 hover:text-brand-green-light transition-colors">Home</a></li>
              <li><a href="/courses" className="text-gray-400 hover:text-brand-green-light transition-colors">Our Courses</a></li>
              <li><a href="/contact" className="text-gray-400 hover:text-brand-green-light transition-colors">Contact Us</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Contact Information</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-brand-green-light" />
                <span className="text-gray-400 break-all text-sm">academy@greenhousebusinessdevelopment.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-brand-green-light" />
                <span className="text-gray-400">083 597 9697</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center relative">
          <p className="text-gray-400">
            © 2025 Greenhouse Business Development. All rights reserved.
          </p>
          <a
            href="/admin"
            className="absolute bottom-0 right-4 w-2 h-2 bg-gray-700 rounded-full opacity-30 hover:opacity-100 hover:bg-brand-teal transition-all duration-300"
            aria-label="Admin"
          />
        </div>
      </div>
    </footer>
  );
}