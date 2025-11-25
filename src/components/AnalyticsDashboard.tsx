import React, { useState, useEffect } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Users, BookOpen, Activity, Calendar } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface AnalyticsData {
  totalSignups: number;
  weeklySignups: number;
  totalInvoiced: number;
  totalPaid: number;
  conversionRate: number;
  coursePopularity: { name: string; value: number; code: string }[];
  weeklyTrend: { date: string; signups: number }[];
  recentActivity: { date: string; count: number }[];
  statusBreakdown: { name: string; value: number; percentage: number }[];
}

export function AnalyticsDashboard() {
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalSignups: 0,
    weeklySignups: 0,
    totalInvoiced: 0,
    totalPaid: 0,
    conversionRate: 0,
    coursePopularity: [],
    weeklyTrend: [],
    recentActivity: [],
    statusBreakdown: [],
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setIsLoading(true);

      const now = new Date();
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

      const [registrationsResult, coursesResult] = await Promise.all([
        supabase.from('registrations').select('*'),
        supabase.from('course_dates').select('course_code, course_name'),
      ]);

      if (registrationsResult.error) throw registrationsResult.error;
      if (coursesResult.error) throw coursesResult.error;

      const registrations = registrationsResult.data || [];
      const courses = coursesResult.data || [];

      const totalSignups = registrations.length;
      const weeklySignups = registrations.filter(
        r => new Date(r.submission_date) >= weekAgo
      ).length;

      const totalInvoiced = registrations.filter(r => r.status === 'invoiced').length;
      const totalPaid = registrations.filter(r => r.status === 'paid').length;
      const pendingCount = registrations.filter(r => r.status === 'pending').length;
      const conversionRate = totalSignups > 0 ? Math.round((totalPaid / totalSignups) * 100) : 0;

      const statusBreakdown = [
        { name: 'Pending', value: pendingCount, percentage: totalSignups > 0 ? Math.round((pendingCount / totalSignups) * 100) : 0 },
        { name: 'Invoiced', value: totalInvoiced, percentage: totalSignups > 0 ? Math.round((totalInvoiced / totalSignups) * 100) : 0 },
        { name: 'Paid', value: totalPaid, percentage: totalSignups > 0 ? Math.round((totalPaid / totalSignups) * 100) : 0 },
      ];

      const courseCounts: Record<string, number> = {};
      registrations.forEach(reg => {
        courseCounts[reg.course_selection] = (courseCounts[reg.course_selection] || 0) + 1;
      });

      const coursePopularity = Object.entries(courseCounts)
        .map(([code, value]) => {
          const course = courses.find(c => c.course_code === code);
          return {
            code,
            name: course?.course_name || code,
            value,
          };
        })
        .sort((a, b) => b.value - a.value)
        .slice(0, 5);

      const last7Days = Array.from({ length: 7 }, (_, i) => {
        const date = new Date(now);
        date.setDate(date.getDate() - (6 - i));
        return date;
      });

      const weeklyTrend = last7Days.map(date => {
        const dayStart = new Date(date.setHours(0, 0, 0, 0));
        const dayEnd = new Date(date.setHours(23, 59, 59, 999));

        const signups = registrations.filter(r => {
          const regDate = new Date(r.submission_date);
          return regDate >= dayStart && regDate <= dayEnd;
        }).length;

        return {
          date: date.toLocaleDateString('en-US', { weekday: 'short' }),
          signups,
        };
      });

      const last30Days = Array.from({ length: 30 }, (_, i) => {
        const date = new Date(now);
        date.setDate(date.getDate() - (29 - i));
        return date;
      });

      const recentActivity = last30Days.map(date => {
        const dayStart = new Date(date.setHours(0, 0, 0, 0));
        const dayEnd = new Date(date.setHours(23, 59, 59, 999));

        const count = registrations.filter(r => {
          const regDate = new Date(r.submission_date);
          return regDate >= dayStart && regDate <= dayEnd;
        }).length;

        return {
          date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          count,
        };
      }).filter((_, i) => i % 3 === 0);

      setAnalytics({
        totalSignups,
        weeklySignups,
        totalInvoiced,
        totalPaid,
        conversionRate,
        coursePopularity,
        weeklyTrend,
        recentActivity,
        statusBreakdown,
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const COLORS = ['#1BA098', '#16A34A', '#2563EB', '#9333EA', '#EA580C'];
  const STATUS_COLORS = ['#FCD34D', '#3B82F6', '#10B981'];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Activity className="h-6 w-6 animate-spin text-brand-teal" />
        <span className="ml-3 text-gray-600">Loading analytics...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <div className="bg-gradient-to-br from-teal-500 to-emerald-600 rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <Users className="h-8 w-8 opacity-80" />
            <TrendingUp className="h-5 w-5 opacity-80" />
          </div>
          <p className="text-teal-100 text-sm font-medium mb-1">Total Sign-ups</p>
          <p className="text-4xl font-bold">{analytics.totalSignups}</p>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <Calendar className="h-8 w-8 opacity-80" />
            <Activity className="h-5 w-5 opacity-80" />
          </div>
          <p className="text-green-100 text-sm font-medium mb-1">This Week</p>
          <p className="text-4xl font-bold">{analytics.weeklySignups}</p>
        </div>

        <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <Activity className="h-8 w-8 opacity-80" />
            <TrendingUp className="h-5 w-5 opacity-80" />
          </div>
          <p className="text-yellow-100 text-sm font-medium mb-1">Pending</p>
          <p className="text-4xl font-bold">{analytics.statusBreakdown.find(s => s.name === 'Pending')?.value || 0}</p>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <BookOpen className="h-8 w-8 opacity-80" />
            <TrendingUp className="h-5 w-5 opacity-80" />
          </div>
          <p className="text-blue-100 text-sm font-medium mb-1">Invoiced</p>
          <p className="text-4xl font-bold">{analytics.totalInvoiced}</p>
        </div>

        <div className="bg-gradient-to-br from-emerald-600 to-green-700 rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="h-8 w-8 opacity-80" />
            <span className="text-xl font-bold">{analytics.conversionRate}%</span>
          </div>
          <p className="text-emerald-100 text-sm font-medium mb-1">Paid</p>
          <p className="text-4xl font-bold">{analytics.totalPaid}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 border border-green-100">
        <h3 className="text-lg font-semibold bg-gradient-to-r from-brand-teal to-brand-green bg-clip-text text-transparent mb-4">Conversion Funnel</h3>
        <div className="grid grid-cols-3 gap-4">
          {analytics.statusBreakdown.map((status, index) => (
            <div key={status.name} className="text-center">
              <div className={`mx-auto w-full h-32 rounded-lg flex flex-col items-center justify-center shadow-md transition-all hover:shadow-lg ${
                status.name === 'Pending' ? 'bg-gradient-to-br from-yellow-100 to-yellow-200' :
                status.name === 'Invoiced' ? 'bg-gradient-to-br from-blue-100 to-blue-200' :
                'bg-gradient-to-br from-green-100 to-green-200'
              }`}>
                <p className={`text-4xl font-bold mb-1 ${
                  status.name === 'Pending' ? 'text-yellow-800' :
                  status.name === 'Invoiced' ? 'text-blue-800' :
                  'text-green-800'
                }`}>{status.value}</p>
                <p className={`text-sm font-medium ${
                  status.name === 'Pending' ? 'text-yellow-700' :
                  status.name === 'Invoiced' ? 'text-blue-700' :
                  'text-green-700'
                }`}>{status.percentage}%</p>
              </div>
              <p className="mt-3 text-sm font-semibold text-gray-700">{status.name}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-green-100">
          <h3 className="text-lg font-semibold bg-gradient-to-r from-brand-teal to-brand-green bg-clip-text text-transparent mb-4">Weekly Sign-up Trend</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={analytics.weeklyTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="date"
                stroke="#9ca3af"
                style={{ fontSize: '12px' }}
              />
              <YAxis stroke="#9ca3af" style={{ fontSize: '12px' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                }}
              />
              <Line
                type="monotone"
                dataKey="signups"
                stroke="#1BA098"
                strokeWidth={3}
                dot={{ fill: '#1BA098', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-green-100">
          <h3 className="text-lg font-semibold bg-gradient-to-r from-brand-teal to-brand-green bg-clip-text text-transparent mb-4">Course Popularity</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={analytics.coursePopularity}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="code"
                stroke="#9ca3af"
                style={{ fontSize: '11px' }}
              />
              <YAxis stroke="#9ca3af" style={{ fontSize: '12px' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                }}
              />
              <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                {analytics.coursePopularity.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 border border-green-100">
        <h3 className="text-lg font-semibold bg-gradient-to-r from-brand-teal to-brand-green bg-clip-text text-transparent mb-4">30-Day Activity</h3>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={analytics.recentActivity}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="date"
              stroke="#9ca3af"
              style={{ fontSize: '11px' }}
            />
            <YAxis stroke="#9ca3af" style={{ fontSize: '12px' }} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
              }}
            />
            <Line
              type="monotone"
              dataKey="count"
              stroke="#2563EB"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
