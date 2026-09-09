import React from 'react';
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
        {user.role === 'PARENT' && parentData && (
          <div className="space-y-6">
            <Card className="border-gray-800 bg-gray-900/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-white flex items-center gap-2">
                  <HeartHandshake className="h-4 w-4 text-purple-400" /> Linked Children Profiles
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-gray-800 text-xs">
                  {parentData.children?.length === 0 ? (
                    <p className="p-4 text-center text-gray-500">No linked student profiles.</p>
                  ) : (
                    parentData.children?.map((child: any) => (
                      <div key={child.id} className="p-4 flex items-center justify-between">
                        <div>
                          <p className="font-bold text-white">{child.firstName} {child.lastName}</p>
                          <p className="text-[11px] text-purple-400 font-mono">ID: {child.studentId} • Class {child.class?.name} ({child.section?.name})</p>
                        </div>
                        <Badge variant="purple" className="text-[10px] font-mono">Active Student</Badge>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};
