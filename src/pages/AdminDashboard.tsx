import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, CreditCard as Edit2, LogOut, RefreshCw, BookOpen, Trash2, Plus, BarChart3, FileText } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { CourseEditor } from '../components/CourseEditor';
import { NotificationCenter } from '../components/NotificationCenter';
import { AnalyticsDashboard } from '../components/AnalyticsDashboard';

interface CourseData {
  id: string;
  course_code: string;
  course_name: string;
  upcoming_date: string;
  purpose: string;
  target_audience: string[];
  duration: string;
  nqf_level: string;
  credits: number;
  accrediting_body: string;
  learning_outcomes: string[];
  key_topics: string[];
  assessment: string[];
  certification: string;
  updated_at?: string;
}

export function AdminDashboard() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<CourseData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [editingCourse, setEditingCourse] = useState<CourseData | null>(null);
  const [isAddingCourse, setIsAddingCourse] = useState(false);
  const [activeTab, setActiveTab] = useState<'courses' | 'analytics' | 'registrations'>('courses');
  const [lastLoginTime, setLastLoginTime] = useState<string>('');
  const [registrations, setRegistrations] = useState<any[]>([]);

  const newCourseTemplate: CourseData = {
    id: '',
    course_code: '',
    course_name: '',
    upcoming_date: '',
    purpose: '',
    target_audience: [],
    duration: '',
    nqf_level: '',
    credits: 0,
    accrediting_body: '',
    learning_outcomes: [],
    key_topics: [],
    assessment: [],
    certification: ''
  };

  useEffect(() => {
    checkAuth();
    fetchCourses();
    fetchRegistrations();
    updateLastLogin();
  }, []);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate('/admin');
      return;
    }

    const { data: adminData } = await supabase
      .from('admin_users')
      .select('last_dashboard_view')
      .eq('email', user.email)
      .maybeSingle();

    if (adminData?.last_dashboard_view) {
      setLastLoginTime(adminData.last_dashboard_view);
    }
  };

  const updateLastLogin = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase
      .from('admin_users')
      .update({ last_dashboard_view: new Date().toISOString() })
      .eq('email', user.email);
  };

  const fetchRegistrations = async () => {
    try {
      const { data, error } = await supabase
        .from('registrations')
        .select('*')
        .order('submission_date', { ascending: false });

      if (error) throw error;
      setRegistrations(data || []);
    } catch (error) {
      console.error('Error fetching registrations:', error);
    }
  };

  const handleStatusChange = async (registrationId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('registrations')
        .update({ status: newStatus })
        .eq('id', registrationId);

      if (error) throw error;

      await fetchRegistrations();
    } catch (error: any) {
      console.error('Error updating status:', error);
      alert(`Failed to update status: ${error.message}`);
    }
  };

  const fetchCourses = async () => {
    try {
      setIsLoading(true);

      const { data, error } = await supabase
        .from('course_dates')
        .select('*')
        .order('course_code');

      if (error) throw error;

      setCourses(data || []);
    } catch (error) {
      console.error('Error fetching courses:', error);
      alert('Failed to load courses. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/admin');
  };

  const handleSaveCourse = async (courseData: CourseData) => {
    try {
      setIsSaving(true);

      if (isAddingCourse) {
        const { error } = await supabase
          .from('course_dates')
          .insert([{
            ...courseData,
            id: undefined
          }]);

        if (error) throw error;
        alert('Course added successfully!');
      } else {
        const { error } = await supabase
          .from('course_dates')
          .update(courseData)
          .eq('id', courseData.id);

        if (error) throw error;
        alert('Course updated successfully!');
      }

      await fetchCourses();
      setEditingCourse(null);
      setIsAddingCourse(false);
    } catch (error: any) {
      console.error('Error saving course:', error);
      alert(`Failed to save course: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteCourse = async (courseId: string, courseName: string) => {
    if (!confirm(`Are you sure you want to delete "${courseName}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from('course_dates')
        .delete()
        .eq('id', courseId);

      if (error) throw error;

      alert('Course deleted successfully!');
      await fetchCourses();
    } catch (error: any) {
      console.error('Error deleting course:', error);
      alert(`Failed to delete course: ${error.message}`);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Not set';
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <RefreshCw className="h-6 w-6 animate-spin text-brand-teal" />
          <span className="text-gray-600">Loading dashboard...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-teal-50 to-emerald-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-green-100 p-6 mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-brand-teal to-brand-green bg-clip-text text-transparent">Admin Dashboard</h1>
              <p className="text-gray-700 mt-2">Manage courses, view analytics, and track registrations</p>
            </div>
            <div className="flex items-center gap-3">
              <NotificationCenter lastLoginTime={lastLoginTime} />
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-all shadow-md hover:shadow-lg"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </button>
            </div>
          </div>

          <div className="flex gap-2 mt-6 border-b border-gray-200">
            <button
              onClick={() => setActiveTab('courses')}
              className={`px-4 py-2 font-medium transition-colors border-b-2 ${activeTab === 'courses' ? 'text-brand-teal border-brand-teal' : 'text-gray-600 border-transparent hover:text-gray-900'}`}
            >
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                Courses
              </div>
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`px-4 py-2 font-medium transition-colors border-b-2 ${activeTab === 'analytics' ? 'text-brand-teal border-brand-teal' : 'text-gray-600 border-transparent hover:text-gray-900'}`}
            >
              <div className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Analytics
              </div>
            </button>
            <button
              onClick={() => setActiveTab('registrations')}
              className={`px-4 py-2 font-medium transition-colors border-b-2 ${activeTab === 'registrations' ? 'text-brand-teal border-brand-teal' : 'text-gray-600 border-transparent hover:text-gray-900'}`}
            >
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Registrations
              </div>
            </button>
          </div>
        </div>

        {activeTab === 'courses' && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Calendar className="h-6 w-6 text-brand-teal" />
              <h2 className="text-xl font-semibold text-gray-900">All Courses</h2>
            </div>
            <button
              onClick={() => setIsAddingCourse(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-brand-teal to-brand-green text-white rounded-lg hover:from-[#188770] hover:to-[#2f8b5f] transition-all shadow-md hover:shadow-lg"
            >
              <Plus className="h-4 w-4" />
              Add New Course
            </button>
          </div>

          {courses.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No courses found</h3>
              <p className="text-gray-600 mb-4">
                Get started by adding your first course.
              </p>
              <button
                onClick={() => setIsAddingCourse(true)}
                className="px-4 py-2 bg-gradient-to-r from-brand-teal to-brand-green text-white rounded-lg hover:from-[#188770] hover:to-[#2f8b5f] transition-all shadow-md hover:shadow-lg"
              >
                Add Course
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {courses.map((course) => (
                <div
                  key={course.id}
                  className="border border-gray-200 rounded-lg p-6 hover:border-teal-300 transition-colors"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-grow">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-semibold text-gray-900">
                          {course.course_name}
                        </h3>
                        <span className="text-sm font-medium text-brand-teal bg-teal-50 px-3 py-1 rounded-full">
                          {course.course_code}
                        </span>
                      </div>
                      <div className="flex items-center gap-6 text-sm text-gray-600 mb-3">
                        <div className="flex items-center gap-1">
                          <span className="font-medium">NQF Level:</span>
                          <span>{course.nqf_level || 'Not set'}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="font-medium">Credits:</span>
                          <span>{course.credits || 0}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="font-medium">Duration:</span>
                          <span>{course.duration || 'Not set'}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-brand-teal" />
                        <span className="text-sm">
                          <span className="font-medium text-gray-700">Next Date:</span>{' '}
                          <span className="text-brand-teal font-semibold">{formatDate(course.upcoming_date)}</span>
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => setEditingCourse(course)}
                        className="p-2 text-gray-400 hover:text-brand-teal hover:bg-teal-50 rounded-lg transition-colors"
                        title="Edit course"
                      >
                        <Edit2 className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteCourse(course.id, course.course_name)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete course"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>

                  {course.purpose && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <p className="text-sm text-gray-600 line-clamp-2">{course.purpose}</p>
                    </div>
                  )}

                  <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">Accrediting Body:</span>
                      <p className="text-gray-600 mt-1">{course.accrediting_body || 'Not set'}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Target Audience:</span>
                      <p className="text-gray-600 mt-1">{course.target_audience?.length || 0} items</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Learning Outcomes:</span>
                      <p className="text-gray-600 mt-1">{course.learning_outcomes?.length || 0} items</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Key Topics:</span>
                      <p className="text-gray-600 mt-1">{course.key_topics?.length || 0} items</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="mt-8 bg-teal-50 border border-teal-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Important Note</h3>
            <p className="text-gray-700">
              Course dates are the most important information for customers. Make sure to keep them up to date regularly.
              Changes you make here will be immediately visible on the public courses page.
            </p>
          </div>
        </div>
        )}

        {activeTab === 'analytics' && (
          <AnalyticsDashboard />
        )}

        {activeTab === 'registrations' && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Recent Registrations</h2>
            {registrations.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No registrations yet</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Name</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Email</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Course</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Seats</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Date</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {registrations.map((reg) => (
                      <tr key={reg.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 text-gray-900">{reg.name}</td>
                        <td className="py-3 px-4 text-gray-600">{reg.email}</td>
                        <td className="py-3 px-4 text-gray-900">{reg.course_selection}</td>
                        <td className="py-3 px-4 text-gray-600">{reg.number_of_seats || 1}</td>
                        <td className="py-3 px-4 text-gray-600">
                          {new Date(reg.submission_date).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4">
                          <select
                            value={reg.status}
                            onChange={(e) => handleStatusChange(reg.id, e.target.value)}
                            className={`px-3 py-1.5 rounded-lg text-sm font-medium border-2 transition-all cursor-pointer ${
                              reg.status === 'pending' ? 'bg-yellow-50 text-yellow-800 border-yellow-200 hover:border-yellow-300' :
                              reg.status === 'invoiced' ? 'bg-blue-50 text-blue-800 border-blue-200 hover:border-blue-300' :
                              reg.status === 'paid' ? 'bg-green-50 text-green-800 border-green-200 hover:border-green-300' :
                              'bg-gray-50 text-gray-800 border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <option value="pending">Pending</option>
                            <option value="invoiced">Invoiced</option>
                            <option value="paid">Paid</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {(editingCourse || isAddingCourse) && (
        <CourseEditor
          course={editingCourse || newCourseTemplate}
          onSave={handleSaveCourse}
          onCancel={() => {
            setEditingCourse(null);
            setIsAddingCourse(false);
          }}
          isSaving={isSaving}
          isNew={isAddingCourse}
        />
      )}
    </div>
  );
}
