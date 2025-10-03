import React from 'react';
import { X, Plus, Trash2 } from 'lucide-react';

interface CourseData {
  id?: string;
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
}

interface CourseEditorProps {
  course: CourseData;
  onSave: (course: CourseData) => Promise<void>;
  onCancel: () => void;
  isSaving: boolean;
  isNew?: boolean;
}

export function CourseEditor({ course, onSave, onCancel, isSaving, isNew = false }: CourseEditorProps) {
  const [formData, setFormData] = React.useState<CourseData>(course);
  const [activeSection, setActiveSection] = React.useState<'basic' | 'details' | 'arrays'>('basic');

  const updateField = (field: keyof CourseData, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  const updateArrayField = (field: keyof CourseData, index: number, value: string) => {
    const array = [...(formData[field] as string[])];
    array[index] = value;
    setFormData({ ...formData, [field]: array });
  };

  const addArrayItem = (field: keyof CourseData) => {
    const array = [...(formData[field] as string[]), ''];
    setFormData({ ...formData, [field]: array });
  };

  const removeArrayItem = (field: keyof CourseData, index: number) => {
    const array = (formData[field] as string[]).filter((_, i) => i !== index);
    setFormData({ ...formData, [field]: array });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl w-full max-w-4xl flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">
            {isNew ? 'Add New Course' : `Edit: ${course.course_name}`}
          </h2>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex border-b border-gray-200 px-6">
          <button
            type="button"
            onClick={() => setActiveSection('basic')}
            className={`px-4 py-3 font-medium transition-colors border-b-2 ${
              activeSection === 'basic'
                ? 'border-green-600 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Basic Info
          </button>
          <button
            type="button"
            onClick={() => setActiveSection('details')}
            className={`px-4 py-3 font-medium transition-colors border-b-2 ${
              activeSection === 'details'
                ? 'border-green-600 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Course Details
          </button>
          <button
            type="button"
            onClick={() => setActiveSection('arrays')}
            className={`px-4 py-3 font-medium transition-colors border-b-2 ${
              activeSection === 'arrays'
                ? 'border-green-600 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Content & Outcomes
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="flex-1 overflow-y-auto p-6">
            {activeSection === 'basic' && (
              <div className="space-y-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <p className="text-sm text-blue-900">
                    <strong>Basic Information:</strong> Core details including code, name, and the important course date.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Course Code *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.course_code}
                      onChange={(e) => updateField('course_code', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-base"
                      placeholder="e.g., SP-201201"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Course Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.course_name}
                      onChange={(e) => updateField('course_name', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-base"
                      placeholder="e.g., Job Readiness"
                    />
                  </div>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    📅 Next Course Date *
                  </label>
                  <p className="text-xs text-gray-600 mb-3">
                    This is the most important field for customers. Keep it updated regularly.
                  </p>
                  <input
                    type="date"
                    value={formData.upcoming_date}
                    onChange={(e) => updateField('upcoming_date', e.target.value)}
                    className="w-full px-4 py-3 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-base font-medium"
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Duration
                    </label>
                    <input
                      type="text"
                      value={formData.duration}
                      onChange={(e) => updateField('duration', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-base"
                      placeholder="e.g., 10 days"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      NQF Level
                    </label>
                    <input
                      type="text"
                      value={formData.nqf_level}
                      onChange={(e) => updateField('nqf_level', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-base"
                      placeholder="e.g., Level 2"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Credits
                    </label>
                    <input
                      type="number"
                      value={formData.credits}
                      onChange={(e) => updateField('credits', parseInt(e.target.value) || 0)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-base"
                      placeholder="0"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Accrediting Body
                  </label>
                  <input
                    type="text"
                    value={formData.accrediting_body}
                    onChange={(e) => updateField('accrediting_body', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-base"
                    placeholder="e.g., QCTO"
                  />
                </div>
              </div>
            )}

            {activeSection === 'details' && (
              <div className="space-y-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <p className="text-sm text-blue-900">
                    <strong>Course Details:</strong> Describe what this course offers.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Course Purpose
                  </label>
                  <p className="text-xs text-gray-600 mb-2">
                    Describe the main purpose and objectives
                  </p>
                  <textarea
                    value={formData.purpose}
                    onChange={(e) => updateField('purpose', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-base"
                    rows={8}
                    placeholder="Explain what this course aims to achieve..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Certification Details
                  </label>
                  <p className="text-xs text-gray-600 mb-2">
                    What learners will receive upon completion
                  </p>
                  <textarea
                    value={formData.certification}
                    onChange={(e) => updateField('certification', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-base"
                    rows={5}
                    placeholder="Describe the certification..."
                  />
                </div>
              </div>
            )}

            {activeSection === 'arrays' && (
              <div className="space-y-8">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <p className="text-sm text-blue-900">
                    <strong>Content & Outcomes:</strong> Add who should take this course and what they'll learn.
                  </p>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-3">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700">
                        Target Audience
                      </label>
                      <p className="text-xs text-gray-600 mt-1">Who is this course for?</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => addArrayItem('target_audience')}
                      className="flex items-center gap-1 text-sm text-green-600 hover:text-green-700 font-medium px-3 py-2 hover:bg-green-50 rounded-lg transition-colors"
                    >
                      <Plus className="h-4 w-4" /> Add Item
                    </button>
                  </div>
                  <div className="space-y-2">
                    {formData.target_audience.length === 0 ? (
                      <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                        <p className="text-gray-500 text-sm">No items yet</p>
                        <button
                          type="button"
                          onClick={() => addArrayItem('target_audience')}
                          className="mt-2 text-sm text-green-600 hover:text-green-700 font-medium"
                        >
                          Add your first item
                        </button>
                      </div>
                    ) : (
                      formData.target_audience.map((item, index) => (
                        <div key={index} className="flex gap-2">
                          <input
                            type="text"
                            value={item}
                            onChange={(e) => updateArrayField('target_audience', index, e.target.value)}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-base"
                            placeholder="e.g., Unemployed youth"
                          />
                          <button
                            type="button"
                            onClick={() => removeArrayItem('target_audience', index)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {[
                  { field: 'learning_outcomes' as keyof CourseData, label: 'Learning Outcomes', desc: 'What will learners be able to do?', placeholder: 'e.g., Understanding the purpose of work' },
                  { field: 'key_topics' as keyof CourseData, label: 'Key Topics', desc: 'Main topics covered', placeholder: 'e.g., Communication Skills' },
                  { field: 'assessment' as keyof CourseData, label: 'Assessment Methods', desc: 'How will learners be evaluated?', placeholder: 'e.g., Portfolio of Evidence' }
                ].map(({ field, label, desc, placeholder }) => (
                  <div key={field}>
                    <div className="flex justify-between items-center mb-3">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700">{label}</label>
                        <p className="text-xs text-gray-600 mt-1">{desc}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => addArrayItem(field)}
                        className="flex items-center gap-1 text-sm text-green-600 hover:text-green-700 font-medium px-3 py-2 hover:bg-green-50 rounded-lg transition-colors"
                      >
                        <Plus className="h-4 w-4" /> Add
                      </button>
                    </div>
                    <div className="space-y-2">
                      {(formData[field] as string[]).length === 0 ? (
                        <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                          <p className="text-gray-500 text-sm">No {label.toLowerCase()} yet</p>
                          <button
                            type="button"
                            onClick={() => addArrayItem(field)}
                            className="mt-2 text-sm text-green-600 hover:text-green-700 font-medium"
                          >
                            Add first item
                          </button>
                        </div>
                      ) : (
                        (formData[field] as string[]).map((item, index) => (
                          <div key={index} className="flex gap-2">
                            <input
                              type="text"
                              value={item}
                              onChange={(e) => updateArrayField(field, index, e.target.value)}
                              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-base"
                              placeholder={placeholder}
                            />
                            <button
                              type="button"
                              onClick={() => removeArrayItem(field, index)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash2 className="h-5 w-5" />
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-3 p-6 border-t border-gray-200 bg-gray-50">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving || !formData.course_code || !formData.course_name}
              className="flex-1 px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSaving ? 'Saving...' : (isNew ? 'Add Course' : 'Save Changes')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
