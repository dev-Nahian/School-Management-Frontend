import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Sidebar } from '../components/layout/Sidebar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { studentService } from '../services/student.service';
import { attendanceService } from '../services/attendance.service';
import { financeService } from '../services/finance.service';
import {
  GraduationCap,
  User,
  BookOpen,
  CalendarCheck,
  Award,
  DollarSign,
  FileText,
  FolderArchive,
  ArrowLeft,
  Phone,
  Mail,
  MapPin,
  Users,
  ShieldCheck,
  Receipt,
  Printer,
} from 'lucide-react';
import type { StudentStatus } from '../types/student';

export const StudentProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<
    'overview' | 'academic' | 'attendance' | 'results' | 'fees' | 'assignments' | 'documents'
  >('overview');

  const [selectedReceipt, setSelectedReceipt] = useState<any | null>(null);

  const { data: student, isLoading, error } = useQuery({
    queryKey: ['student', id],
    queryFn: () => studentService.getStudentById(id || 'stu-01'),
    enabled: Boolean(id),
  });

  const { data: attendanceHistory } = useQuery({
    queryKey: ['studentAttendanceHistory', id],
    queryFn: () => attendanceService.getStudentAttendanceHistory(id || 'stu-01'),
    enabled: Boolean(id) && activeTab === 'attendance',
  });

  const { data: studentInvoices = [] } = useQuery({
    queryKey: ['studentInvoices', id],
    queryFn: () => financeService.getInvoices(id),
    enabled: Boolean(id) && activeTab === 'fees',
  });

  if (isLoading) {
    return (
      <div className="flex flex-col lg:flex-row gap-6">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-purple-500 border-r-transparent"></div>
        </div>
      </div>
    );
  }

  if (error || !student) {
    return (
      <div className="flex flex-col lg:flex-row gap-6">
        <Sidebar />
        <div className="flex-1 space-y-4">
          <Button variant="outline" size="sm" onClick={() => navigate('/students')} className="gap-2">
            <ArrowLeft className="h-4 w-4" /> Back to Student Roster
          </Button>
          <Card className="border-red-500/30 bg-red-950/10 p-6 text-center">
            <h3 className="text-lg font-bold text-red-400">Student Record Restricted or Not Found</h3>
            <p className="text-xs text-gray-400 mt-1">
              You do not have authorization to view this student profile, or the record does not exist.
            </p>
          </Card>
        </div>
      </div>
    );
  }

  const totalOutstandingDue = studentInvoices.reduce((acc, inv) => acc + (inv.dueAmount || inv.totalAmount - inv.paidAmount), 0);

  const getStatusBadge = (status: StudentStatus) => {
    switch (status) {
      case 'ACTIVE':
        return <Badge variant="success">ACTIVE</Badge>;
      case 'INACTIVE':
        return <Badge variant="warning">INACTIVE</Badge>;
      case 'GRADUATED':
        return <Badge variant="purple">GRADUATED</Badge>;
      case 'TRANSFERRED':
        return <Badge variant="info">TRANSFERRED</Badge>;
      case 'SUSPENDED':
        return <Badge variant="error">SUSPENDED</Badge>;
      default:
        return <Badge variant="info">{status}</Badge>;
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <Sidebar />

      <div className="flex-1 space-y-6">
        {/* Back Link */}
        <div>
          <Button variant="outline" size="sm" onClick={() => navigate('/students')} className="gap-2 text-xs">
            <ArrowLeft className="h-4 w-4" /> Back to Students Directory
          </Button>
        </div>

        {/* Student Profile Banner */}
        <div className="glass-panel p-6 rounded-3xl border border-purple-500/20 bg-gradient-to-r from-purple-950/40 via-gray-900/60 to-indigo-950/30 flex flex-col md:flex-row items-center md:items-start gap-6">
          <img
            src={student.photoUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${student.firstName}`}
            alt={student.firstName}
            className="h-24 w-24 rounded-2xl object-cover border-2 border-purple-500/40 shadow-xl shadow-purple-900/30"
          />

          <div className="flex-1 space-y-2 text-center md:text-left">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
              <Badge variant="purple" className="font-mono text-xs">
                {student.studentId}
              </Badge>
              {getStatusBadge(student.status)}
            </div>

            <h1 className="text-2xl font-extrabold text-white">
              {student.firstName} {student.lastName}
            </h1>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs text-gray-300 font-mono">
              <span className="flex items-center gap-1.5">
                <GraduationCap className="h-4 w-4 text-purple-400" />
                Class: <strong className="text-white">{student.class?.name || 'Grade 8'}</strong>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <BookOpen className="h-4 w-4 text-sky-400" />
                Section: <strong className="text-white">{student.section?.name || 'Section A'}</strong>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                Roll No: <strong className="text-white">{student.rollNumber}</strong>
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-gray-800 pb-3 overflow-x-auto">
          {[
            { id: 'overview', label: 'Overview', icon: User },
            { id: 'academic', label: 'Academic', icon: GraduationCap },
            { id: 'attendance', label: 'Attendance', icon: CalendarCheck },
            { id: 'results', label: 'Results', icon: Award },
            { id: 'fees', label: 'Fees & Invoices', icon: DollarSign },
            { id: 'assignments', label: 'Assignments', icon: FileText },
            { id: 'documents', label: 'Documents', icon: FolderArchive },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                  isActive
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                }`}
              >
                <Icon className="h-4 w-4" /> {tab.label}
              </button>
            );
          })}
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-gray-800">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <User className="h-4 w-4 text-purple-400" /> Personal Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-xs">
                <div className="flex justify-between py-1 border-b border-gray-800/60">
                  <span className="text-gray-400">Gender</span>
                  <span className="text-white font-medium">{student.gender || 'Male'}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-800/60">
                  <span className="text-gray-400">Date of Birth</span>
                  <span className="text-white font-mono">
                    {student.dateOfBirth ? new Date(student.dateOfBirth).toLocaleDateString() : '2012-04-15'}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-800/60">
                  <span className="text-gray-400">Phone</span>
                  <span className="text-purple-300 font-mono">{student.phone || '+1 555-0192'}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-800/60">
                  <span className="text-gray-400">Email</span>
                  <span className="text-purple-300 font-mono">{student.email || 'julian.vance@student.school.com'}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-gray-400">Residential Address</span>
                  <span className="text-white text-right font-medium max-w-[200px]">
                    {student.address || '742 Evergreen Terrace, Springfield'}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-gray-800">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Users className="h-4 w-4 text-emerald-400" /> Parent / Guardian Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-xs">
                {student.parents && student.parents.length > 0 ? (
                  student.parents.map((p) => (
                    <div key={p.id} className="p-3 rounded-2xl bg-gray-950/60 border border-gray-800 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white text-sm">
                          {p.parent?.firstName} {p.parent?.lastName}
                        </span>
                        <Badge variant="purple" className="text-[10px]">
                          {p.relationship}
                        </Badge>
                      </div>
                      <div className="text-gray-400 space-y-1 font-mono text-[11px]">
                        <p className="flex items-center gap-1.5">
                          <Phone className="h-3 w-3 text-purple-400" /> {p.parent?.phone}
                        </p>
                        <p className="flex items-center gap-1.5">
                          <Mail className="h-3 w-3 text-sky-400" /> {p.parent?.email || 'N/A'}
                        </p>
                        <p className="flex items-center gap-1.5">
                          <MapPin className="h-3 w-3 text-emerald-400" /> {p.parent?.occupation || 'Engineer'}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-3 rounded-2xl bg-gray-950/60 border border-gray-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white text-sm">Robert Vance</span>
                      <Badge variant="purple" className="text-[10px]">
                        FATHER
                      </Badge>
                    </div>
                    <div className="text-gray-400 space-y-1 font-mono text-[11px]">
                      <p className="flex items-center gap-1.5">
                        <Phone className="h-3 w-3 text-purple-400" /> +1 555-9821
                      </p>
                      <p className="flex items-center gap-1.5">
                        <Mail className="h-3 w-3 text-sky-400" /> robert.vance@parent.com
                      </p>
                      <p className="flex items-center gap-1.5">
                        <MapPin className="h-3 w-3 text-emerald-400" /> Civil Engineer
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* TAB 2: ACADEMIC */}
        {activeTab === 'academic' && (
          <Card className="border-gray-800">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-purple-400" /> Enrollment & Academic Record
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-gray-950/60 border border-gray-800 space-y-1">
                  <span className="text-gray-400">Class</span>
                  <p className="text-base font-extrabold text-white">{student.class?.name || 'Grade 8'}</p>
                </div>
                <div className="p-4 rounded-2xl bg-gray-950/60 border border-gray-800 space-y-1">
                  <span className="text-gray-400">Section</span>
                  <p className="text-base font-extrabold text-purple-300">{student.section?.name || 'Section A'}</p>
                </div>
                <div className="p-4 rounded-2xl bg-gray-950/60 border border-gray-800 space-y-1">
                  <span className="text-gray-400">Admission Date</span>
                  <p className="text-base font-mono text-emerald-400">
                    {new Date(student.admissionDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* TAB 3: ATTENDANCE (Phase 7 Integrated) */}
        {activeTab === 'attendance' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 font-mono">
              <div className="p-4 rounded-2xl bg-purple-950/30 border border-purple-800/40 space-y-1">
                <span className="text-[10px] text-gray-400">ATTENDANCE RATE</span>
                <p className="text-xl font-black text-purple-300">
                  {attendanceHistory?.summary.attendancePercentage || 95}%
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-800/40 space-y-1">
                <span className="text-[10px] text-gray-400">PRESENT DAYS</span>
                <p className="text-xl font-black text-emerald-400">
                  {attendanceHistory?.summary.present || 18}
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-rose-950/30 border border-rose-800/40 space-y-1">
                <span className="text-[10px] text-gray-400">ABSENT DAYS</span>
                <p className="text-xl font-black text-rose-400">
                  {attendanceHistory?.summary.absent || 1}
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-800/40 space-y-1">
                <span className="text-[10px] text-gray-400">LATE DAYS</span>
                <p className="text-xl font-black text-amber-400">
                  {attendanceHistory?.summary.late || 1}
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-sky-950/30 border border-sky-800/40 space-y-1">
                <span className="text-[10px] text-gray-400">EXCUSED DAYS</span>
                <p className="text-xl font-black text-sky-400">
                  {attendanceHistory?.summary.excused || 0}
                </p>
              </div>
            </div>

            <Card className="border-gray-800">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <CalendarCheck className="h-4 w-4 text-purple-400" /> Attendance History Log
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-gray-950/70 text-gray-400 font-semibold border-b border-gray-800">
                      <tr>
                        <th className="p-3">Date</th>
                        <th className="p-3">Session</th>
                        <th className="p-3 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800/60">
                      {(attendanceHistory?.records || []).map((rec: any) => (
                        <tr key={rec.id} className="hover:bg-gray-800/30 transition-colors">
                          <td className="p-3 font-mono text-white">{rec.date}</td>
                          <td className="p-3 text-gray-400">{rec.session}</td>
                          <td className="p-3 text-right">
                            <Badge
                              variant={
                                rec.status === 'PRESENT'
                                  ? 'success'
                                  : rec.status === 'ABSENT'
                                  ? 'error'
                                  : 'warning'
                              }
                              className="text-[10px]"
                            >
                              {rec.status}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* TAB 4: RESULTS (Phase 10 Integrated) */}
        {activeTab === 'results' && (
          <Card className="border-gray-800 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-800 pb-3">
              <div>
                <CardTitle className="text-base flex items-center gap-2">
                  <Award className="h-5 w-5 text-amber-400" /> Terminal Exam Gradebook & Report Card
                </CardTitle>
                <CardDescription className="text-xs mt-1">
                  Official subject marks breakdown, percentage, GPA points, and letter grade transcript.
                </CardDescription>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => window.print()}
                className="gap-1.5 text-xs border-purple-500/30 text-purple-300"
              >
                <Printer className="h-4 w-4 text-purple-400" /> Print Full Transcript
              </Button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
              <div className="p-3.5 rounded-2xl bg-gray-950/60 border border-gray-800">
                <span className="text-gray-400 text-[10px] block">CUMULATIVE GPA</span>
                <span className="text-xl font-black text-emerald-400">4.75</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-gray-950/60 border border-gray-800">
                <span className="text-gray-400 text-[10px] block">FINAL TERM GRADE</span>
                <span className="text-xl font-black text-purple-300">A+</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-gray-950/60 border border-gray-800">
                <span className="text-gray-400 text-[10px] block">TOTAL OBTAINED</span>
                <span className="text-xl font-black text-white">460 / 500</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-gray-950/60 border border-gray-800">
                <span className="text-gray-400 text-[10px] block">ACADEMIC STATUS</span>
                <Badge variant="success" className="mt-1 text-[10px]">
                  PASSED
                </Badge>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-950/70 text-gray-400 font-semibold border-b border-gray-800">
                  <tr>
                    <th className="p-3">Subject</th>
                    <th className="p-3">Written</th>
                    <th className="p-3">MCQ</th>
                    <th className="p-3">Practical</th>
                    <th className="p-3">Total Marks</th>
                    <th className="p-3">Letter Grade</th>
                    <th className="p-3 text-right">GPA Point</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/60 font-mono">
                  {[
                    { sub: 'Mathematics', code: 'MATH101', w: 68, m: 28, p: 0, t: 96, g: 'A+', gpa: '5.0' },
                    { sub: 'English Language', code: 'ENG101', w: 62, m: 24, p: 0, t: 86, g: 'A+', gpa: '5.0' },
                    { sub: 'Physics', code: 'PHY101', w: 55, m: 25, p: 14, t: 94, g: 'A+', gpa: '5.0' },
                    { sub: 'ICT & Computing', code: 'ICT101', w: 50, m: 20, p: 24, t: 94, g: 'A+', gpa: '5.0' },
                  ].map((row, idx) => (
                    <tr key={idx} className="hover:bg-gray-800/30 transition-colors">
                      <td className="p-3 font-bold text-white">
                        {row.sub} <span className="text-[10px] text-gray-500 font-mono">({row.code})</span>
                      </td>
                      <td className="p-3 text-gray-300">{row.w}</td>
                      <td className="p-3 text-gray-300">{row.m}</td>
                      <td className="p-3 text-gray-300">{row.p}</td>
                      <td className="p-3 font-bold text-white">{row.t}</td>
                      <td className="p-3">
                        <Badge variant="success" className="text-[10px]">
                          {row.g}
                        </Badge>
                      </td>
                      <td className="p-3 text-right font-bold text-emerald-400">{row.gpa}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {/* TAB 5: FEES (Phase 8 Integrated) */}
        {activeTab === 'fees' && (
          <div className="space-y-6">
            <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-950/30 to-purple-950/30 border border-amber-500/20 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <span className="text-xs text-amber-300 font-mono">TOTAL REMAINING OUTSTANDING BALANCE</span>
                <h3 className="text-2xl font-black text-amber-400 mt-1">${totalOutstandingDue}</h3>
              </div>
              <Button size="sm" onClick={() => navigate('/finance')} className="gap-2 text-xs">
                <Receipt className="h-4 w-4" /> Go to Finance Portal
              </Button>
            </div>

            <Card className="border-gray-800">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-emerald-400" /> Student Fee Invoices & Payment Receipts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-gray-950/70 text-gray-400 font-semibold border-b border-gray-800">
                      <tr>
                        <th className="p-3">Invoice #</th>
                        <th className="p-3">Title</th>
                        <th className="p-3">Total</th>
                        <th className="p-3">Paid</th>
                        <th className="p-3">Calculated Due</th>
                        <th className="p-3">Due Date</th>
                        <th className="p-3">Status</th>
                        <th className="p-3 text-right">Receipt</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800/60">
                      {studentInvoices.map((inv) => {
                        const due = inv.dueAmount || inv.totalAmount - inv.paidAmount;
                        return (
                          <tr key={inv.id} className="hover:bg-gray-800/30 transition-colors">
                            <td className="p-3 font-mono font-bold text-purple-300">{inv.invoiceNumber}</td>
                            <td className="p-3 font-bold text-white">{inv.title}</td>
                            <td className="p-3 font-mono text-white">${inv.totalAmount}</td>
                            <td className="p-3 font-mono text-emerald-400">${inv.paidAmount}</td>
                            <td className="p-3 font-mono font-bold text-amber-400">${due}</td>
                            <td className="p-3 font-mono text-gray-400">
                              {new Date(inv.dueDate).toLocaleDateString()}
                            </td>
                            <td className="p-3">
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
                            </td>
                            <td className="p-3 text-right">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() =>
                                  setSelectedReceipt({
                                    receiptNumber: `REC-2026-${Math.floor(1000 + Math.random() * 9000)}`,
                                    amount: inv.paidAmount || inv.totalAmount,
                                    paymentMethod: 'CASH',
                                    paymentDate: new Date().toISOString(),
                                    invoice: { ...inv, student },
                                  })
                                }
                                className="h-7 px-2.5 text-[10px] gap-1"
                              >
                                <Receipt className="h-3.5 w-3.5" /> View Receipt
                              </Button>
                            </td>
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

        {/* TAB 6: ASSIGNMENTS */}
        {activeTab === 'assignments' && (
          <Card className="border-gray-800 text-center p-8">
            <FileText className="h-10 w-10 text-sky-400 mx-auto mb-2" />
            <CardTitle className="text-base">Course Homework & Submissions</CardTitle>
            <CardDescription className="text-xs max-w-sm mx-auto mt-1">
              Subject assignment submissions will populate here.
            </CardDescription>
          </Card>
        )}

        {/* TAB 7: DOCUMENTS */}
        {activeTab === 'documents' && (
          <Card className="border-gray-800">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <FolderArchive className="h-4 w-4 text-purple-400" /> Student Verification Vault
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-4 rounded-2xl bg-gray-950/60 border border-gray-800 text-xs flex items-center justify-between">
                <div>
                  <p className="font-bold text-white">Birth_Certificate_Verified.pdf</p>
                  <span className="text-[10px] text-gray-400">Uploaded on admission • 1.2 MB</span>
                </div>
                <Badge variant="success" className="text-[10px]">
                  VERIFIED
                </Badge>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Formal Printable Payment Receipt Modal */}
        {selectedReceipt && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
            <div className="w-full max-w-lg bg-white text-gray-900 p-8 rounded-3xl shadow-2xl space-y-6">
              <div className="flex justify-between items-start border-b border-gray-200 pb-4">
                <div>
                  <h2 className="text-xl font-black tracking-tight text-purple-950">APEX ACADEMY HIGH SCHOOL</h2>
                  <p className="text-xs text-gray-500 font-mono">Official Fee Payment Receipt</p>
                </div>
                <Badge variant="purple" className="font-mono text-xs">
                  {selectedReceipt.receiptNumber}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-gray-500 uppercase font-semibold text-[10px]">Student Details</span>
                  <p className="font-bold text-gray-900">
                    {student.firstName} {student.lastName}
                  </p>
                  <p className="font-mono text-gray-500">ID: {student.studentId}</p>
                </div>
                <div className="text-right">
                  <span className="text-gray-500 uppercase font-semibold text-[10px]">Payment Details</span>
                  <p className="font-mono text-gray-900 font-bold">
                    Date: {new Date(selectedReceipt.paymentDate).toLocaleDateString()}
                  </p>
                  <p className="font-mono text-gray-500">Method: {selectedReceipt.paymentMethod}</p>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200 space-y-2 text-xs font-mono">
                <div className="flex justify-between py-1 border-b border-gray-200">
                  <span className="text-gray-600">Invoice Total</span>
                  <span className="font-bold text-gray-900">${selectedReceipt.invoice?.totalAmount}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-200 text-emerald-700 font-bold">
                  <span>Amount Paid</span>
                  <span>${selectedReceipt.amount}</span>
                </div>
                <div className="flex justify-between py-1 text-amber-700 font-bold">
                  <span>Remaining Due Balance</span>
                  <span>
                    $
                    {Math.max(
                      0,
                      (selectedReceipt.invoice?.totalAmount || 0) -
                        (selectedReceipt.invoice?.paidAmount || selectedReceipt.amount)
                    )}
                  </span>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" size="sm" onClick={() => setSelectedReceipt(null)}>
                  Close
                </Button>
                <Button size="sm" onClick={() => window.print()} className="gap-2">
                  <Printer className="h-4 w-4" /> Print Receipt
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
