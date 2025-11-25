import React, { useState, useEffect } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Legend, Area, AreaChart, ComposedChart } from 'recharts';
import { TrendingUp, Users, BookOpen, Activity, Calendar, RefreshCw, Filter, DollarSign, TrendingDown } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface AnalyticsData {
  totalSignups: number;
  weeklySignups: number;
  totalInvoiced: number;
  totalPaid: number;
  conversionRate: number;
  recentActivity: { date: string; count: number }[];
  statusBreakdown: { name: string; value: number; percentage: number }[];
  revenueOverTime: { date: string; invoiced: number; paid: number; total: number }[];
  coursePerformance: any[];
  funnelData: { stage: string; value: number; percentage: number; dropOff: number }[];
}

type TimeRange = '7' | '30' | '90' | 'all';
type ChartType = 'line' | 'area' | 'bar';

export function AnalyticsDashboard() {
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalSignups: 0,
    weeklySignups: 0,
    totalInvoiced: 0,
    totalPaid: 0,
    conversionRate: 0,
    recentActivity: [],
    statusBreakdown: [],
    revenueOverTime: [],
    coursePerformance: [],
    funnelData: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<TimeRange>('30');
  const [activityChartType, setActivityChartType] = useState<ChartType>('area');
  const [revenueChartType, setRevenueChartType] = useState<ChartType>('area');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [showCustomRange, setShowCustomRange] = useState(false);

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange, customStartDate, customEndDate]);

  const fetchAnalytics = async () => {
    try {
      setIsLoading(true);

      const now = new Date();
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

      let startDate: Date;
      const endDate = customEndDate ? new Date(customEndDate) : now;

      if (customStartDate && customEndDate) {
        startDate = new Date(customStartDate);
      } else {
        const daysAgo = timeRange === 'all' ? 3650 : parseInt(timeRange);
        startDate = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
      }

      const [registrationsResult, coursesResult] = await Promise.all([
        supabase.from('registrations').select('*'),
        supabase.from('course_dates').select('course_code, course_name'),
      ]);

      if (registrationsResult.error) throw registrationsResult.error;
      if (coursesResult.error) throw coursesResult.error;

      const registrations = registrationsResult.data || [];
      const courses = coursesResult.data || [];

      const filteredRegistrations = registrations.filter(r => {
        const regDate = new Date(r.submission_date);
        return regDate >= startDate && regDate <= endDate;
      });

      const totalSignups = filteredRegistrations.length;
      const weeklySignups = registrations.filter(
        r => new Date(r.submission_date) >= weekAgo
      ).length;

      const totalInvoiced = filteredRegistrations.filter(r => r.status === 'invoiced').length;
      const totalPaid = filteredRegistrations.filter(r => r.status === 'paid').length;
      const pendingCount = filteredRegistrations.filter(r => r.status === 'pending').length;
      const conversionRate = totalSignups > 0 ? Math.round((totalPaid / totalSignups) * 100) : 0;

      const statusBreakdown = [
        { name: 'Pending', value: pendingCount, percentage: totalSignups > 0 ? Math.round((pendingCount / totalSignups) * 100) : 0 },
        { name: 'Invoiced', value: totalInvoiced, percentage: totalSignups > 0 ? Math.round((totalInvoiced / totalSignups) * 100) : 0 },
        { name: 'Paid', value: totalPaid, percentage: totalSignups > 0 ? Math.round((totalPaid / totalSignups) * 100) : 0 },
      ];

      const funnelData = [
        {
          stage: 'Sign-ups',
          value: totalSignups,
          percentage: 100,
          dropOff: 0,
        },
        {
          stage: 'Invoiced',
          value: totalInvoiced + totalPaid,
          percentage: totalSignups > 0 ? Math.round(((totalInvoiced + totalPaid) / totalSignups) * 100) : 0,
          dropOff: totalSignups > 0 ? Math.round((pendingCount / totalSignups) * 100) : 0,
        },
        {
          stage: 'Paid',
          value: totalPaid,
          percentage: totalSignups > 0 ? Math.round((totalPaid / totalSignups) * 100) : 0,
          dropOff: totalSignups > 0 ? Math.round((totalInvoiced / totalSignups) * 100) : 0,
        },
      ];

      const daysDiff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
      const numDays = Math.min(daysDiff, timeRange === 'all' ? 365 : parseInt(timeRange));
      const skipFactor = numDays > 60 ? Math.ceil(numDays / 30) : numDays > 30 ? 2 : 1;

      const dateRange = Array.from({ length: numDays }, (_, i) => {
        const date = new Date(startDate);
        date.setDate(date.getDate() + i);
        return date;
      });

      const recentActivity = dateRange.map(date => {
        const dayStart = new Date(date.setHours(0, 0, 0, 0));
        const dayEnd = new Date(date.setHours(23, 59, 59, 999));

        const count = filteredRegistrations.filter(r => {
          const regDate = new Date(r.submission_date);
          return regDate >= dayStart && regDate <= dayEnd;
        }).length;

        const formatDate = numDays > 90
          ? date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' })
          : date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

        return {
          date: formatDate,
          count,
        };
      }).filter((_, i) => i % skipFactor === 0 || i === dateRange.length - 1);

      const revenueOverTime = dateRange.map(date => {
        const dayStart = new Date(date.setHours(0, 0, 0, 0));
        const dayEnd = new Date(date.setHours(23, 59, 59, 999));

        const dayRegistrations = filteredRegistrations.filter(r => {
          const regDate = new Date(r.submission_date);
          return regDate >= dayStart && regDate <= dayEnd;
        });

        const invoiced = dayRegistrations.filter(r => r.status === 'invoiced').length;
        const paid = dayRegistrations.filter(r => r.status === 'paid').length;

        const formatDate = numDays > 90
          ? date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' })
          : date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

        return {
          date: formatDate,
          invoiced,
          paid,
          total: invoiced + paid,
        };
      }).filter((_, i) => i % skipFactor === 0 || i === dateRange.length - 1);

      const courseCodeMap: Record<string, string> = {};
      courses.forEach(c => {
        courseCodeMap[c.course_code] = c.course_name;
      });

      const uniqueCourses = [...new Set(filteredRegistrations.map(r => r.course_selection))];

      const coursePerformance = dateRange.map(date => {
        const dayStart = new Date(date.setHours(0, 0, 0, 0));
        const dayEnd = new Date(date.setHours(23, 59, 59, 999));

        const dayRegistrations = filteredRegistrations.filter(r => {
          const regDate = new Date(r.submission_date);
          return regDate >= dayStart && regDate <= dayEnd;
        });

        const formatDate = numDays > 90
          ? date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' })
          : date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

        const dataPoint: any = { date: formatDate };

        uniqueCourses.forEach(courseCode => {
          const courseRegs = dayRegistrations.filter(r => r.course_selection === courseCode);
          dataPoint[courseCode] = courseRegs.length;
          dataPoint[`${courseCode}_paid`] = courseRegs.filter(r => r.status === 'paid').length;
        });

        return dataPoint;
      }).filter((_, i) => i % skipFactor === 0 || i === dateRange.length - 1);

      setAnalytics({
        totalSignups,
        weeklySignups,
        totalInvoiced,
        totalPaid,
        conversionRate,
        recentActivity,
        statusBreakdown,
        revenueOverTime,
        coursePerformance,
        funnelData,
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const COLORS = ['#1BA098', '#16A34A', '#2563EB', '#9333EA', '#EA580C', '#DC2626', '#F59E0B'];

  const handleRefresh = () => {
    fetchAnalytics();
  };

  const handleCustomRangeApply = () => {
    if (customStartDate && customEndDate) {
      fetchAnalytics();
    }
  };

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
      <div className="bg-white rounded-xl shadow-sm p-6 border border-green-100">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-brand-teal" />
            <h3 className="text-lg font-semibold text-gray-800">Time Range</h3>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex gap-2">
              {(['7', '30', '90', 'all'] as TimeRange[]).map((range) => (
                <button
                  key={range}
                  onClick={() => {
                    setTimeRange(range);
                    setShowCustomRange(false);
                    setCustomStartDate('');
                    setCustomEndDate('');
                  }}
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                    timeRange === range && !showCustomRange
                      ? 'bg-brand-teal text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {range === 'all' ? 'All Time' : `${range} Days`}
                </button>
              ))}
              <button
                onClick={() => setShowCustomRange(!showCustomRange)}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                  showCustomRange
                    ? 'bg-brand-teal text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Custom
              </button>
            </div>

            <button
              onClick={handleRefresh}
              className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
              title="Refresh data"
            >
              <RefreshCw className="h-5 w-5 text-gray-700" />
            </button>
          </div>
        </div>

        {showCustomRange && (
          <div className="mt-4 flex flex-wrap items-end gap-3 pt-4 border-t border-gray-200">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
              <input
                type="date"
                value={customStartDate}
                onChange={(e) => setCustomStartDate(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-teal focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
              <input
                type="date"
                value={customEndDate}
                onChange={(e) => setCustomEndDate(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-teal focus:border-transparent"
              />
            </div>
            <button
              onClick={handleCustomRangeApply}
              disabled={!customStartDate || !customEndDate}
              className="px-4 py-2 bg-brand-teal text-white rounded-lg font-medium hover:bg-brand-green transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Apply Range
            </button>
          </div>
        )}
      </div>

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
            <DollarSign className="h-8 w-8 opacity-80" />
            <span className="text-xl font-bold">{analytics.conversionRate}%</span>
          </div>
          <p className="text-emerald-100 text-sm font-medium mb-1">Paid</p>
          <p className="text-4xl font-bold">{analytics.totalPaid}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 border border-green-100">
        <h3 className="text-lg font-semibold bg-gradient-to-r from-brand-teal to-brand-green bg-clip-text text-transparent mb-6">
          Interactive Conversion Funnel
        </h3>
        <div className="space-y-4">
          {analytics.funnelData.map((stage, index) => (
            <div key={stage.stage} className="relative">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-gray-700">{stage.stage}</span>
                  <span className="text-xs text-gray-500">
                    {stage.value} registrations ({stage.percentage}%)
                  </span>
                </div>
                {stage.dropOff > 0 && (
                  <div className="flex items-center gap-1 text-xs text-red-600">
                    <TrendingDown className="h-3 w-3" />
                    <span>{stage.dropOff}% drop-off</span>
                  </div>
                )}
              </div>
              <div className="relative h-16 bg-gray-100 rounded-lg overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 flex items-center justify-center text-white font-semibold ${
                    index === 0 ? 'bg-gradient-to-r from-teal-500 to-teal-600' :
                    index === 1 ? 'bg-gradient-to-r from-blue-500 to-blue-600' :
                    'bg-gradient-to-r from-green-500 to-green-600'
                  }`}
                  style={{ width: `${stage.percentage}%` }}
                >
                  {stage.percentage > 15 && `${stage.value}`}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-green-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold bg-gradient-to-r from-brand-teal to-brand-green bg-clip-text text-transparent">
              Registration Activity
            </h3>
            <div className="flex gap-2">
              {(['area', 'line', 'bar'] as ChartType[]).map((type) => (
                <button
                  key={type}
                  onClick={() => setActivityChartType(type)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-all capitalize ${
                    activityChartType === type
                      ? 'bg-brand-teal text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            {activityChartType === 'area' ? (
              <AreaChart data={analytics.recentActivity}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1BA098" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#1BA098" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="date"
                  stroke="#9ca3af"
                  style={{ fontSize: '10px' }}
                  angle={analytics.recentActivity.length > 15 ? -45 : 0}
                  textAnchor={analytics.recentActivity.length > 15 ? 'end' : 'middle'}
                  height={analytics.recentActivity.length > 15 ? 60 : 30}
                />
                <YAxis stroke="#9ca3af" style={{ fontSize: '12px' }} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-white p-3 shadow-lg rounded-lg border border-gray-200">
                          <p className="text-sm font-semibold text-gray-700">{payload[0].payload.date}</p>
                          <p className="text-sm text-brand-teal font-bold">
                            Sign-ups: {payload[0].value}
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="count"
                  stroke="#1BA098"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorCount)"
                />
              </AreaChart>
            ) : activityChartType === 'line' ? (
              <LineChart data={analytics.recentActivity}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="date"
                  stroke="#9ca3af"
                  style={{ fontSize: '10px' }}
                  angle={analytics.recentActivity.length > 15 ? -45 : 0}
                  textAnchor={analytics.recentActivity.length > 15 ? 'end' : 'middle'}
                  height={analytics.recentActivity.length > 15 ? 60 : 30}
                />
                <YAxis stroke="#9ca3af" style={{ fontSize: '12px' }} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-white p-3 shadow-lg rounded-lg border border-gray-200">
                          <p className="text-sm font-semibold text-gray-700">{payload[0].payload.date}</p>
                          <p className="text-sm text-brand-teal font-bold">
                            Sign-ups: {payload[0].value}
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#1BA098"
                  strokeWidth={3}
                  dot={{ fill: '#1BA098', r: 3 }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            ) : (
              <BarChart data={analytics.recentActivity}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="date"
                  stroke="#9ca3af"
                  style={{ fontSize: '10px' }}
                  angle={analytics.recentActivity.length > 15 ? -45 : 0}
                  textAnchor={analytics.recentActivity.length > 15 ? 'end' : 'middle'}
                  height={analytics.recentActivity.length > 15 ? 60 : 30}
                />
                <YAxis stroke="#9ca3af" style={{ fontSize: '12px' }} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-white p-3 shadow-lg rounded-lg border border-gray-200">
                          <p className="text-sm font-semibold text-gray-700">{payload[0].payload.date}</p>
                          <p className="text-sm text-brand-teal font-bold">
                            Sign-ups: {payload[0].value}
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="count" fill="#1BA098" radius={[8, 8, 0, 0]} />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-green-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold bg-gradient-to-r from-brand-teal to-brand-green bg-clip-text text-transparent">
              Revenue Over Time
            </h3>
            <div className="flex gap-2">
              {(['area', 'line'] as ChartType[]).map((type) => (
                <button
                  key={type}
                  onClick={() => setRevenueChartType(type)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-all capitalize ${
                    revenueChartType === type
                      ? 'bg-brand-teal text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            {revenueChartType === 'area' ? (
              <AreaChart data={analytics.revenueOverTime}>
                <defs>
                  <linearGradient id="colorInvoiced" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1}/>
                  </linearGradient>
                  <linearGradient id="colorPaid" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="date"
                  stroke="#9ca3af"
                  style={{ fontSize: '10px' }}
                  angle={analytics.revenueOverTime.length > 15 ? -45 : 0}
                  textAnchor={analytics.revenueOverTime.length > 15 ? 'end' : 'middle'}
                  height={analytics.revenueOverTime.length > 15 ? 60 : 30}
                />
                <YAxis stroke="#9ca3af" style={{ fontSize: '12px' }} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-white p-3 shadow-lg rounded-lg border border-gray-200">
                          <p className="text-sm font-semibold text-gray-700 mb-2">{payload[0].payload.date}</p>
                          <p className="text-xs text-blue-600 font-semibold">
                            Invoiced: {payload[0].payload.invoiced}
                          </p>
                          <p className="text-xs text-green-600 font-semibold">
                            Paid: {payload[0].payload.paid}
                          </p>
                          <p className="text-xs text-gray-700 font-bold mt-1 pt-1 border-t">
                            Total: {payload[0].payload.total}
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="invoiced"
                  stackId="1"
                  stroke="#3B82F6"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorInvoiced)"
                  name="Invoiced"
                />
                <Area
                  type="monotone"
                  dataKey="paid"
                  stackId="1"
                  stroke="#10B981"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorPaid)"
                  name="Paid"
                />
              </AreaChart>
            ) : (
              <LineChart data={analytics.revenueOverTime}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="date"
                  stroke="#9ca3af"
                  style={{ fontSize: '10px' }}
                  angle={analytics.revenueOverTime.length > 15 ? -45 : 0}
                  textAnchor={analytics.revenueOverTime.length > 15 ? 'end' : 'middle'}
                  height={analytics.revenueOverTime.length > 15 ? 60 : 30}
                />
                <YAxis stroke="#9ca3af" style={{ fontSize: '12px' }} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-white p-3 shadow-lg rounded-lg border border-gray-200">
                          <p className="text-sm font-semibold text-gray-700 mb-2">{payload[0].payload.date}</p>
                          <p className="text-xs text-blue-600 font-semibold">
                            Invoiced: {payload[0].payload.invoiced}
                          </p>
                          <p className="text-xs text-green-600 font-semibold">
                            Paid: {payload[0].payload.paid}
                          </p>
                          <p className="text-xs text-gray-700 font-bold mt-1 pt-1 border-t">
                            Total: {payload[0].payload.total}
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="invoiced"
                  stroke="#3B82F6"
                  strokeWidth={2}
                  dot={{ fill: '#3B82F6', r: 3 }}
                  name="Invoiced"
                />
                <Line
                  type="monotone"
                  dataKey="paid"
                  stroke="#10B981"
                  strokeWidth={2}
                  dot={{ fill: '#10B981', r: 3 }}
                  name="Paid"
                />
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 border border-green-100">
        <h3 className="text-lg font-semibold bg-gradient-to-r from-brand-teal to-brand-green bg-clip-text text-transparent mb-4">
          Course Performance Over Time
        </h3>
        <ResponsiveContainer width="100%" height={350}>
          <ComposedChart data={analytics.coursePerformance}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="date"
              stroke="#9ca3af"
              style={{ fontSize: '10px' }}
              angle={analytics.coursePerformance.length > 15 ? -45 : 0}
              textAnchor={analytics.coursePerformance.length > 15 ? 'end' : 'middle'}
              height={analytics.coursePerformance.length > 15 ? 60 : 30}
            />
            <YAxis stroke="#9ca3af" style={{ fontSize: '12px' }} />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-white p-3 shadow-lg rounded-lg border border-gray-200 max-w-xs">
                      <p className="text-sm font-semibold text-gray-700 mb-2">{payload[0].payload.date}</p>
                      {payload.map((entry: any, index: number) => (
                        <p key={index} className="text-xs font-semibold" style={{ color: entry.color }}>
                          {entry.name}: {entry.value}
                        </p>
                      ))}
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend wrapperStyle={{ fontSize: '12px' }} />
            {Object.keys(analytics.coursePerformance[0] || {})
              .filter(key => key !== 'date' && !key.includes('_paid'))
              .slice(0, 6)
              .map((courseCode, index) => (
                <Bar
                  key={courseCode}
                  dataKey={courseCode}
                  stackId="courses"
                  fill={COLORS[index % COLORS.length]}
                  name={courseCode}
                  radius={index === 0 ? [0, 0, 0, 0] : undefined}
                />
              ))}
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
