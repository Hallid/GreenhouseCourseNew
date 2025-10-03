import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, CreditCard as Edit2, LogOut, RefreshCw, BookOpen, Trash2, Plus } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { CourseEditor } from '../components/CourseEditor';

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
  }, []);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate('/admin');
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
          <RefreshCw className="h-6 w-6 animate-spin text-green-600" />
          <span className="text-gray-600">Loading dashboard...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Course Management</h1>
              <p className="text-gray-600 mt-2">Manage your courses and update dates</p>
            </div>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Calendar className="h-6 w-6 text-green-600" />
              <h2 className="text-xl font-semibold text-gray-900">All Courses</h2>
            </div>
            <button
              onClick={() => setIsAddingCourse(true)}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
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
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Add Course
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {courses.map((course) => (
                <div
                  key={course.id}
                  className="border border-gray-200 rounded-lg p-6 hover:border-green-300 transition-colors"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-grow">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-semibold text-gray-900">
                          {course.course_name}
                        </h3>
                        <span className="text-sm font-medium text-green-600 bg-green-50 px-3 py-1 rounded-full">
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
                        <Calendar className="h-4 w-4 text-green-600" />
                        <span className="text-sm">
                          <span className="font-medium text-gray-700">Next Date:</span>{' '}
                          <span className="text-green-600 font-semibold">{formatDate(course.upcoming_date)}</span>
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => setEditingCourse(course)}
                        className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
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
        </div>

        <div className="mt-8 bg-green-50 border border-green-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Important Note</h3>
          <p className="text-gray-700">
            Course dates are the most important information for customers. Make sure to keep them up to date regularly.
            Changes you make here will be immediately visible on the public courses page.
          </p>
        </div>
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
