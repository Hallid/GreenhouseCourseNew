import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Calendar, Clock, Award, Users, BookOpen } from 'lucide-react';
import { RegistrationForm } from '../components/RegistrationForm';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface Course {
  id: string;
  code: string;
  title: string;
  purpose: string;
  targetAudience: string[];
  duration: string;
  nqfLevel: string;
  credits: number;
  accreditingBody: string;
  learningOutcomes: string[];
  keyTopics: string[];
  assessment: string[];
  certification: string;
  upcomingDate: string;
}

export function CoursesPage() {
  const [expandedCourse, setExpandedCourse] = useState<string | null>(null);
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<string>('');
  const [actionType, setActionType] = useState<'register' | 'quote'>('register');
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setIsLoading(true);

      if (!isSupabaseConfigured()) {
        console.log('Supabase not configured, using default courses');
        setCourses(getDefaultCourses());
        return;
      }

      const { data, error } = await supabase
        .from('course_dates')
        .select('*')
        .order('course_code');

      if (error) throw error;

      if (data && data.length > 0) {
        const formattedCourses = data.map(course => ({
          id: course.id,
          code: course.course_code,
          title: course.course_name,
          purpose: course.purpose || '',
          targetAudience: Array.isArray(course.target_audience) ? course.target_audience : [],
          duration: course.duration || '',
          nqfLevel: course.nqf_level || '',
          credits: course.credits || 0,
          accreditingBody: course.accrediting_body || '',
          learningOutcomes: Array.isArray(course.learning_outcomes) ? course.learning_outcomes : [],
          keyTopics: Array.isArray(course.key_topics) ? course.key_topics : [],
          assessment: Array.isArray(course.assessment) ? course.assessment : [],
          certification: course.certification || '',
          upcomingDate: course.upcoming_date || 'Contact us for dates'
        }));
        setCourses(formattedCourses);
      } else {
        setCourses(getDefaultCourses());
      }
    } catch (error) {
      console.log('Could not fetch courses, using defaults:', error);
      setCourses(getDefaultCourses());
    } finally {
      setIsLoading(false);
    }
  };

  const getDefaultCourses = (): Course[] => {
    return [
      {
        id: 'job-readiness-default',
        code: 'SP-201201',
        title: 'Job Readiness',
        upcomingDate: 'Contact us for dates',
        purpose: 'The Workplace Preparation course equips learners with the life skills and employability skills needed to successfully transition into the workplace. It focuses on self-awareness, professional conduct, communication, and resilience, helping learners to adapt and thrive in a work environment.',
        targetAudience: [
          'Unemployed youth entering the workforce',
          'School leavers or graduates seeking employment',
          'Community beneficiaries supported by employability programmes',
          'Entry-level job seekers who need confidence and work-readiness skills'
        ],
        duration: '10 days (300 hours)',
        nqfLevel: 'Level 2',
        credits: 30,
        accreditingBody: 'QCTO',
        learningOutcomes: [
          'Understanding the purpose of work in society and personal growth',
          'Exploring how work impacts individuals, families, and communities',
          'Developing self-awareness, values, strengths, and passions',
          'Adopting positive thinking and building resilience',
          'Mastering job seeking skills including CV writing and applications'
        ],
        keyTopics: [
          'Why Work and Why You Matter',
          'The Value of Work',
          'Know Yourself to Grow Yourself',
          'Growth Mindset',
          'Job Seeking Skills',
          'Interview Skills',
          'Expectations in the Workplace',
          'Communication Skills',
          'Teamwork',
          'Professionalism',
          'Self-Management',
          'Financial Literacy Basics'
        ],
        assessment: [
          'Formative assessments: group work, role-plays, reflection activities',
          'Summative assessments: Portfolio of Evidence (PoE)',
          'Facilitator observation and feedback throughout',
          'Portfolio of evidence compilation',
        ],
        certification: 'Learners who are found competent will receive a QCTO-accredited Statement of Results and certificate of competence for Workplace Preparation (SP-201201).'
      },
      {
        id: 'workplace-skills-default',
        code: 'SP-211009',
        title: 'Workplace Essential Skills',
        upcomingDate: 'Contact us for dates',
        purpose: 'This course builds learners\' ability to operate effectively in diverse workplaces, focusing on rights, responsibilities, performance, and teamwork. It strengthens adaptability, communication, and productivity to meet modern workplace demands. Tailored for SMEs, it covers workplace culture, labour relations, performance management, and organisational effectiveness.',
        targetAudience: [
          'Unemployed youth preparing for employment',
          'Employees seeking to improve workplace competence',
          'Apprentices or interns requiring work-readiness skills',
          'Organisations needing workplace skills training for staff'
        ],
        duration: '5 days (½ day assessments)',
        nqfLevel: 'Level 4',
        credits: 20,
        accreditingBody: 'QCTO',
        learningOutcomes: [
          'Understanding workplace environments and their impact on productivity',
          'Mastering employer and employee rights, responsibilities, and safety',
          'Comprehending employment contracts and Basic Conditions of Employment Act',
          'Implementing fair labour practices and anti-discrimination principles',
          'Applying organisational structures and performance management systems'
        ],
        keyTopics: [
          'Understanding the Workplace Environment',
          'Employer and Employee Responsibilities',
          'Employment Contracts and BCEA essentials',
          'Fair Labour Practices and workplace equity',
          'Organisation of Work and 5S principles',
          'Organisational Structures (functional, divisional, matrix)',
          'Performance Standards and productivity expectations',
          'Performance Management Systems and goal setting',
          'Feedback Systems (360-degree feedback, peer evaluations)',
          'Improving Productivity tools and techniques',
          'Employer Organisations and business chambers',
          'Labour Relations & Dispute Resolution (CCMA processes)'
        ],
        assessment: [
          'Formative assessments: case studies, group work, discussions',
          'Summative assessments: Portfolio of Evidence (PoE)',
          'Facilitator-led feedback throughout the programme',
          'Continuous assessment and competency evaluation'
        ],
        certification: 'Learners who are found competent will receive a QCTO-accredited Statement of Results and certificate of competence for Workplace Essential Skills (SP-211009).'
      },
      {
        id: 'new-venture-default',
        code: 'SP-2110010',
        title: 'New Venture Creation',
        upcomingDate: 'Contact us for dates',
        purpose: 'This programme develops entrepreneurial knowledge and skills, enabling learners to start, manage, and grow sustainable small businesses. It builds confidence, industry awareness, and innovation capacity. Importantly, New Venture Creation is not only for aspiring entrepreneurs who want to launch a business, but also for existing small businesses seeking to scale, improve operations, and unlock growth opportunities.',
        targetAudience: [
          'Youth aspiring to become entrepreneurs',
          'Unemployed individuals seeking self-employment',
          'Micro-entrepreneurs looking to stabilise or expand',
          'Beneficiaries in township and rural enterprise programmes'
        ],
        duration: '10 days (80 hours)',
        nqfLevel: 'Level 2',
        credits: 32,
        accreditingBody: 'QCTO',
        learningOutcomes: [
          'Understanding what it means to be an entrepreneur and their role in society',
          'Developing traits of successful entrepreneurs including resilience and focus',
          'Identifying personal entrepreneurial type and aligning strengths accordingly',
          'Building self-awareness, passion, and vision as an entrepreneur',
          'Making sound business decisions with confidence'
        ],
        keyTopics: [
          'Introduction to Entrepreneurship',
          'Characteristics of Entrepreneurs',
          'Types of Entrepreneurs (builders, innovators, specialists, opportunists)',
          'Types of Entrepreneurship (small business, scalable start-ups, large company, social)',
          'Knowing Yourself as an Entrepreneur',
          'Decision-Making & Confidence',
          'Understanding Industry Dynamics (SWOT, PEST, Porter\'s 5 Forces)',
          'Finding a Business Niche',
          'Identifying Market Opportunities',
          'Exploring New & International Markets',
          'Innovation in Business',
          'Sustaining Business Growth'
        ],
        assessment: [
          'Formative assessments: group activities, case studies, self-reflection',
          'Summative assessments: Portfolio of Evidence (PoE)',
          'Continuous feedback from facilitators',
          'Competency-based practical evaluations'
        ],
        certification: 'Learners who are found competent will receive a QCTO-accredited Statement of Results and certificate of competence for New Venture Creation (SP-2110010).'
      }
    ];
  };

  const formatDate = (dateString: string) => {
    if (!dateString || dateString === 'Contact us for dates') {
      return 'Contact us for dates';
    }
    try {
      return new Date(dateString).toLocaleDateString('en-ZA', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  const toggleCourse = (courseCode: string) => {
    setExpandedCourse(expandedCourse === courseCode ? null : courseCode);
  };

  const handleRegister = (courseCode: string, courseName: string) => {
    setSelectedCourse(`${courseName} (${courseCode})`);
    setActionType('register');
    setShowRegistrationForm(true);
  };

  const handleGetQuote = (courseCode: string, courseName: string) => {
    setSelectedCourse(`${courseName} (${courseCode})`);
    setActionType('quote');
    setShowRegistrationForm(true);
  };

  if (showRegistrationForm) {
    return (
      <RegistrationForm
        selectedCourse={selectedCourse}
        actionType={actionType}
        onClose={() => setShowRegistrationForm(false)}
      />
    );
  }

  if (isLoading) {
    return (
      <div className="py-12 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading courses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Our Accredited Courses
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Choose from comprehensive, industry-accredited programmes designed
            to advance your career and business development skills.
          </p>
        </div>

        <div className="space-y-8">
          {courses.map((course) => (
            <div
              key={course.code}
              className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden"
            >
              <div className="p-6 border-b border-gray-200">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="flex-grow">
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                        {course.title}
                      </h2>
                      <span className="text-sm font-medium text-green-600 bg-green-50 px-3 py-1 rounded-full">
                        {course.code}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-3">
                      <div className="flex items-center gap-1">
                        <Award className="h-4 w-4 text-green-600" />
                        <span>{course.nqfLevel}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <BookOpen className="h-4 w-4 text-green-600" />
                        <span>{course.credits} Credits</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4 text-green-600" />
                        <span>{course.duration}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4 text-green-600" />
                        <span className="font-medium">{formatDate(course.upcomingDate)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={() => handleRegister(course.code, course.title)}
                      className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Register Now
                    </button>
                    <button
                      onClick={() => handleGetQuote(course.code, course.title)}
                      className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Get Quote
                    </button>
                    <button
                      onClick={() => toggleCourse(course.code)}
                      className="px-6 py-3 border border-green-600 text-green-600 font-semibold rounded-lg hover:bg-green-50 transition-colors flex items-center gap-2"
                    >
                      {expandedCourse === course.code ? (
                        <>
                          Less Details <ChevronUp className="h-5 w-5" />
                        </>
                      ) : (
                        <>
                          More Details <ChevronDown className="h-5 w-5" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {expandedCourse === course.code && (
                <div className="p-6 bg-gray-50">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-3">Programme Purpose</h3>
                        <p className="text-gray-700 leading-relaxed">{course.purpose}</p>
                      </div>

                      {course.targetAudience.length > 0 && (
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900 mb-3">Target Audience</h3>
                          <ul className="space-y-2">
                            {course.targetAudience.map((audience, index) => (
                              <li key={index} className="flex items-start gap-2">
                                <Users className="h-4 w-4 text-green-600 mt-1 flex-shrink-0" />
                                <span className="text-gray-700">{audience}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-3">Course Information</h3>
                        <div className="bg-white p-4 rounded-lg space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="font-medium text-gray-600">Duration:</span>
                            <span className="text-gray-900">{course.duration}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="font-medium text-gray-600">NQF Level:</span>
                            <span className="text-gray-900">{course.nqfLevel}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="font-medium text-gray-600">Credits:</span>
                            <span className="text-gray-900">{course.credits}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="font-medium text-gray-600">Accrediting Body:</span>
                            <span className="text-gray-900">{course.accreditingBody}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="font-medium text-gray-600">Next Course:</span>
                            <span className="text-green-600 font-medium">{formatDate(course.upcomingDate)}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-6">
                      {course.learningOutcomes.length > 0 && (
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900 mb-3">Learning Outcomes</h3>
                          <ul className="space-y-2">
                            {course.learningOutcomes.map((outcome, index) => (
                              <li key={index} className="flex items-start gap-2">
                                <div className="bg-green-100 rounded-full p-1 mt-0.5">
                                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                                </div>
                                <span className="text-gray-700">{outcome}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {course.keyTopics.length > 0 && (
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900 mb-3">Key Topics Covered</h3>
                          <ul className="space-y-2">
                            {course.keyTopics.map((topic, index) => (
                              <li key={index} className="flex items-start gap-2">
                                <BookOpen className="h-4 w-4 text-green-600 mt-1 flex-shrink-0" />
                                <span className="text-gray-700">{topic}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {course.assessment.length > 0 && (
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900 mb-3">Assessment Methodology</h3>
                          <ul className="space-y-2">
                            {course.assessment.map((method, index) => (
                              <li key={index} className="flex items-start gap-2">
                                <Award className="h-4 w-4 text-green-600 mt-1 flex-shrink-0" />
                                <span className="text-gray-700">{method}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {course.certification && (
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900 mb-3">Certification</h3>
                          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                            <p className="text-gray-700">{course.certification}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-8 text-center">
                    <button
                      onClick={() => handleRegister(course.code, course.title)}
                      className="px-8 py-3 bg-green-600 text-white font-semibold text-lg rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Register for {course.title}
                    </button>
                    <button
                      onClick={() => handleGetQuote(course.code, course.title)}
                      className="px-8 py-3 bg-green-600 text-white font-semibold text-lg rounded-lg hover:bg-green-700 transition-colors ml-4"
                    >
                      Get Quote for {course.title}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-16 text-center bg-green-50 rounded-xl p-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            Ready to Advance Your Career?
          </h2>
          <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
            Join thousands of professionals who have enhanced their skills through
            our accredited training programmes. Contact us today to learn more.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => setShowRegistrationForm(true)}
              className="px-8 py-3 bg-green-600 text-white font-semibold text-lg rounded-lg hover:bg-green-700 transition-colors"
            >
              Register Now
            </button>
            <button
              onClick={() => {
                setActionType('quote');
                setShowRegistrationForm(true);
              }}
              className="px-8 py-3 bg-green-600 text-white font-semibold text-lg rounded-lg hover:bg-green-700 transition-colors"
            >
              Get Quote
            </button>
            <a
              href="/contact"
              className="px-8 py-3 border border-green-600 text-green-600 font-semibold text-lg rounded-lg hover:bg-green-50 transition-colors"
            >
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
