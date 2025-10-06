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
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Contact Us
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Get in touch with our team for more information about our courses, 
            scheduling, or any questions you may have about our training programmes.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Get In Touch
            </h2>
            
            <div className="space-y-6">
              {/* Email */}
              <div className="flex items-start gap-4">
                <div className="bg-green-100 p-3 rounded-lg">
                  <Mail className="h-6 w-6 text-brand-teal" />
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
              <div className="flex items-start gap-4">
                <div className="bg-green-100 p-3 rounded-lg">
                  <Phone className="h-6 w-6 text-brand-teal" />
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
              <div className="flex items-start gap-4">
                <div className="bg-green-100 p-3 rounded-lg">
                  <MessageCircle className="h-6 w-6 text-brand-teal" />
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
              <div className="flex items-start gap-4">
                <div className="bg-green-100 p-3 rounded-lg">
                  <Clock className="h-6 w-6 text-brand-teal" />
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
              <div className="flex items-start gap-4">
                <div className="bg-green-100 p-3 rounded-lg">
                  <MapPin className="h-6 w-6 text-brand-teal" />
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
            <div className="mt-8 bg-teal-50 rounded-lg p-6">
              <h3 className="font-semibold text-green-800 mb-3">
                Looking for course information?
              </h3>
              <p className="text-[#188770] mb-4">
                Our three accredited courses cover workplace preparation, essential skills, 
                and new venture creation. Each programme is designed to provide practical, 
                applicable knowledge for career advancement.
              </p>
              <a
                href="/courses"
                className="inline-flex items-center text-brand-teal hover:text-[#188770] font-medium"
              >
                View All Courses
                <Send className="ml-1 h-4 w-4" />
              </a>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}