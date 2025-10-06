import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, MessageCircle, Send } from 'lucide-react';

export function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    alert('Thank you for your enquiry! We will get back to you within 24 hours.');
    setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    setIsSubmitting(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="py-16 bg-gradient-to-b from-white via-green-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-8">
            <div className="bg-white p-4 rounded-xl shadow-lg">
              <img
                src="/WhatsApp Image 2025-10-04 at 21.11.12_b8120d5e copy.jpg"
                alt="Greenhouse Business Development"
                className="h-20 w-auto"
              />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-brand-teal to-brand-green bg-clip-text text-transparent mb-6">
            Contact Us
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Get in touch with our team for more information about our courses,
            scheduling, or any questions you may have about our training programmes.
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-brand-teal to-brand-green bg-clip-text text-transparent mb-8 text-center">
            Get In Touch
          </h2>

          {/* Contact Information */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
              {/* Email */}
              <div className="flex items-start gap-5 bg-white p-5 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                <div className="bg-gradient-to-br from-brand-teal to-brand-green p-4 rounded-lg">
                  <Mail className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Email Address</h3>
                  <p className="text-gray-600 break-all">academy@greenhousebusinessdevelopment.com</p>
                  <p className="text-sm text-gray-500 mt-1">
                    We typically respond within 24 hours
                  </p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-5 bg-white p-5 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                <div className="bg-gradient-to-br from-brand-teal to-brand-green p-4 rounded-lg">
                  <Phone className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Phone Number</h3>
                  <p className="text-gray-600">083 597 9697</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Monday - Friday: 8:00 AM - 5:00 PM
                  </p>
                </div>
              </div>

              {/* WhatsApp */}
              <div className="flex items-start gap-5 bg-white p-5 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                <div className="bg-gradient-to-br from-brand-green to-brand-green-light p-4 rounded-lg">
                  <MessageCircle className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">WhatsApp</h3>
                  <p className="text-gray-600">083 597 9697</p>
                  <a
                    href="https://wa.me/27835979697"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-brand-teal hover:text-[#188770] font-medium mt-2"
                  >
                    Send WhatsApp Message
                    <MessageCircle className="ml-1 h-4 w-4" />
                  </a>
                </div>
              </div>

              {/* Office Hours */}
              <div className="flex items-start gap-5 bg-white p-5 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                <div className="bg-gradient-to-br from-brand-orange to-brand-orange-light p-4 rounded-lg">
                  <Clock className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Office Hours</h3>
                  <div className="space-y-1 text-gray-600">
                    <p>Monday - Friday: 8:00 AM - 5:00 PM</p>
                    <p>Saturday: 9:00 AM - 1:00 PM</p>
                    <p>Sunday: Closed</p>
                  </div>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-start gap-5 bg-white p-5 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                <div className="bg-gradient-to-br from-brand-teal to-brand-green p-4 rounded-lg">
                  <MapPin className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Office Location</h3>
                  <p className="text-gray-600">
                    22 Graaff Way Plattekloof 1<br />
                    Cape Town<br />
                    7500, South Africa
                  </p>
                </div>
              </div>
          </div>

          {/* Quick Course Information */}
          <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-xl p-8 shadow-md border border-brand-teal/20">
            <h3 className="font-bold text-xl text-gray-900 mb-4">
              Looking for course information?
            </h3>
            <p className="text-gray-700 mb-6 leading-relaxed">
              Our three accredited courses cover workplace preparation, essential skills,
              and new venture creation. Each programme is designed to provide practical,
              applicable knowledge for career advancement.
            </p>
            <a
              href="/courses"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-brand-teal to-brand-green text-white font-semibold rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-300"
            >
              View All Courses
              <Send className="ml-2 h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}