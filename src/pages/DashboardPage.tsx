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
  ShieldCheck,
  FileText,
  Megaphone,
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
            <div className="flex items-center gap-3">
              <Button size="sm" onClick={() => navigate('/attendance')} className="gap-1.5 text-xs bg-emerald-600 hover:bg-emerald-500">
                <ClipboardList className="h-4 w-4" /> Take Class Attendance
              </Button>
              <Button size="sm" onClick={() => navigate('/exams')} className="gap-1.5 text-xs bg-purple-600 hover:bg-purple-500">
                <Award className="h-4 w-4" /> Enter Marks
              </Button>
              <Button size="sm" variant="outline" onClick={() => navigate('/assignments')} className="gap-1.5 text-xs">
                <Plus className="h-4 w-4" /> Create Homework
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
        {user.role === 'STUDENT' && studentData && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <Card className="border-gray-800 bg-gray-900/50">
                <CardContent className="p-4 text-center">
                  <p className="text-xs text-gray-400">Attendance Rate</p>
                  <h3 className="text-2xl font-bold text-emerald-400 mt-1 font-mono">{studentData.attendancePercentage}%</h3>
                </CardContent>
              </Card>

              <Card className="border-gray-800 bg-gray-900/50">
                <CardContent className="p-4 text-center">
                  <p className="text-xs text-gray-400">Cumulative GPA</p>
                  <h3 className="text-2xl font-bold text-purple-400 mt-1 font-mono">{studentData.gpa} / 5.0</h3>
                </CardContent>
              </Card>

              <Card className="border-gray-800 bg-gray-900/50">
                <CardContent className="p-4 text-center">
                  <p className="text-xs text-gray-400">Pending Homework</p>
                  <h3 className="text-2xl font-bold text-blue-400 mt-1 font-mono">{studentData.assignments?.length || 0}</h3>
                </CardContent>
              </Card>

              <Card className="border-gray-800 bg-gray-900/50">
                <CardContent className="p-4 text-center">
                  <p className="text-xs text-gray-400">Invoices</p>
                  <h3 className="text-2xl font-bold text-amber-400 mt-1 font-mono">{studentData.invoices?.length || 0}</h3>
                </CardContent>
              </Card>
            </div>
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
