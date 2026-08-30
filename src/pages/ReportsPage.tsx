import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Sidebar } from '../components/layout/Sidebar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { useAuth } from '../context/AuthContext';
import { reportService } from '../services/report.service';
import { apiClient as api } from '../lib/axios';
import {
  BarChart3,
  Users,
  Calendar,
  DollarSign,
  GraduationCap,
  Download,
  Printer,
  AlertTriangle,
  Award,
  TrendingUp,
} from 'lucide-react';

export const ReportsPage: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'STUDENT' | 'ATTENDANCE' | 'FINANCE' | 'ACADEMIC'>('STUDENT');
  const [selectedClassId, setSelectedClassId] = useState<string>('');

  // Queries
  const { data: classes = [] } = useQuery({
    queryKey: ['reportClasses'],
    queryFn: async () => {
      const res = await api.get('/v1/structure/classes');
      return res.data.data;
    },
  });

  const { data: studentReport } = useQuery({
    queryKey: ['reportStudent', selectedClassId],
    queryFn: () => reportService.getStudentReport({ classId: selectedClassId || undefined }),
    enabled: activeTab === 'STUDENT',
  });

  const { data: attendanceReport, isLoading: isLoadingAttendance } = useQuery({
    queryKey: ['reportAttendance', selectedClassId],
    queryFn: () => reportService.getAttendanceReport({ classId: selectedClassId || undefined }),
    enabled: activeTab === 'ATTENDANCE',
  });

  const { data: financeReport, isLoading: isLoadingFinance } = useQuery({
    queryKey: ['reportFinance'],
    queryFn: () => reportService.getFinanceReport(),
    enabled: activeTab === 'FINANCE',
  });

  const { data: academicReport, isLoading: isLoadingAcademic } = useQuery({
    queryKey: ['reportAcademic', selectedClassId],
    queryFn: () => reportService.getAcademicReport({ classId: selectedClassId || undefined }),
    enabled: activeTab === 'ACADEMIC',
  });

  // Handle CSV Export
  const handleExportCSV = () => {
    if (activeTab === 'STUDENT' && studentReport) {
      const headers = ['Student ID', 'First Name', 'Last Name', 'Class', 'Section', 'Roll', 'Status'];
      const rows = studentReport.students.map((s: any) => [
        s.studentId,
        s.firstName,
        s.lastName,
        s.class?.name || '',
        s.section?.name || '',
        s.rollNumber,
        s.status,
      ]);
      reportService.exportCSV('Student_Report', headers, rows);
    } else if (activeTab === 'ATTENDANCE' && attendanceReport) {
      const headers = ['Student ID', 'Name', 'Class', 'Section', 'Total Sessions', 'Present Count', 'Attendance %'];
      const rows = attendanceReport.lowAttendanceStudents.map((s: any) => [
        s.studentId,
        s.name,
        s.className,
        s.sectionName,
        s.totalSessions,
        s.presentCount,
        `${s.percentage}%`,
      ]);
      reportService.exportCSV('Low_Attendance_Report', headers, rows);
    } else if (activeTab === 'FINANCE' && financeReport) {
      const headers = ['Receipt No', 'Student', 'Amount', 'Date', 'Method'];
      const rows = financeReport.recentPayments.map((p: any) => [
        p.receiptNumber,
        `${p.invoice?.student?.firstName} ${p.invoice?.student?.lastName}`,
        p.amount,
        new Date(p.paymentDate).toLocaleDateString(),
        p.paymentMethod,
      ]);
      reportService.exportCSV('Finance_Collection_Report', headers, rows);
    } else if (activeTab === 'ACADEMIC' && academicReport) {
      const headers = ['Student', 'Exam', 'Class', 'Subject', 'Total Marks', 'GPA', 'Grade', 'Status'];
      const rows = academicReport.topPerformers.map((m: any) => [
        `${m.student?.firstName} ${m.student?.lastName}`,
        m.exam?.title || '',
        m.class?.name || '',
        m.subject?.name || '',
        m.totalMarks,
        m.gpa,
        m.grade,
        m.isPassed ? 'PASSED' : 'FAILED',
      ]);
      reportService.exportCSV('Academic_Performance_Report', headers, rows);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 print:block">
      <div className="print:hidden">
        <Sidebar />
      </div>

      <div className="flex-1 space-y-6">
        {/* Banner */}
        <div className="glass-panel p-6 rounded-3xl border border-indigo-500/20 bg-gradient-to-r from-indigo-950/40 via-gray-900/60 to-purple-950/40 print:border-none print:bg-none print:p-0">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <Badge variant="purple" className="mb-2 gap-1.5 font-mono print:hidden">
                <BarChart3 className="h-3.5 w-3.5 text-indigo-400" /> Phase 16 Reports Center
              </Badge>
              <h2 className="text-2xl font-extrabold text-white print:text-black">Centralized Analytics & Reporting Center</h2>
              <p className="text-xs text-gray-400 print:text-gray-600 mt-1">
                Generate, analyze, and export comprehensive school performance, financial, attendance, and student reports.
              </p>
            </div>

            <div className="flex items-center gap-2 print:hidden">
              <Button size="sm" variant="outline" onClick={handleExportCSV} className="gap-1.5 text-xs text-emerald-300 border-emerald-500/30">
                <Download className="h-4 w-4 text-emerald-400" /> Export CSV
              </Button>
              <Button size="sm" onClick={handlePrint} className="gap-1.5 text-xs bg-indigo-600 hover:bg-indigo-500">
                <Printer className="h-4 w-4" /> Print / PDF
              </Button>
            </div>
          </div>
        </div>

        {/* Filters & Tabs Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-800 pb-3 print:hidden">
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant={activeTab === 'STUDENT' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('STUDENT')}
              className="gap-1.5 text-xs"
            >
              <Users className="h-4 w-4 text-blue-400" /> Student Reports
            </Button>

            <Button
              variant={activeTab === 'ATTENDANCE' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('ATTENDANCE')}
              className="gap-1.5 text-xs"
            >
              <Calendar className="h-4 w-4 text-emerald-400" /> Attendance
            </Button>

            {(user?.role === 'SUPER_ADMIN' || user?.role === 'FINANCE') && (
              <Button
                variant={activeTab === 'FINANCE' ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setActiveTab('FINANCE')}
                className="gap-1.5 text-xs"
              >
                <DollarSign className="h-4 w-4 text-amber-400" /> Finance
              </Button>
            )}

            <Button
              variant={activeTab === 'ACADEMIC' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('ACADEMIC')}
              className="gap-1.5 text-xs"
            >
              <GraduationCap className="h-4 w-4 text-purple-400" /> Academic
            </Button>
          </div>

          {(activeTab === 'STUDENT' || activeTab === 'ATTENDANCE' || activeTab === 'ACADEMIC') && (
            <select
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-gray-950 border border-gray-800 text-xs text-white"
            >
              <option value="">All Classes</option>
              {(classes as any[]).map((c: any) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* TAB 1: STUDENT REPORTS */}
        {activeTab === 'STUDENT' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Card className="border-gray-800 bg-gray-900/50">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-400">
                    <Users className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Total Enrolled</p>
                    <h4 className="text-xl font-bold text-white">{studentReport?.totalStudents || 0}</h4>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-gray-800 bg-gray-900/50">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400">
                    <TrendingUp className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Active Students</p>
                    <h4 className="text-xl font-bold text-white">
                      {studentReport?.statusCounts?.find((s: any) => s.status === 'ACTIVE')?._count?.id || 0}
                    </h4>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-gray-800 bg-gray-900/50">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="p-3 rounded-2xl bg-purple-500/10 text-purple-400">
                    <BarChart3 className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Active Classes</p>
                    <h4 className="text-xl font-bold text-white">{studentReport?.classDistribution?.length || 0}</h4>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="border-gray-800 bg-gray-900/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-white">Class Wise Distribution Summary</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-gray-300">
                    <thead className="bg-gray-950/60 text-gray-400 uppercase font-mono text-[10px] border-b border-gray-800">
                      <tr>
                        <th className="p-3">Class Name</th>
                        <th className="p-3">Enrolled Count</th>
                        <th className="p-3">Percentage Share</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                      {studentReport?.classDistribution?.map((c: any) => {
                        const count = c._count.students;
                        const pct = studentReport.totalStudents > 0 ? Math.round((count / studentReport.totalStudents) * 100) : 0;
                        return (
                          <tr key={c.id}>
                            <td className="p-3 font-medium text-white">{c.name}</td>
                            <td className="p-3 font-mono text-blue-400">{count} students</td>
                            <td className="p-3 font-mono">{pct}%</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* TAB 2: ATTENDANCE REPORTS */}
        {activeTab === 'ATTENDANCE' && (
          <div className="space-y-6">
            <Card className="border-rose-500/20 bg-rose-950/10">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-rose-400" />
                  <CardTitle className="text-sm text-rose-200">Low Attendance Students Alert (&lt; 75%)</CardTitle>
                </div>
                <CardDescription className="text-xs text-rose-300/70">
                  Students below required attendance threshold requiring administrative notification.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-gray-300">
                    <thead className="bg-rose-950/40 text-rose-300 uppercase font-mono text-[10px] border-b border-rose-900/50">
                      <tr>
                        <th className="p-3">Student Name</th>
                        <th className="p-3">Class & Section</th>
                        <th className="p-3">Attended Sessions</th>
                        <th className="p-3">Attendance %</th>
                        <th className="p-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-rose-900/30">
                      {isLoadingAttendance ? (
                        <tr>
                          <td colSpan={5} className="p-8 text-center text-gray-400">
                            Loading attendance records...
                          </td>
                        </tr>
                      ) : attendanceReport?.lowAttendanceStudents?.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="p-8 text-center text-emerald-400">
                            No students below 75% attendance threshold. Excellent attendance!
                          </td>
                        </tr>
                      ) : (
                        attendanceReport?.lowAttendanceStudents?.map((s: any) => (
                          <tr key={s.id}>
                            <td className="p-3 font-medium text-white">
                              {s.name} <span className="text-[10px] text-gray-400 font-mono">({s.studentId})</span>
                            </td>
                            <td className="p-3">{s.className} - {s.sectionName}</td>
                            <td className="p-3 font-mono">{s.presentCount} / {s.totalSessions}</td>
                            <td className="p-3 font-mono font-bold text-rose-400">{s.percentage}%</td>
                            <td className="p-3">
                              <Badge variant="error" className="text-[10px]">CRITICAL</Badge>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* TAB 3: FINANCE REPORTS */}
        {activeTab === 'FINANCE' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Card className="border-gray-800 bg-gray-900/50">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-400">
                    <DollarSign className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Total Fee Collections</p>
                    <h4 className="text-2xl font-black text-amber-400">৳{financeReport?.totalCollected?.toLocaleString() || 0}</h4>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-gray-800 bg-gray-900/50">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400">
                    <TrendingUp className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Payments Recorded</p>
                    <h4 className="text-xl font-bold text-white">{financeReport?.recentPayments?.length || 0} transactions</h4>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="border-gray-800 bg-gray-900/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-white">Recent Payment Transactions Log</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-gray-300">
                    <thead className="bg-gray-950/60 text-gray-400 uppercase font-mono text-[10px] border-b border-gray-800">
                      <tr>
                        <th className="p-3">Receipt No</th>
                        <th className="p-3">Student Borrower</th>
                        <th className="p-3">Amount</th>
                        <th className="p-3">Method</th>
                        <th className="p-3">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                      {isLoadingFinance ? (
                        <tr>
                          <td colSpan={5} className="p-8 text-center text-gray-400">
                            Loading finance report...
                          </td>
                        </tr>
                      ) : financeReport?.recentPayments?.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="p-8 text-center text-gray-400">
                            No payment records found.
                          </td>
                        </tr>
                      ) : (
                        financeReport?.recentPayments?.map((p: any) => (
                          <tr key={p.id}>
                            <td className="p-3 font-mono text-amber-400">{p.receiptNumber}</td>
                            <td className="p-3 font-medium text-white">
                              {p.invoice?.student?.firstName} {p.invoice?.student?.lastName}
                            </td>
                            <td className="p-3 font-mono font-bold text-white">৳{p.amount?.toLocaleString()}</td>
                            <td className="p-3"><Badge variant="info" className="text-[10px]">{p.paymentMethod}</Badge></td>
                            <td className="p-3 font-mono">{new Date(p.paymentDate).toLocaleDateString()}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* TAB 4: ACADEMIC REPORTS */}
        {activeTab === 'ACADEMIC' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Card className="border-gray-800 bg-gray-900/50">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="p-3 rounded-2xl bg-purple-500/10 text-purple-400">
                    <GraduationCap className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Average Class GPA</p>
                    <h4 className="text-2xl font-black text-purple-400">{academicReport?.averageGpa || 0.0} / 5.0</h4>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-gray-800 bg-gray-900/50">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400">
                    <Award className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Overall Pass Rate</p>
                    <h4 className="text-2xl font-black text-emerald-400">{academicReport?.passPercentage || 0}%</h4>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-gray-800 bg-gray-900/50">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-400">
                    <Users className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Passed / Total Entries</p>
                    <h4 className="text-xl font-bold text-white">
                      {academicReport?.passedCount || 0} / {academicReport?.totalEntries || 0}
                    </h4>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="border-gray-800 bg-gray-900/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-white">Academic Performance Top Leaderboard</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-gray-300">
                    <thead className="bg-gray-950/60 text-gray-400 uppercase font-mono text-[10px] border-b border-gray-800">
                      <tr>
                        <th className="p-3">Student Name</th>
                        <th className="p-3">Exam Term</th>
                        <th className="p-3">Class</th>
                        <th className="p-3">Subject</th>
                        <th className="p-3">GPA</th>
                        <th className="p-3">Grade</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                      {isLoadingAcademic ? (
                        <tr>
                          <td colSpan={6} className="p-8 text-center text-gray-400">
                            Loading academic performance report...
                          </td>
                        </tr>
                      ) : academicReport?.topPerformers?.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="p-8 text-center text-gray-400">
                            No mark entries recorded yet.
                          </td>
                        </tr>
                      ) : (
                        academicReport?.topPerformers?.map((m: any) => (
                          <tr key={m.id}>
                            <td className="p-3 font-medium text-white">
                              {m.student?.firstName} {m.student?.lastName}
                            </td>
                            <td className="p-3 font-mono">{m.exam?.title}</td>
                            <td className="p-3">{m.class?.name}</td>
                            <td className="p-3 text-purple-300 font-mono">{m.subject?.name}</td>
                            <td className="p-3 font-mono font-bold text-emerald-400">{m.gpa}</td>
                            <td className="p-3"><Badge variant="purple" className="text-[10px]">{m.grade}</Badge></td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};
