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
            <CheckCircle className="h-12 w-12 text-brand-teal" />
          </div>

          {/* Success Message */}
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Thank You!
          </h1>

          <p className="text-lg text-gray-600 mb-8">
            Your registration has been received successfully. Our team will be in touch with you shortly to discuss the next steps.
          </p>

          {/* What's Next */}
          <div className="bg-teal-50 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-green-800 mb-4">
              What happens next?
            </h2>
            <div className="text-left space-y-4">
              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-brand-teal mt-0.5" />
                <div>
                  <h3 className="font-medium text-green-800">We'll Contact You</h3>
                  <p className="text-sm text-[#188770]">
                    Our team will reach out to you within 24 hours to finalize your enrollment and answer any questions.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-brand-teal mt-0.5" />
                <div>
                  <h3 className="font-medium text-green-800">Course Confirmation</h3>
                  <p className="text-sm text-[#188770]">
                    You'll receive all the details about your course, including schedule, materials, and payment information.
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
              className="inline-flex items-center px-6 py-3 bg-brand-teal text-white font-semibold rounded-lg hover:bg-[#188770] transition-colors"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Home
            </Link>
            <Link
              to="/courses"
              className="inline-flex items-center px-6 py-3 border border-brand-teal text-brand-teal font-semibold rounded-lg hover:bg-teal-50 transition-colors"
            >
              View Other Courses
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}