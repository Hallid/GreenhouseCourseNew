import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, ArrowLeft, Mail, Phone, Calendar } from 'lucide-react';

export function RegistrationSuccess() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          {/* Success Icon */}
          <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>

          {/* Success Message */}
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Registration Successful!
          </h1>
          
          <p className="text-lg text-gray-600 mb-8">
            Thank you for registering with Greenhouse Business Development. 
            Your course registration has been submitted successfully.
          </p>

          {/* What's Next */}
          <div className="bg-green-50 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-green-800 mb-4">
              What happens next?
            </h2>
            <div className="text-left space-y-4">
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <h3 className="font-medium text-green-800">Confirmation Email</h3>
                  <p className="text-sm text-green-700">
                    You'll receive a confirmation email within the next few minutes with your registration details.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <h3 className="font-medium text-green-800">Contact from Our Team</h3>
                  <p className="text-sm text-green-700">
                    Our course coordinator will contact you within 24 hours to finalize your enrollment.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <h3 className="font-medium text-green-800">Invoice & Course Details</h3>
                  <p className="text-sm text-green-700">
                    An invoice will be generated and sent to you along with detailed course information and schedule.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="border-t border-gray-200 pt-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Have questions? Contact us:
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center justify-center gap-2 text-gray-600">
                <Mail className="h-4 w-4" />
                <span className="break-all text-sm">academy@greenhousebusinessdevelopment.com</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-gray-600">
                <Phone className="h-4 w-4" />
                <span>083 597 9697</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/"
              className="inline-flex items-center px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Home
            </Link>
            <Link
              to="/courses"
              className="inline-flex items-center px-6 py-3 border border-green-600 text-green-600 font-semibold rounded-lg hover:bg-green-50 transition-colors"
            >
              View Other Courses
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}