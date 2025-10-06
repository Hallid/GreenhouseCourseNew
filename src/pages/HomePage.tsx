import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Users, Award, ArrowRight, CheckCircle } from 'lucide-react';

export function HomePage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-nature text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('/Gemini_Generated_Image_cl7ak8cl7ak8cl7a.png')] bg-cover bg-center"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Greenhouse Business Development
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-3xl mx-auto">
              Empowering professionals through accredited business development 
              and workplace essential skills training
            </p>
            <Link
              to="/courses"
              className="inline-flex items-center px-8 py-4 bg-white text-brand-teal font-semibold text-lg rounded-lg hover:bg-gray-50 transition-colors transform hover:scale-105"
            >
              Explore Our Accredited Courses
              <ArrowRight className="ml-2 h-6 w-6" />
            </Link>
          </div>
        </div>
      </section>

      {/* Introduction Section */}
      <section className="py-16 bg-gradient-to-b from-white to-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-brand-teal to-brand-green bg-clip-text text-transparent mb-6">
                About Greenhouse Business Development
              </h2>
              <p className="text-lg text-gray-700 mb-6">
                We specialize in delivering high-quality, accredited training programs
                designed to enhance workplace readiness and entrepreneurial skills.
                Our courses are carefully crafted to meet industry standards and provide
                practical, applicable knowledge.
              </p>
              <p className="text-lg text-gray-700 mb-8">
                Whether you're looking to improve workplace essential skills, prepare
                for professional environments, or develop your entrepreneurial ventures,
                our accredited programs provide the foundation you need for success.
              </p>
              <Link
                to="/contact"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-brand-teal to-brand-green text-white font-semibold rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-300"
              >
                Get In Touch
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
            <div className="flex justify-center">
              <img
                src="/Gemini_Generated_Image_cl7ak8cl7ak8cl7a.png"
                alt="Greenhouse Business Development - Empowering Growth"
                className="rounded-xl shadow-2xl w-full max-w-lg ring-4 ring-brand-teal/20"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Our Courses?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our accredited programs are designed with industry expertise and 
              practical application in mind
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="bg-gradient-to-br from-brand-teal to-brand-green w-16 h-16 rounded-lg flex items-center justify-center mb-6">
                <Award className="h-8 w-8 text-brand-teal" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Fully Accredited
              </h3>
              <p className="text-gray-600">
                All our courses are officially accredited and recognized by relevant 
                industry bodies, ensuring your certification has real value.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="bg-gradient-to-br from-brand-teal to-brand-green w-16 h-16 rounded-lg flex items-center justify-center mb-6">
                <Users className="h-8 w-8 text-brand-teal" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Expert Instructors
              </h3>
              <p className="text-gray-600">
                Learn from industry professionals with real-world experience and 
                deep expertise in business development and workplace skills.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="bg-gradient-to-br from-brand-teal to-brand-green w-16 h-16 rounded-lg flex items-center justify-center mb-6">
                <BookOpen className="h-8 w-8 text-brand-teal" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Practical Learning
              </h3>
              <p className="text-gray-600">
                Our curriculum focuses on practical, actionable skills that you can 
                immediately apply in your workplace or business ventures.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Courses Preview */}
      <section className="py-16 bg-gradient-to-b from-green-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-brand-teal to-brand-green bg-clip-text text-transparent mb-4">
              Our Accredited Courses
            </h2>
            <p className="text-lg text-gray-600">
              Choose from three comprehensive programs designed for professional growth
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 border-t-4 border-brand-teal hover:scale-105">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Job Readiness
              </h3>
              <p className="text-sm text-brand-teal mb-3 font-medium">SP-201201</p>
              <p className="text-gray-600 mb-4">
                Work-Ready Skills for a Thriving Economy - equipping learners with life skills and employability skills.
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 text-brand-green mr-2" />
                  NQF Level 2
                </li>
                <li className="flex items-center text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 text-brand-green mr-2" />
                  30 Credits
                </li>
              </ul>
              <Link
                to="/courses"
                className="inline-flex items-center text-brand-teal font-semibold hover:text-brand-green transition-colors"
              >
                Learn More
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 border-t-4 border-brand-green hover:scale-105">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Workplace Essential Skills
              </h3>
              <p className="text-sm text-brand-green mb-3 font-medium">SP-211009</p>
              <p className="text-gray-600 mb-4">
                Build workplace effectiveness focusing on rights, responsibilities, performance, and teamwork for modern workplace demands.
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 text-brand-teal mr-2" />
                  NQF Level 4
                </li>
                <li className="flex items-center text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 text-brand-teal mr-2" />
                  20 Credits
                </li>
              </ul>
              <Link
                to="/courses"
                className="inline-flex items-center text-brand-green font-semibold hover:text-brand-teal transition-colors"
              >
                Learn More
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 border-t-4 border-brand-orange hover:scale-105">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                New Venture Creation
              </h3>
              <p className="text-sm text-brand-orange mb-3 font-medium">SP-2110010</p>
              <p className="text-gray-600 mb-4">
                Develop entrepreneurial knowledge and skills to start, manage, and grow sustainable small businesses.
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 text-brand-green mr-2" />
                  NQF Level 2
                </li>
                <li className="flex items-center text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 text-brand-green mr-2" />
                  32 Credits
                </li>
              </ul>
              <Link
                to="/courses"
                className="inline-flex items-center text-brand-orange font-semibold hover:text-brand-orange-light transition-colors"
              >
                Learn More
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link
              to="/courses"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-brand-teal to-brand-green text-white font-semibold text-lg rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-300"
            >
              View All Courses
              <ArrowRight className="ml-2 h-6 w-6" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}