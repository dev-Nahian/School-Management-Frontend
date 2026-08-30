import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import { Sidebar } from '../components/layout/Sidebar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { dashboardService } from '../services/dashboard.service';
import {
  Users,
  UserCheck,
  GraduationCap,
  Sparkles,
  TrendingUp,
  DollarSign,
  Calendar,
  Bell,
  BarChart3,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6', '#ef4444'];

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();

  const { data: dashboard, isLoading } = useQuery({
    queryKey: ['superAdminDashboard'],
    queryFn: dashboardService.getSuperAdminDashboard,
    enabled: user?.role === 'SUPER_ADMIN',
  });

  if (!user) return null;

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <Sidebar />

      <div className="flex-1 space-y-6">
        {/* Welcome Header */}
        <div className="glass-panel p-6 rounded-3xl border border-purple-500/20 bg-gradient-to-r from-purple-950/40 via-gray-900/60 to-indigo-950/40">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <Badge variant="purple" className="mb-2 gap-1.5 font-mono">
                <Sparkles className="h-3.5 w-3.5 text-purple-400" /> Phase 17 Super Admin Command Center
              </Badge>
              <h2 className="text-2xl font-extrabold text-white">
                Welcome back, {user.firstName} {user.lastName}!
              </h2>
              <p className="text-xs text-gray-400 mt-1">
                Real-time school performance, student enrollment, fee collections, attendance, and academic metrics.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs text-emerald-400 font-semibold font-mono">Database Connected</span>
            </div>
          </div>
        </div>

        {/* 1. School Overview Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-gray-800 bg-gray-900/50 hover:border-blue-500/30 transition-all">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-400 font-medium">Total Students</p>
                <h3 className="text-2xl font-extrabold text-white mt-1">
                  {isLoading ? '...' : dashboard?.overview?.totalStudents || 0}
                </h3>
                <span className="text-[10px] text-emerald-400 flex items-center gap-1 mt-1 font-mono">
                  <TrendingUp className="h-3 w-3" /> Active Profile Record
                </span>
              </div>
              <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                <Users className="h-6 w-6" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-800 bg-gray-900/50 hover:border-purple-500/30 transition-all">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-400 font-medium">Total Teachers</p>
                <h3 className="text-2xl font-extrabold text-white mt-1">
                  {isLoading ? '...' : dashboard?.overview?.totalTeachers || 0}
                </h3>
                <span className="text-[10px] text-purple-400 flex items-center gap-1 mt-1 font-mono">
                  <UserCheck className="h-3 w-3" /> Assigned Staff
                </span>
              </div>
              <div className="p-3 rounded-2xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                <UserCheck className="h-6 w-6" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-800 bg-gray-900/50 hover:border-emerald-500/30 transition-all">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-400 font-medium">Total Classes</p>
                <h3 className="text-2xl font-extrabold text-white mt-1">
                  {isLoading ? '...' : dashboard?.overview?.totalClasses || 0}
                </h3>
                <span className="text-[10px] text-emerald-400 flex items-center gap-1 mt-1 font-mono">
                  <GraduationCap className="h-3 w-3" /> Active Grades
                </span>
              </div>
              <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <GraduationCap className="h-6 w-6" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-800 bg-gray-900/50 hover:border-amber-500/30 transition-all">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-400 font-medium">New Admissions</p>
                <h3 className="text-2xl font-extrabold text-white mt-1">
                  {isLoading ? '...' : dashboard?.overview?.newAdmissions || 0}
                </h3>
                <span className="text-[10px] text-amber-400 flex items-center gap-1 mt-1 font-mono">
                  <Sparkles className="h-3 w-3" /> Last 30 Days
                </span>
              </div>
              <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <Sparkles className="h-6 w-6" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 2. Attendance & Finance Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Attendance Overview Card */}
          <Card className="border-gray-800 bg-gray-900/50">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-bold text-white flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-emerald-400" /> Attendance Overview Summary
                </CardTitle>
                <Badge variant="success" className="font-mono text-[10px]">
                  {dashboard?.attendance?.percentage || 100}% Average Rate
                </Badge>
              </div>
              <CardDescription className="text-xs text-gray-400">
                School-wide student attendance breakdown.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-3 rounded-2xl bg-emerald-950/30 border border-emerald-500/20">
                  <p className="text-[10px] text-gray-400">Present</p>
                  <h4 className="text-lg font-bold text-emerald-400 mt-0.5">
                    {dashboard?.attendance?.present || 0}
                  </h4>
                </div>
                <div className="p-3 rounded-2xl bg-rose-950/30 border border-rose-500/20">
                  <p className="text-[10px] text-gray-400">Absent</p>
                  <h4 className="text-lg font-bold text-rose-400 mt-0.5">
                    {dashboard?.attendance?.absent || 0}
                  </h4>
                </div>
                <div className="p-3 rounded-2xl bg-amber-950/30 border border-amber-500/20">
                  <p className="text-[10px] text-gray-400">Late</p>
                  <h4 className="text-lg font-bold text-amber-400 mt-0.5">
                    {dashboard?.attendance?.late || 0}
                  </h4>
                </div>
              </div>

              {/* Attendance Bar Track */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-[11px] font-mono text-gray-400">
                  <span>Overall Attendance Ratio</span>
                  <span className="text-emerald-400 font-bold">{dashboard?.attendance?.percentage || 100}%</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-gray-800 overflow-hidden flex">
                  <div
                    style={{ width: `${dashboard?.attendance?.percentage || 100}%` }}
                    className="bg-emerald-500 h-full rounded-full transition-all"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Finance Overview Card */}
          <Card className="border-gray-800 bg-gray-900/50">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-bold text-white flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-amber-400" /> Finance & Revenue Overview
                </CardTitle>
                <Badge variant="warning" className="font-mono text-[10px]">
                  Real-time Ledger
                </Badge>
              </div>
              <CardDescription className="text-xs text-gray-400">
                Invoiced fee receivables vs collection totals.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className="p-3 rounded-2xl bg-gray-950 border border-gray-800">
                  <p className="text-[10px] text-gray-400">Expected</p>
                  <h4 className="text-sm font-bold text-white mt-0.5 font-mono">
                    ৳{dashboard?.finance?.expected?.toLocaleString() || 0}
                  </h4>
                </div>

                <div className="p-3 rounded-2xl bg-emerald-950/30 border border-emerald-500/20">
                  <p className="text-[10px] text-gray-400">Collected</p>
                  <h4 className="text-sm font-bold text-emerald-400 mt-0.5 font-mono">
                    ৳{dashboard?.finance?.collected?.toLocaleString() || 0}
                  </h4>
                </div>

                <div className="p-3 rounded-2xl bg-amber-950/30 border border-amber-500/20">
                  <p className="text-[10px] text-gray-400">Pending</p>
                  <h4 className="text-sm font-bold text-amber-400 mt-0.5 font-mono">
                    ৳{dashboard?.finance?.pending?.toLocaleString() || 0}
                  </h4>
                </div>

                <div className="p-3 rounded-2xl bg-rose-950/30 border border-rose-500/20">
                  <p className="text-[10px] text-gray-400">Overdue</p>
                  <h4 className="text-sm font-bold text-rose-400 mt-0.5 font-mono">
                    ৳{dashboard?.finance?.overdue?.toLocaleString() || 0}
                  </h4>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 3. Recharts Visualizations */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Class Enrolled Student Bar Chart */}
          <Card className="border-gray-800 bg-gray-900/50 lg:col-span-2">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-bold text-white flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-blue-400" /> Class Distribution Analytics
              </CardTitle>
              <CardDescription className="text-xs text-gray-400">
                Number of active enrolled students per grade.
              </CardDescription>
            </CardHeader>
            <CardContent className="h-64 pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dashboard?.chartData?.classDistribution || []}>
                  <XAxis dataKey="name" stroke="#6b7280" fontSize={11} />
                  <YAxis stroke="#6b7280" fontSize={11} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#090d16', borderColor: '#1f2937', borderRadius: '12px' }}
                    labelStyle={{ color: '#fff', fontWeight: 'bold' }}
                  />
                  <Bar dataKey="students" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Academic Grade Distribution Pie Chart */}
          <Card className="border-gray-800 bg-gray-900/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-bold text-white flex items-center gap-2">
                <GraduationCap className="h-4 w-4 text-purple-400" /> Grade Distribution
              </CardTitle>
              <CardDescription className="text-xs text-gray-400">
                Exam marks breakdown by letter grade.
              </CardDescription>
            </CardHeader>
            <CardContent className="h-64 pt-2 flex items-center justify-center">
              {dashboard?.chartData?.gradeDistribution?.length ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={dashboard?.chartData?.gradeDistribution}
                      dataKey="count"
                      nameKey="grade"
                      cx="50%"
                      cy="50%"
                      outerRadius={75}
                      label={({ name, value }: any) => `${name} (${value})`}
                    >
                      {dashboard?.chartData?.gradeDistribution.map((_: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ backgroundColor: '#090d16', borderColor: '#1f2937', borderRadius: '12px' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-xs text-gray-500">No exam grade entries recorded yet.</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* 4. Academic Overview & Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Admissions & Payments Feed */}
          <Card className="border-gray-800 bg-gray-900/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-white flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-amber-400" /> Recent School Admissions
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-gray-800 text-xs">
                {dashboard?.recentActivity?.recentAdmissions?.length === 0 ? (
                  <p className="p-4 text-center text-gray-500">No recent student admissions.</p>
                ) : (
                  dashboard?.recentActivity?.recentAdmissions?.map((student: any) => (
                    <div key={student.id} className="p-3.5 flex items-center justify-between hover:bg-gray-800/30">
                      <div>
                        <p className="font-bold text-white">
                          {student.firstName} {student.lastName}
                        </p>
                        <p className="text-[10px] text-gray-400 font-mono">
                          ID: {student.studentId} • {student.class?.name} ({student.section?.name})
                        </p>
                      </div>
                      <Badge variant="success" className="text-[10px] font-mono">
                        {new Date(student.admissionDate).toLocaleDateString()}
                      </Badge>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Recent Announcements Feed */}
          <Card className="border-gray-800 bg-gray-900/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-white flex items-center gap-2">
                <Bell className="h-4 w-4 text-purple-400" /> Broadcast Announcements
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-gray-800 text-xs">
                {dashboard?.recentActivity?.recentAnnouncements?.length === 0 ? (
                  <p className="p-4 text-center text-gray-500">No recent broadcast notices.</p>
                ) : (
                  dashboard?.recentActivity?.recentAnnouncements?.map((notice: any) => (
                    <div key={notice.id} className="p-3.5 space-y-1 hover:bg-gray-800/30">
                      <div className="flex items-center justify-between">
                        <p className="font-bold text-white line-clamp-1">{notice.title}</p>
                        <Badge variant="purple" className="text-[10px]">
                          {notice.targetAudience}
                        </Badge>
                      </div>
                      <p className="text-gray-400 line-clamp-1 text-[11px]">{notice.description}</p>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
