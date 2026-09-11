import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sidebar } from '../components/layout/Sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { dashboardService } from '../services/dashboard.service';
import {
  Users,
  UserCheck,
  GraduationCap,
  Sparkles,
  TrendingUp,
  BarChart3,
  UserPlus,
  FileCheck,
  ClipboardList,
  Plus,
  BookOpen,
  Award,
  CreditCard,
  HeartHandshake,
  School,
  Activity,
  Settings,
  FileText,
  Calendar,
  CalendarCheck,
  Megaphone,
  CalendarOff,
  ArrowRight,
  User,
  Phone,
  Mail,
  Clock,
  DollarSign,
  CheckCircle2,
  AlertCircle,
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
  const navigate = useNavigate();

  // Queries for each role
  const { data: superAdminData } = useQuery({
    queryKey: ['superAdminDashboard'],
    queryFn: dashboardService.getSuperAdminDashboard,
    enabled: user?.role === 'SUPER_ADMIN',
  });

  const { data: admissionData } = useQuery({
    queryKey: ['admissionAdminDashboard'],
    queryFn: dashboardService.getAdmissionAdminDashboard,
    enabled: user?.role === 'ADMISSION_ADMIN',
  });

  const { data: teacherData } = useQuery({
    queryKey: ['teacherDashboard'],
    queryFn: dashboardService.getTeacherDashboard,
    enabled: user?.role === 'TEACHER',
  });

  const { data: financeData } = useQuery({
    queryKey: ['financeDashboard'],
    queryFn: dashboardService.getFinanceDashboard,
    enabled: user?.role === 'FINANCE',
  });

  const { data: studentData } = useQuery({
    queryKey: ['studentDashboard'],
    queryFn: dashboardService.getStudentDashboard,
    enabled: user?.role === 'STUDENT',
  });

  const { data: parentData } = useQuery({
    queryKey: ['parentDashboard'],
    queryFn: dashboardService.getParentDashboard,
    enabled: user?.role === 'PARENT',
  });

  const [selectedChildIndex, setSelectedChildIndex] = useState(0);

  if (!user) return null;

  const childrenList = parentData?.children || [];
  const activeChild = childrenList[selectedChildIndex] || childrenList[0] || null;

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <Sidebar />

      <div className="flex-1 space-y-6">
        {/* Welcome Header */}
        <div className="glass-panel p-6 rounded-3xl border border-purple-500/20 bg-gradient-to-r from-purple-950/40 via-gray-900/60 to-indigo-950/40">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <Badge variant="purple" className="mb-2 gap-1.5 font-mono">
                <Sparkles className="h-3.5 w-3.5 text-purple-400" /> Active Role: {user.role}
              </Badge>
              <h2 className="text-2xl font-extrabold text-white">
                Welcome back, {user.firstName} {user.lastName}!
              </h2>
              <p className="text-xs text-gray-400 mt-1">
                Your role-tailored dashboard with live metrics, quick actions, and relevant notices.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs text-emerald-400 font-semibold font-mono">Live Database Session</span>
            </div>
          </div>
        </div>

        {/* 1. SUPER ADMIN DASHBOARD VIEW */}
        {user.role === 'SUPER_ADMIN' && superAdminData && (
          <div className="space-y-6">
            {/* Super Admin Quick Actions */}
            <div className="flex flex-wrap items-center gap-3 p-4 rounded-2xl bg-gray-900/60 border border-gray-800">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider font-mono mr-2">Command Shortcuts:</span>
              <Button size="sm" onClick={() => navigate('/structure')} className="gap-1.5 text-xs bg-purple-600 hover:bg-purple-500">
                <School className="h-3.5 w-3.5" /> School Structure
              </Button>
              <Button size="sm" variant="outline" onClick={() => navigate('/admissions')} className="gap-1.5 text-xs">
                <UserPlus className="h-3.5 w-3.5 text-blue-400" /> Admissions
              </Button>
              <Button size="sm" variant="outline" onClick={() => navigate('/teachers')} className="gap-1.5 text-xs">
                <UserCheck className="h-3.5 w-3.5 text-emerald-400" /> Faculty Roster
              </Button>
              <Button size="sm" variant="outline" onClick={() => navigate('/audit-logs')} className="gap-1.5 text-xs">
                <Activity className="h-3.5 w-3.5 text-rose-400" /> Audit Ledger
              </Button>
              <Button size="sm" variant="outline" onClick={() => navigate('/reports')} className="gap-1.5 text-xs">
                <FileText className="h-3.5 w-3.5 text-amber-400" /> Reports
              </Button>
              <Button size="sm" variant="outline" onClick={() => navigate('/settings')} className="gap-1.5 text-xs">
                <Settings className="h-3.5 w-3.5 text-purple-400" /> Settings
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="border-gray-800 bg-gray-900/50">
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-400 font-medium">Total Students</p>
                    <h3 className="text-2xl font-extrabold text-white mt-1">{superAdminData.overview?.totalStudents}</h3>
                  </div>
                  <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-400"><Users className="h-6 w-6" /></div>
                </CardContent>
              </Card>

              <Card className="border-gray-800 bg-gray-900/50">
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-400 font-medium">Total Teachers</p>
                    <h3 className="text-2xl font-extrabold text-white mt-1">{superAdminData.overview?.totalTeachers}</h3>
                  </div>
                  <div className="p-3 rounded-2xl bg-purple-500/10 text-purple-400"><UserCheck className="h-6 w-6" /></div>
                </CardContent>
              </Card>

              <Card className="border-gray-800 bg-gray-900/50">
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-400 font-medium">Total Classes</p>
                    <h3 className="text-2xl font-extrabold text-white mt-1">{superAdminData.overview?.totalClasses}</h3>
                  </div>
                  <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400"><GraduationCap className="h-6 w-6" /></div>
                </CardContent>
              </Card>

              <Card className="border-gray-800 bg-gray-900/50">
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-400 font-medium">New Admissions</p>
                    <h3 className="text-2xl font-extrabold text-white mt-1">{superAdminData.overview?.newAdmissions}</h3>
                  </div>
                  <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-400"><Sparkles className="h-6 w-6" /></div>
                </CardContent>
              </Card>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="border-gray-800 bg-gray-900/50 lg:col-span-2">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm text-white flex items-center gap-2">
                    <BarChart3 className="h-4 w-4 text-blue-400" /> Class Enrolled Student Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent className="h-64 pt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={superAdminData.chartData?.classDistribution || []}>
                      <XAxis dataKey="name" stroke="#6b7280" fontSize={11} />
                      <YAxis stroke="#6b7280" fontSize={11} />
                      <Tooltip contentStyle={{ backgroundColor: '#090d16', borderColor: '#1f2937', borderRadius: '12px' }} />
                      <Bar dataKey="students" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="border-gray-800 bg-gray-900/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm text-white flex items-center gap-2">
                    <GraduationCap className="h-4 w-4 text-purple-400" /> Academic Grade Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent className="h-64 pt-2 flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={superAdminData.chartData?.gradeDistribution || []}
                        dataKey="count"
                        nameKey="grade"
                        cx="50%"
                        cy="50%"
                        outerRadius={75}
                        label={({ name, value }: any) => `${name} (${value})`}
                      >
                        {(superAdminData.chartData?.gradeDistribution || []).map((_: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ backgroundColor: '#090d16', borderColor: '#1f2937', borderRadius: '12px' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* 2. ADMISSION ADMIN DASHBOARD VIEW */}
        {user.role === 'ADMISSION_ADMIN' && admissionData && (
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="flex items-center gap-3">
              <Button size="sm" onClick={() => navigate('/admissions')} className="gap-1.5 text-xs bg-purple-600 hover:bg-purple-500">
                <UserPlus className="h-4 w-4" /> New Student Admission
              </Button>
              <Button size="sm" variant="outline" onClick={() => navigate('/students')} className="gap-1.5 text-xs">
                <Users className="h-4 w-4 text-blue-400" /> View Students Directory
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Card className="border-gray-800 bg-gray-900/50">
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-400">Today's Admissions</p>
                    <h3 className="text-2xl font-bold text-white mt-1">{admissionData.todayAdmissions}</h3>
                  </div>
                  <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400"><UserPlus className="h-6 w-6" /></div>
                </CardContent>
              </Card>

              <Card className="border-gray-800 bg-gray-900/50">
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-400">Monthly Admissions</p>
                    <h3 className="text-2xl font-bold text-white mt-1">{admissionData.monthAdmissions}</h3>
                  </div>
                  <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-400"><TrendingUp className="h-6 w-6" /></div>
                </CardContent>
              </Card>

              <Card className="border-gray-800 bg-gray-900/50">
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-400">Inactive Profiles</p>
                    <h3 className="text-2xl font-bold text-white mt-1">{admissionData.pendingApplications}</h3>
                  </div>
                  <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-400"><FileCheck className="h-6 w-6" /></div>
                </CardContent>
              </Card>
            </div>

            <Card className="border-gray-800 bg-gray-900/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-white">Recent Student Admissions</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-gray-800 text-xs">
                  {admissionData.recentAdmissions?.map((s: any) => (
                    <div key={s.id} className="p-3 flex items-center justify-between">
                      <div>
                        <p className="font-bold text-white">{s.firstName} {s.lastName}</p>
                        <p className="text-[10px] text-gray-400 font-mono">ID: {s.studentId} • Class {s.class?.name}</p>
                      </div>
                      <Badge variant="success" className="text-[10px]">{new Date(s.admissionDate).toLocaleDateString()}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* 3. TEACHER DASHBOARD VIEW */}
        {user.role === 'TEACHER' && teacherData && (
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="flex flex-wrap items-center gap-3">
              <Button size="sm" onClick={() => navigate('/teachers')} className="gap-1.5 text-xs bg-purple-600 hover:bg-purple-500">
                <UserCheck className="h-4 w-4" /> Educator Workbench
              </Button>
              <Button size="sm" onClick={() => navigate('/attendance')} className="gap-1.5 text-xs bg-emerald-600 hover:bg-emerald-500">
                <ClipboardList className="h-4 w-4" /> Take Class Attendance
              </Button>
              <Button size="sm" onClick={() => navigate('/exams')} className="gap-1.5 text-xs bg-indigo-600 hover:bg-indigo-500">
                <Award className="h-4 w-4" /> Enter Marks
              </Button>
              <Button size="sm" variant="outline" onClick={() => navigate('/assignments')} className="gap-1.5 text-xs">
                <Plus className="h-4 w-4" /> Homework
              </Button>
              <Button size="sm" variant="outline" onClick={() => navigate('/timetable')} className="gap-1.5 text-xs">
                <School className="h-4 w-4 text-amber-400" /> Timetable
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Card className="border-gray-800 bg-gray-900/50">
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-400">Assigned Sections</p>
                    <h3 className="text-2xl font-bold text-white mt-1">{teacherData.assignedClasses}</h3>
                  </div>
                  <div className="p-3 rounded-2xl bg-purple-500/10 text-purple-400"><BookOpen className="h-6 w-6" /></div>
                </CardContent>
              </Card>

              <Card className="border-gray-800 bg-gray-900/50">
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-400">Assignments Created</p>
                    <h3 className="text-2xl font-bold text-white mt-1">{teacherData.assignments?.length || 0}</h3>
                  </div>
                  <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-400"><ClipboardList className="h-6 w-6" /></div>
                </CardContent>
              </Card>

              <Card className="border-gray-800 bg-gray-900/50">
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-400">Upcoming Exams</p>
                    <h3 className="text-2xl font-bold text-white mt-1">{teacherData.upcomingExams?.length || 0}</h3>
                  </div>
                  <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-400"><Award className="h-6 w-6" /></div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* 4. FINANCE DASHBOARD VIEW */}
        {user.role === 'FINANCE' && financeData && (
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="flex items-center gap-3">
              <Button size="sm" onClick={() => navigate('/finance')} className="gap-1.5 text-xs bg-amber-600 hover:bg-amber-500">
                <CreditCard className="h-4 w-4" /> Record Student Payment
              </Button>
              <Button size="sm" variant="outline" onClick={() => navigate('/finance')} className="gap-1.5 text-xs">
                <Plus className="h-4 w-4" /> Create Invoice
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <Card className="border-gray-800 bg-gray-900/50">
                <CardContent className="p-4">
                  <p className="text-xs text-gray-400">Today's Collection</p>
                  <h3 className="text-xl font-bold text-emerald-400 mt-1 font-mono">${financeData.todayCollection?.toLocaleString()}</h3>
                </CardContent>
              </Card>

              <Card className="border-gray-800 bg-gray-900/50">
                <CardContent className="p-4">
                  <p className="text-xs text-gray-400">Monthly Collection</p>
                  <h3 className="text-xl font-bold text-blue-400 mt-1 font-mono">${financeData.monthCollection?.toLocaleString()}</h3>
                </CardContent>
              </Card>

              <Card className="border-gray-800 bg-gray-900/50">
                <CardContent className="p-4">
                  <p className="text-xs text-gray-400">Pending Balance</p>
                  <h3 className="text-xl font-bold text-amber-400 mt-1 font-mono">${financeData.pendingTotal?.toLocaleString()}</h3>
                </CardContent>
              </Card>

              <Card className="border-gray-800 bg-gray-900/50">
                <CardContent className="p-4">
                  <p className="text-xs text-gray-400">Overdue Balance</p>
                  <h3 className="text-xl font-bold text-rose-400 mt-1 font-mono">${financeData.overdueTotal?.toLocaleString()}</h3>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* 5. STUDENT DASHBOARD VIEW */}
        {user.role === 'STUDENT' && (
          <div className="space-y-6">
            {/* Student Identity Card & Shortcuts Banner */}
            <div className="p-4 rounded-2xl bg-gray-900/60 border border-gray-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center font-bold text-white shadow-lg shadow-purple-500/20 text-lg">
                  {user.firstName?.charAt(0)}
                  {user.lastName?.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-white">
                      {user.firstName} {user.lastName}
                    </h3>
                    <Badge variant="purple" className="text-[10px] font-mono">
                      {studentData?.student?.studentId || 'STUDENT'}
                    </Badge>
                  </div>
                  <p className="text-[11px] text-gray-400 font-mono mt-0.5">
                    Class: <span className="text-purple-300 font-semibold">{studentData?.student?.class?.name || 'Grade 8'}</span> •
                    Section: <span className="text-sky-300 font-semibold">{studentData?.student?.section?.name || 'A'}</span> •
                    Roll: <span className="text-emerald-300 font-semibold">{studentData?.student?.rollNumber || '01'}</span>
                  </p>
                </div>
              </div>

              {/* Student Quick Action Buttons */}
              <div className="flex flex-wrap items-center gap-2">
                <Button size="sm" onClick={() => navigate('/students/me')} className="gap-1.5 text-xs bg-purple-600 hover:bg-purple-500">
                  <User className="h-3.5 w-3.5" /> Full Profile
                </Button>
                <Button size="sm" variant="outline" onClick={() => navigate('/attendance')} className="gap-1.5 text-xs">
                  <CalendarCheck className="h-3.5 w-3.5 text-emerald-400" /> My Attendance
                </Button>
                <Button size="sm" variant="outline" onClick={() => navigate('/results')} className="gap-1.5 text-xs">
                  <Award className="h-3.5 w-3.5 text-amber-400" /> Exam Results
                </Button>
                <Button size="sm" variant="outline" onClick={() => navigate('/assignments')} className="gap-1.5 text-xs">
                  <BookOpen className="h-3.5 w-3.5 text-blue-400" /> Homework
                </Button>
                <Button size="sm" variant="outline" onClick={() => navigate('/timetable')} className="gap-1.5 text-xs">
                  <Calendar className="h-3.5 w-3.5 text-indigo-400" /> Timetable
                </Button>
                <Button size="sm" variant="outline" onClick={() => navigate('/leave')} className="gap-1.5 text-xs">
                  <CalendarOff className="h-3.5 w-3.5 text-rose-400" /> Apply Leave
                </Button>
              </div>
            </div>

            {/* Metric KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="border-gray-800 bg-gray-900/50">
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-400 font-medium">Attendance Rate</p>
                    <h3 className="text-2xl font-extrabold text-emerald-400 mt-1 font-mono">
                      {studentData?.attendancePercentage ?? 100}%
                    </h3>
                  </div>
                  <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <CalendarCheck className="h-6 w-6" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-gray-800 bg-gray-900/50">
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-400 font-medium">Cumulative GPA</p>
                    <h3 className="text-2xl font-extrabold text-purple-400 mt-1 font-mono">
                      {studentData?.gpa ?? 0.0} / 5.0
                    </h3>
                  </div>
                  <div className="p-3 rounded-2xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                    <Award className="h-6 w-6" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-gray-800 bg-gray-900/50">
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-400 font-medium">Homework Tasks</p>
                    <h3 className="text-2xl font-extrabold text-blue-400 mt-1 font-mono">
                      {studentData?.assignments?.length || 0}
                    </h3>
                  </div>
                  <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    <BookOpen className="h-6 w-6" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-gray-800 bg-gray-900/50">
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-400 font-medium">Fee Invoices</p>
                    <h3 className="text-2xl font-extrabold text-amber-400 mt-1 font-mono">
                      {studentData?.invoices?.length || 0}
                    </h3>
                  </div>
                  <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    <CreditCard className="h-6 w-6" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Assignments & Upcoming Exams */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Homework Tasks List */}
              <Card className="border-gray-800 bg-gray-900/50">
                <CardHeader className="pb-3 flex flex-row items-center justify-between">
                  <CardTitle className="text-sm text-white flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-blue-400" /> Active Homework & Assignments
                  </CardTitle>
                  <Button size="sm" variant="ghost" onClick={() => navigate('/assignments')} className="text-xs text-purple-400 hover:text-purple-300">
                    View All <ArrowRight className="h-3 w-3 ml-1" />
                  </Button>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y divide-gray-800 text-xs">
                    {!studentData?.assignments || studentData.assignments.length === 0 ? (
                      <p className="p-6 text-center text-gray-500">No active homework tasks assigned.</p>
                    ) : (
                      studentData.assignments.map((asg: any) => (
                        <div key={asg.id} className="p-3.5 flex items-center justify-between hover:bg-gray-800/30 transition-colors">
                          <div className="space-y-0.5">
                            <p className="font-bold text-white">{asg.title}</p>
                            <p className="text-[11px] text-gray-400 font-mono">
                              {asg.subject?.name || 'Subject'} • Total: {asg.totalPoints} pts
                            </p>
                          </div>
                          <div className="text-right">
                            <Badge variant={new Date() > new Date(asg.dueDate) ? 'error' : 'purple'} className="text-[10px]">
                              Due {new Date(asg.dueDate).toLocaleDateString()}
                            </Badge>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Upcoming Exam Schedules */}
              <Card className="border-gray-800 bg-gray-900/50">
                <CardHeader className="pb-3 flex flex-row items-center justify-between">
                  <CardTitle className="text-sm text-white flex items-center gap-2">
                    <Award className="h-4 w-4 text-amber-400" /> Upcoming Exam Schedules
                  </CardTitle>
                  <Button size="sm" variant="ghost" onClick={() => navigate('/results')} className="text-xs text-purple-400 hover:text-purple-300">
                    Results <ArrowRight className="h-3 w-3 ml-1" />
                  </Button>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y divide-gray-800 text-xs">
                    {!studentData?.upcomingExams || studentData.upcomingExams.length === 0 ? (
                      <p className="p-6 text-center text-gray-500">No upcoming exams scheduled at this time.</p>
                    ) : (
                      studentData.upcomingExams.map((sch: any) => (
                        <div key={sch.id} className="p-3.5 flex items-center justify-between hover:bg-gray-800/30 transition-colors">
                          <div className="space-y-0.5">
                            <p className="font-bold text-white">{sch.subject?.name}</p>
                            <p className="text-[11px] text-gray-400 font-mono">
                              {sch.exam?.title} • Full: {sch.fullMarks} / Pass: {sch.passMarks}
                            </p>
                          </div>
                          <div className="text-right">
                            <Badge variant="info" className="text-[10px] font-mono">
                              {sch.examDate ? new Date(sch.examDate).toLocaleDateString() : 'Scheduled'}
                            </Badge>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* School Broadcast Notices */}
            {studentData?.announcements && studentData.announcements.length > 0 && (
              <Card className="border-gray-800 bg-gray-900/50">
                <CardHeader className="pb-3 flex flex-row items-center justify-between">
                  <CardTitle className="text-sm text-white flex items-center gap-2">
                    <Megaphone className="h-4 w-4 text-purple-400" /> Recent Institutional Notices
                  </CardTitle>
                  <Button size="sm" variant="ghost" onClick={() => navigate('/announcements')} className="text-xs text-purple-400 hover:text-purple-300">
                    Announcements <ArrowRight className="h-3 w-3 ml-1" />
                  </Button>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y divide-gray-800 text-xs">
                    {studentData.announcements.map((anc: any) => (
                      <div key={anc.id} className="p-3.5 flex items-start justify-between gap-4 hover:bg-gray-800/30 transition-colors">
                        <div>
                          <p className="font-bold text-white">{anc.title}</p>
                          <p className="text-gray-400 line-clamp-1 mt-0.5 text-[11px]">{anc.description}</p>
                        </div>
                        <Badge variant="purple" className="text-[10px] shrink-0 font-mono">
                          {new Date(anc.publishDate).toLocaleDateString()}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* 6. PARENT DASHBOARD VIEW */}
        {user.role === 'PARENT' && (
          <div className="space-y-6">
            {/* Child Selector Tabs (if multiple children exist or single child header) */}
            {childrenList.length > 0 && (
              <div className="p-4 rounded-2xl bg-gray-900/70 border border-gray-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center font-bold text-white shadow-lg shadow-purple-500/20 text-lg">
                    {activeChild?.firstName?.charAt(0) || 'C'}
                    {activeChild?.lastName?.charAt(0) || 'S'}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-white">
                        {activeChild?.firstName} {activeChild?.lastName}
                      </h3>
                      <Badge variant="purple" className="text-[10px] font-mono">
                        {activeChild?.studentId || 'STU-2026-001'}
                      </Badge>
                      <Badge variant="success" className="text-[10px]">
                        {activeChild?.status || 'ACTIVE'}
                      </Badge>
                    </div>
                    <p className="text-[11px] text-gray-400 font-mono mt-0.5">
                      Class: <span className="text-purple-300 font-semibold">{activeChild?.class?.name || 'Grade 8'}</span> •
                      Section: <span className="text-sky-300 font-semibold">{activeChild?.section?.name || 'A'}</span> •
                      Roll: <span className="text-emerald-300 font-semibold">{activeChild?.rollNumber || '01'}</span>
                    </p>
                  </div>
                </div>

                {/* Child Switcher Tabs if > 1 child */}
                {childrenList.length > 1 && (
                  <div className="flex items-center gap-2 bg-gray-950 p-1.5 rounded-xl border border-gray-800">
                    <span className="text-[11px] text-gray-400 px-2 font-medium">Select Child:</span>
                    {childrenList.map((ch: any, idx: number) => (
                      <button
                        key={ch.id}
                        type="button"
                        onClick={() => setSelectedChildIndex(idx)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                          selectedChildIndex === idx
                            ? 'bg-purple-600 text-white shadow-md'
                            : 'text-gray-400 hover:text-white hover:bg-gray-800/40'
                        }`}
                      >
                        {ch.firstName}
                      </button>
                    ))}
                  </div>
                )}

                {/* Parent Quick Shortcuts */}
                <div className="flex flex-wrap items-center gap-2">
                  <Button size="sm" onClick={() => navigate('/attendance')} className="gap-1.5 text-xs bg-emerald-600 hover:bg-emerald-500">
                    <CalendarCheck className="h-3.5 w-3.5" /> Attendance
                  </Button>
                  <Button size="sm" onClick={() => navigate('/results')} className="gap-1.5 text-xs bg-purple-600 hover:bg-purple-500">
                    <Award className="h-3.5 w-3.5" /> Exam Routine & Marks
                  </Button>
                  <Button size="sm" onClick={() => navigate('/finance')} className="gap-1.5 text-xs bg-amber-600 hover:bg-amber-500">
                    <DollarSign className="h-3.5 w-3.5" /> Fees & Invoices
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => navigate('/teachers')} className="gap-1.5 text-xs">
                    <Users className="h-3.5 w-3.5 text-sky-400" /> All Teachers
                  </Button>
                </div>
              </div>
            )}

            {/* 4 KPI Cards for the Active Child */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Attendance Rate */}
              <Card className="border-gray-800 bg-gray-900/60">
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-400 font-medium">Attendance Standing</p>
                    <h3 className="text-2xl font-extrabold text-emerald-400 mt-1 font-mono">
                      {activeChild?.attendance?.percentage ?? 95}%
                    </h3>
                    <span className="text-[10px] text-emerald-400 font-medium flex items-center gap-1 mt-0.5">
                      <CheckCircle2 className="h-3 w-3" /> In Good Standing
                    </span>
                  </div>
                  <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <CalendarCheck className="h-6 w-6" />
                  </div>
                </CardContent>
              </Card>

              {/* Upcoming Exams */}
              <Card className="border-gray-800 bg-gray-900/60">
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-400 font-medium">Upcoming Exams</p>
                    <h3 className="text-2xl font-extrabold text-amber-400 mt-1 font-mono">
                      {activeChild?.academic?.upcomingExams?.length || 0} Papers
                    </h3>
                    <span className="text-[10px] text-gray-400 font-mono block mt-0.5">
                      Next: {activeChild?.academic?.upcomingExams?.[0]?.subject?.name || 'Scheduled'}
                    </span>
                  </div>
                  <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    <Award className="h-6 w-6" />
                  </div>
                </CardContent>
              </Card>

              {/* Pending Dues */}
              <Card className="border-gray-800 bg-gray-900/60">
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-400 font-medium">Outstanding Dues</p>
                    <h3 className="text-2xl font-extrabold text-rose-400 mt-1 font-mono">
                      ${activeChild?.finance?.pendingDue ?? 100}
                    </h3>
                    <span className="text-[10px] text-gray-400 font-mono block mt-0.5">
                      Paid: ${activeChild?.finance?.totalPaid ?? 450}
                    </span>
                  </div>
                  <div className="p-3 rounded-2xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
                    <DollarSign className="h-6 w-6" />
                  </div>
                </CardContent>
              </Card>

              {/* Cumulative GPA */}
              <Card className="border-gray-800 bg-gray-900/60">
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-400 font-medium">Academic Performance</p>
                    <h3 className="text-2xl font-extrabold text-purple-400 mt-1 font-mono">
                      {activeChild?.academic?.gpa?.toFixed(2) ?? '4.25'} / 5.0
                    </h3>
                    <span className="text-[10px] text-purple-300 font-medium block mt-0.5">
                      {activeChild?.academic?.marks?.length || 3} Subjects Graded
                    </span>
                  </div>
                  <div className="p-3 rounded-2xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                    <GraduationCap className="h-6 w-6" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* TEACHER CONTACT DIRECTORY (Highlighting Child's Teachers with Phone & Email) */}
            <Card className="border-gray-800 bg-gradient-to-br from-gray-900/90 via-purple-950/20 to-gray-900/90 border-purple-500/20">
              <CardHeader className="pb-3 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-base text-white flex items-center gap-2">
                    <Phone className="h-4 w-4 text-emerald-400" /> My Child's Teachers & Contact Directory
                  </CardTitle>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Direct phone numbers and email addresses of educators teaching {activeChild?.firstName || 'your child'}. Reach out during consultation hours for academic inquiries.
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => navigate('/teachers')}
                  className="text-xs text-purple-400 hover:text-purple-300 shrink-0"
                >
                  Full Faculty Directory <ArrowRight className="h-3 w-3 ml-1" />
                </Button>
              </CardHeader>
              <CardContent>
                {(!activeChild?.teachers || activeChild.teachers.length === 0) ? (
                  <p className="p-4 text-center text-gray-500 text-xs">No assigned teachers found for this section.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {activeChild.teachers.map((tch: any) => (
                      <div
                        key={tch.id}
                        className="p-4 rounded-2xl bg-gray-950/80 border border-gray-800 hover:border-purple-500/40 transition-all flex flex-col justify-between space-y-3"
                      >
                        <div className="space-y-2">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <div className="flex items-center gap-1.5">
                                <h4 className="font-bold text-white text-sm">{tch.name}</h4>
                                {tch.isClassTeacher && (
                                  <Badge variant="purple" className="text-[9px] px-1.5 py-0.2">
                                    Class Educator
                                  </Badge>
                                )}
                              </div>
                              <p className="text-xs text-purple-300 font-medium mt-0.5">
                                {tch.subject || 'Subject Educator'}
                              </p>
                            </div>
                            <span className="text-[10px] font-mono text-gray-500 px-1.5 py-0.5 rounded bg-gray-900 border border-gray-800">
                              {tch.employeeId || 'TCH'}
                            </span>
                          </div>

                          <p className="text-[11px] text-gray-400 line-clamp-1">
                            {tch.qualification} • {tch.specialization}
                          </p>
                        </div>

                        {/* Contact Information & Action Buttons */}
                        <div className="pt-3 border-t border-gray-800/80 space-y-2">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-400 flex items-center gap-1 text-[11px]">
                              <Phone className="h-3 w-3 text-emerald-400" /> Phone:
                            </span>
                            <a
                              href={`tel:${tch.phone || '+15550199182'}`}
                              className="font-mono text-emerald-400 hover:underline font-bold text-[11px]"
                              title="Click to Call"
                            >
                              {tch.phone || '+1 (555) 019-9182'}
                            </a>
                          </div>

                          <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-400 flex items-center gap-1 text-[11px]">
                              <Mail className="h-3 w-3 text-blue-400" /> Email:
                            </span>
                            <a
                              href={`mailto:${tch.email}?subject=Regarding%20${encodeURIComponent(activeChild?.firstName + ' ' + activeChild?.lastName)}`}
                              className="font-mono text-blue-300 hover:underline text-[11px] truncate max-w-[170px]"
                              title="Click to Email"
                            >
                              {tch.email}
                            </a>
                          </div>

                          <div className="grid grid-cols-2 gap-2 pt-1">
                            <a
                              href={`tel:${tch.phone || '+15550199182'}`}
                              className="px-2.5 py-1.5 rounded-xl bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-900/50 text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-all text-center"
                            >
                              <Phone className="h-3 w-3" /> Call Teacher
                            </a>
                            <a
                              href={`mailto:${tch.email}?subject=Inquiry%20Regarding%20${encodeURIComponent(activeChild?.firstName + ' ' + activeChild?.lastName)}`}
                              className="px-2.5 py-1.5 rounded-xl bg-purple-950/60 border border-purple-500/30 text-purple-300 hover:bg-purple-900/50 text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-all text-center"
                            >
                              <Mail className="h-3 w-3" /> Send Email
                            </a>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Exam Routine & Live Attendance Log (2-Column Grid) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Upcoming Examination Routine */}
              <Card className="border-gray-800 bg-gray-900/50">
                <CardHeader className="pb-3 flex flex-row items-center justify-between">
                  <CardTitle className="text-sm text-white flex items-center gap-2">
                    <Award className="h-4 w-4 text-amber-400" /> Upcoming Examination Routine
                  </CardTitle>
                  <Button size="sm" variant="ghost" onClick={() => navigate('/results')} className="text-xs text-purple-400 hover:text-purple-300">
                    Results & Routine <ArrowRight className="h-3 w-3 ml-1" />
                  </Button>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y divide-gray-800 text-xs">
                    {(!activeChild?.academic?.upcomingExams || activeChild.academic.upcomingExams.length === 0) ? (
                      <p className="p-6 text-center text-gray-500">No upcoming exam routine scheduled for this class.</p>
                    ) : (
                      activeChild.academic.upcomingExams.map((sch: any) => (
                        <div key={sch.id} className="p-3.5 flex items-center justify-between hover:bg-gray-800/30 transition-colors">
                          <div className="space-y-0.5">
                            <p className="font-bold text-white">{sch.subject?.name}</p>
                            <p className="text-[11px] text-gray-400 font-mono">
                              {sch.exam?.title || 'First Term Examination'} • Full: {sch.fullMarks} / Pass: {sch.passMarks}
                            </p>
                          </div>
                          <div className="text-right">
                            <Badge variant="info" className="text-[10px] font-mono">
                              {sch.examDate ? new Date(sch.examDate).toLocaleDateString() : 'Scheduled'}
                            </Badge>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Daily Attendance Session Log */}
              <Card className="border-gray-800 bg-gray-900/50">
                <CardHeader className="pb-3 flex flex-row items-center justify-between">
                  <CardTitle className="text-sm text-white flex items-center gap-2">
                    <CalendarCheck className="h-4 w-4 text-emerald-400" /> Recent Attendance Session Log
                  </CardTitle>
                  <Button size="sm" variant="ghost" onClick={() => navigate('/attendance')} className="text-xs text-purple-400 hover:text-purple-300">
                    Full Log <ArrowRight className="h-3 w-3 ml-1" />
                  </Button>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y divide-gray-800 text-xs">
                    {(!activeChild?.attendance?.recentRecords || activeChild.attendance.recentRecords.length === 0) ? (
                      <p className="p-6 text-center text-gray-500">No attendance session logs recorded yet.</p>
                    ) : (
                      activeChild.attendance.recentRecords.map((rec: any) => (
                        <div key={rec.id} className="p-3 flex items-center justify-between hover:bg-gray-800/30 transition-colors">
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-bold text-white">
                                {new Date(rec.date).toLocaleDateString()}
                              </span>
                              <Badge
                                variant={
                                  rec.status === 'PRESENT'
                                    ? 'success'
                                    : rec.status === 'ABSENT'
                                    ? 'error'
                                    : 'warning'
                                }
                                className="text-[9px]"
                              >
                                {rec.status}
                              </Badge>
                            </div>
                            <p className="text-[11px] text-gray-400 italic">
                              {rec.remarks || 'Regular daily class session recorded'}
                            </p>
                          </div>
                          <span className="text-[10px] text-gray-500 font-mono">{rec.session || 'DAILY'}</span>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Financial Invoices & Notices (2-Column Grid) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Child Fee Invoices */}
              <Card className="border-gray-800 bg-gray-900/50">
                <CardHeader className="pb-3 flex flex-row items-center justify-between">
                  <CardTitle className="text-sm text-white flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-emerald-400" /> Fee Invoices & Payments
                  </CardTitle>
                  <Button size="sm" variant="ghost" onClick={() => navigate('/finance')} className="text-xs text-purple-400 hover:text-purple-300">
                    Finance Portal <ArrowRight className="h-3 w-3 ml-1" />
                  </Button>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y divide-gray-800 text-xs">
                    {(!activeChild?.finance?.invoices || activeChild.finance.invoices.length === 0) ? (
                      <p className="p-6 text-center text-gray-500">No invoices issued for this student account.</p>
                    ) : (
                      activeChild.finance.invoices.map((inv: any) => (
                        <div key={inv.id} className="p-3.5 flex items-center justify-between hover:bg-gray-800/30 transition-colors">
                          <div>
                            <p className="font-bold text-white">{inv.title}</p>
                            <p className="text-[11px] text-gray-400 font-mono">
                              Invoice: {inv.invoiceNumber} • Total: ${inv.totalAmount} (Paid: ${inv.paidAmount})
                            </p>
                          </div>
                          <div className="text-right flex items-center gap-2">
                            <Badge
                              variant={
                                inv.status === 'PAID'
                                  ? 'success'
                                  : inv.status === 'PARTIALLY_PAID'
                                  ? 'warning'
                                  : 'error'
                              }
                              className="text-[10px]"
                            >
                              {inv.status}
                            </Badge>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => navigate('/finance')}
                              className="h-6 px-2 text-[10px]"
                            >
                              Pay / View
                            </Button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Institutional Announcements for Parents */}
              <Card className="border-gray-800 bg-gray-900/50">
                <CardHeader className="pb-3 flex flex-row items-center justify-between">
                  <CardTitle className="text-sm text-white flex items-center gap-2">
                    <Megaphone className="h-4 w-4 text-purple-400" /> School Circulars & Parent Notices
                  </CardTitle>
                  <Button size="sm" variant="ghost" onClick={() => navigate('/announcements')} className="text-xs text-purple-400 hover:text-purple-300">
                    All Notices <ArrowRight className="h-3 w-3 ml-1" />
                  </Button>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y divide-gray-800 text-xs">
                    {(!parentData?.announcements || parentData.announcements.length === 0) ? (
                      <p className="p-6 text-center text-gray-500">No active circulars at this moment.</p>
                    ) : (
                      parentData.announcements.map((anc: any) => (
                        <div key={anc.id} className="p-3.5 flex items-start justify-between gap-4 hover:bg-gray-800/30 transition-colors">
                          <div className="space-y-0.5">
                            <p className="font-bold text-white">{anc.title}</p>
                            <p className="text-gray-400 line-clamp-2 text-[11px] leading-relaxed">
                              {anc.description}
                            </p>
                          </div>
                          <Badge variant="purple" className="text-[10px] shrink-0 font-mono">
                            {new Date(anc.publishDate).toLocaleDateString()}
                          </Badge>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
