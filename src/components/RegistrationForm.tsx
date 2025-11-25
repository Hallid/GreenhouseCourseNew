import React, { useState } from 'react';
import { X, User, Mail, Phone, Building, Users, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface RegistrationFormProps {
  selectedCourse?: string;
  actionType?: 'register' | 'quote';
  onClose: () => void;
}

interface FormData {
  firstName: string;
  surname: string;
  email: string;
  phone: string;
  companyName: string;
  vatNumber: string;
  courseSelection: string;
  numberOfSeats: number;
}

export function RegistrationForm({ selectedCourse = '', actionType = 'register', onClose }: RegistrationFormProps) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    surname: '',
    email: '',
    phone: '',
    companyName: '',
    vatNumber: '',
    courseSelection: selectedCourse,
    numberOfSeats: 1
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const courses = [
    'Job Readiness (SP-201201)',
    'Workplace Essential Skills (SP-211009)',
    'New Venture Creation (SP-2110010)'
  ];

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.surname.trim()) {
      newErrors.surname = 'Surname is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[0-9]{9,15}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Please enter a valid phone number (9-15 digits)';
    }

    if (!formData.courseSelection) {
      newErrors.courseSelection = 'Please select a course';
    }

    if (formData.numberOfSeats < 1 || formData.numberOfSeats > 50) {
      newErrors.numberOfSeats = 'Number of seats must be between 1 and 50';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const fullName = `${formData.firstName} ${formData.surname}`.trim();

      const { data: insertedRegistration, error: insertError } = await supabase
        .from('registrations')
        .insert({
          name: fullName,
          email: formData.email,
          phone: formData.phone,
          company_name: formData.companyName || null,
          course_selection: formData.courseSelection,
          number_of_seats: formData.numberOfSeats,
          status: 'pending',
        })
        .select()
        .maybeSingle();

      if (insertError) {
        console.error('Supabase insert error:', insertError);
        console.error('Error details:', {
          message: insertError.message,
          details: insertError.details,
          hint: insertError.hint,
          code: insertError.code
        });
        throw new Error(`Database error: ${insertError.message}`);
      }

      if (!insertedRegistration) {
        throw new Error('No data returned from insert');
      }

      console.log('✅ Saved to Supabase:', insertedRegistration);

      const registrationData = {
        first_name: formData.firstName,
        surname: formData.surname,
        full_name: fullName,
        email: formData.email,
        phone: formData.phone,
        company_name: formData.companyName || null,
        vat_number: formData.vatNumber || null,
        course_selection: formData.courseSelection,
        number_of_seats: formData.numberOfSeats,
        action_type: actionType,
        submission_date: new Date().toISOString(),
        registration_id: insertedRegistration.id
      };

      const formDataToSend = new URLSearchParams();
      Object.keys(registrationData).forEach(key => {
        const value = registrationData[key as keyof typeof registrationData];
        if (value !== null && value !== undefined) {
          formDataToSend.append(key, String(value));
        }
      });

      const zohoWebhookUrl = "https://flow.zoho.com/796305666/flow/webhook/incoming?zapikey=1001.5f6e0518816fe64954ad30c68eb49cbc.3a175b4e7e2ee05c3da96ce5e3ec08f1&isdebug=false";

      try {
        await fetch(zohoWebhookUrl, {
          method: 'POST',
          mode: 'no-cors',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: formDataToSend.toString()
        });
        console.log('✅ Forwarded to Zoho Flow');
      } catch (zohoError) {
        console.error('Zoho Flow error (non-critical):', zohoError);
      }

      navigate('/registration-success');

    } catch (error: any) {
      console.error('Registration error:', error);
      const errorMessage = error?.message || 'Unknown error occurred';
      alert(`Failed to submit registration: ${errorMessage}\n\nPlease try again or contact us at greenhousehallid@gmail.com`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof FormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">
            {actionType === 'quote' ? 'Request Quote' : 'Course Registration'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Supabase Status */}
        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Personal Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <User className="h-5 w-5 text-brand-teal" />
              Personal Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                  First Name *
                </label>
                <input
                  type="text"
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-brand-teal focus:border-transparent ${
                    errors.firstName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter your first name"
                />
                {errors.firstName && <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>}
              </div>

              <div>
                <label htmlFor="surname" className="block text-sm font-medium text-gray-700 mb-2">
                  Surname *
                </label>
                <input
                  type="text"
                  id="surname"
                  value={formData.surname}
                  onChange={(e) => handleInputChange('surname', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-brand-teal focus:border-transparent ${
                    errors.surname ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter your surname"
                />
                {errors.surname && <p className="mt-1 text-sm text-red-600">{errors.surname}</p>}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-brand-teal focus:border-transparent ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="your.email@example.com"
                />
                {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-brand-teal focus:border-transparent ${
                    errors.phone ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="0780989876"
                />
                {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
              </div>

              <div>
                <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-2">
                  Company Name (Optional)
                </label>
                <input
                  type="text"
                  id="companyName"
                  value={formData.companyName}
                  onChange={(e) => handleInputChange('companyName', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-teal focus:border-transparent"
                  placeholder="Your company name"
                />
              </div>

              <div>
                <label htmlFor="vatNumber" className="block text-sm font-medium text-gray-700 mb-2">
                  VAT Number (Optional)
                </label>
                <input
                  type="text"
                  id="vatNumber"
                  value={formData.vatNumber}
                  onChange={(e) => handleInputChange('vatNumber', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-teal focus:border-transparent"
                  placeholder="e.g., 4123456789"
                />
              </div>
            </div>
          </div>

          {/* Course Selection */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Building className="h-5 w-5 text-brand-teal" />
              Course Selection
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="courseSelection" className="block text-sm font-medium text-gray-700 mb-2">
                  Select Course *
                </label>
                <select
                  id="courseSelection"
                  value={formData.courseSelection}
                  onChange={(e) => handleInputChange('courseSelection', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-brand-teal focus:border-transparent ${
                    errors.courseSelection ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Choose a course...</option>
                  {courses.map((course) => (
                    <option key={course} value={course}>
                      {course}
                    </option>
                  ))}
                </select>
                {errors.courseSelection && <p className="mt-1 text-sm text-red-600">{errors.courseSelection}</p>}
              </div>

              <div>
                <label htmlFor="numberOfSeats" className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Seats *
                </label>
                <input
                  type="number"
                  id="numberOfSeats"
                  min="1"
                  max="50"
                  value={formData.numberOfSeats}
                  onChange={(e) => handleInputChange('numberOfSeats', parseInt(e.target.value) || 1)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-brand-teal focus:border-transparent ${
                    errors.numberOfSeats ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.numberOfSeats && <p className="mt-1 text-sm text-red-600">{errors.numberOfSeats}</p>}
              </div>
            </div>
          </div>

          {/* Important Notice */}
          <div className="bg-teal-50 border border-teal-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-brand-teal mt-0.5" />
              <div>
                <h4 className="font-semibold text-green-800 mb-1">What happens next?</h4>
                <ul className="text-sm text-[#188770] space-y-1">
                  {actionType === 'quote' ? (
                    <>
                      <li>• Our team will contact you with a detailed quote</li>
                      <li>• A formal quote will be generated and sent to you</li>
                      <li>• You can proceed with registration once you approve the quote</li>
                    </>
                  ) : (
                    <>
                      <li>• Our team will contact you within 24 hours to finalize enrollment</li>
                      <li>• You'll receive course details, schedule, and payment information</li>
                      <li>• Course materials will be provided upon payment confirmation</li>
                    </>
                  )}
                </ul>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex flex-col sm:flex-row gap-3 justify-end pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-3 bg-brand-teal text-white font-semibold rounded-lg hover:bg-[#188770] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  {actionType === 'quote' ? 'Requesting Quote...' : 'Submitting...'}
                </>
              ) : (
                <>
                  <Users className="h-5 w-5" />
                  {actionType === 'quote' ? 'Request Quote' : 'Submit Registration'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}