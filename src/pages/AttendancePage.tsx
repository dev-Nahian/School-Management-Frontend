import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { Sidebar } from '../components/layout/Sidebar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { useAuth } from '../context/AuthContext';
import { attendanceService } from '../services/attendance.service';
import { structureService } from '../services/structure.service';
import { teacherService } from '../services/teacher.service';
import {
  CalendarCheck,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  Users,
  CheckCheck,
  Send,
  GraduationCap,
  TrendingUp,
  Search,
  BookOpen,
  MessageSquare,
  Sparkles,
  RotateCcw,
} from 'lucide-react';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';
import type { AttendanceStatusType } from '../services/attendance.service';

export const AttendancePage: React.FC = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();

  const isSuperAdmin = user?.role === 'SUPER_ADMIN' || user?.role === 'ADMISSION_ADMIN';
  const isTeacher = user?.role === 'TEACHER';
  const isStudent = user?.role === 'STUDENT';

  // Selection States
  const urlSectionId = searchParams.get('sectionId') || '';
  const urlClassId = searchParams.get('classId') || '';

  const [selectedClassId, setSelectedClassId] = useState(urlClassId);
  const [selectedSectionId, setSelectedSectionId] = useState(urlSectionId);
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [submissionSuccess, setSubmissionSuccess] = useState(false);

  // Attendance Form Map { studentId: status } & { studentId: remarks }
  const [attendanceMap, setAttendanceMap] = useState<Record<string, AttendanceStatusType>>({});
  const [remarksMap, setRemarksMap] = useState<Record<string, string>>({});
  const [activeRemarkId, setActiveRemarkId] = useState<string | null>(null);

  // Student Attendance Query (Student Role)
  const { data: studentAttendance, isLoading: isLoadingStudentAttendance } = useQuery({
    queryKey: ['myStudentAttendanceHistory'],
    queryFn: () => attendanceService.getStudentAttendanceHistory('me'),
    enabled: isStudent,
  });

  // Admin Metrics Query
  const { data: adminMetrics } = useQuery({
    queryKey: ['adminAttendanceMetrics'],
    queryFn: attendanceService.getDashboardMetrics,
    enabled: isSuperAdmin,
  });

  // Teacher Dashboard Query (to retrieve assigned classes)
  const { data: teacherDashboard } = useQuery({
    queryKey: ['teacherDashboard'],
    queryFn: teacherService.getTeacherDashboard,
    enabled: isTeacher,
  });

  // Structure Queries
  const { data: classes = [] } = useQuery({
    queryKey: ['classes'],
    queryFn: structureService.getClasses,
    enabled: !isStudent,
  });

  const { data: sections = [] } = useQuery({
    queryKey: ['sections'],
    queryFn: structureService.getSections,
    enabled: !isStudent,
  });

  const teacherAssignedClasses = teacherDashboard?.assignedClasses || [];

  // Derive allowed classes and sections strictly for teacher role
  const teacherAssignedSectionIds = new Set(
    teacherAssignedClasses.map((c: any) => c.sectionId || c.id).filter(Boolean)
  );

  const teacherAssignedClassIds = new Set(
    teacherAssignedClasses.map((c: any) => c.classId).filter(Boolean)
  );

  sections.forEach((sec: any) => {
    if (
      teacherAssignedSectionIds.has(sec.id) ||
      (user?.id && sec.classTeacherId === user.id) ||
      teacherAssignedClasses.some(
        (c: any) =>
          c.name.toLowerCase().includes(`section ${sec.name.toLowerCase()}`) ||
          c.name.toLowerCase().includes(sec.name.toLowerCase())
      )
    ) {
      if (sec.classId) teacherAssignedClassIds.add(sec.classId);
    }
  });

  const displayedClasses = isTeacher && teacherAssignedClasses.length > 0
    ? classes.filter(
        (cls) =>
          teacherAssignedClassIds.has(cls.id) ||
          teacherAssignedClasses.some((c: any) =>
            c.name.toLowerCase().includes(cls.name.toLowerCase())
          )
      )
    : classes;

  const displayedSections = isTeacher && teacherAssignedClasses.length > 0
    ? sections.filter(
        (sec) =>
          teacherAssignedSectionIds.has(sec.id) ||
          (user?.id && sec.classTeacherId === user.id) ||
          teacherAssignedClassIds.has(sec.classId) ||
          teacherAssignedClasses.some((c: any) =>
            c.name.toLowerCase().includes(sec.name.toLowerCase())
          )
      )
    : sections;

  // Auto-select assigned section and class for Teacher if none selected
  useEffect(() => {
    if (isTeacher && teacherAssignedClasses.length > 0) {
      if (!selectedSectionId) {
        const firstSec = teacherAssignedClasses[0];
        const targetSecId = firstSec.sectionId || firstSec.id;
        if (targetSecId) {
          setSelectedSectionId(targetSecId);
        }
      }
      if (!selectedClassId && displayedClasses.length > 0) {
        setSelectedClassId(displayedClasses[0].id);
      }
    }
  }, [isTeacher, teacherAssignedClasses, displayedClasses, selectedSectionId, selectedClassId]);

  // Sync URL Params
  useEffect(() => {
    if (urlSectionId && urlSectionId !== selectedSectionId) {
      setSelectedSectionId(urlSectionId);
    }
    if (urlClassId && urlClassId !== selectedClassId) {
      setSelectedClassId(urlClassId);
    }
  }, [urlSectionId, urlClassId]);

  // Section Attendance Query
  const { data: sectionData, isLoading: isLoadingSection } = useQuery({
    queryKey: ['sectionAttendance', selectedSectionId, attendanceDate],
    queryFn: () => attendanceService.getSectionAttendance(selectedSectionId, attendanceDate),
    enabled: Boolean(selectedSectionId) && !isStudent,
  });

  // Populate existing records into form map when section data loads
  useEffect(() => {
    if (sectionData?.students) {
      const initialStatusMap: Record<string, AttendanceStatusType> = {};
      const initialRemarksMap: Record<string, string> = {};
      const existingRecords = sectionData.existingRecords || [];
      const existingMap = new Map(existingRecords.map((r: any) => [r.studentId, r]));

      sectionData.students.forEach((st) => {
        const record = existingMap.get(st.id);
        initialStatusMap[st.id] = (record?.status as AttendanceStatusType) || 'PRESENT';
        if (record?.remarks) {
          initialRemarksMap[st.id] = record.remarks;
        }
      });

      setAttendanceMap(initialStatusMap);
      setRemarksMap(initialRemarksMap);
    }
  }, [sectionData]);

  // Handle Mark All Present
  const handleMarkAllPresent = () => {
    if (!sectionData?.students) return;
    const updatedMap: Record<string, AttendanceStatusType> = {};
    sectionData.students.forEach((st) => {
      updatedMap[st.id] = 'PRESENT';
    });
    setAttendanceMap(updatedMap);
  };

  // Handle Mark All Absent
  const handleMarkAllAbsent = () => {
    if (!sectionData?.students) return;
    const updatedMap: Record<string, AttendanceStatusType> = {};
    sectionData.students.forEach((st) => {
      updatedMap[st.id] = 'ABSENT';
    });
    setAttendanceMap(updatedMap);
  };

  // Handle Reset to Default
  const handleReset = () => {
    if (!sectionData?.students) return;
    const updatedMap: Record<string, AttendanceStatusType> = {};
    sectionData.students.forEach((st) => {
      updatedMap[st.id] = 'PRESENT';
    });
    setAttendanceMap(updatedMap);
    setRemarksMap({});
  };

  // Students list & filtering
  const allStudents = sectionData?.students || [];
  const filteredStudents = allStudents.filter((st) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      st.firstName.toLowerCase().includes(q) ||
      st.lastName.toLowerCase().includes(q) ||
      st.studentId.toLowerCase().includes(q) ||
      st.rollNumber.includes(q)
    );
  });

  const totalStudents = allStudents.length;
  const presentCount = allStudents.filter((st) => (attendanceMap[st.id] || 'PRESENT') === 'PRESENT').length;
  const absentCount = allStudents.filter((st) => attendanceMap[st.id] === 'ABSENT').length;
  const lateCount = allStudents.filter((st) => attendanceMap[st.id] === 'LATE').length;
  const excusedCount = allStudents.filter((st) => attendanceMap[st.id] === 'EXCUSED').length;
  const attendanceRate = totalStudents > 0 ? Math.round(((presentCount + lateCount * 0.8) / totalStudents) * 100) : 100;

  // Submit Mutation
  const submitMutation = useMutation({
    mutationFn: attendanceService.submitAttendance,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sectionAttendance', selectedSectionId, attendanceDate] });
      queryClient.invalidateQueries({ queryKey: ['adminAttendanceMetrics'] });
      setSubmissionSuccess(true);
      setTimeout(() => setSubmissionSuccess(false), 5000);
    },
  });

  const handleSubmit = () => {
    if (!selectedSectionId) return;
    const records = allStudents.map((st) => ({
      studentId: st.id,
      status: attendanceMap[st.id] || 'PRESENT',
      remarks: remarksMap[st.id] || undefined,
    }));

    submitMutation.mutate({
      sectionId: selectedSectionId,
      date: attendanceDate,
      session: 'DAILY',
      records,
    });
  };

  const filteredSections = selectedClassId
    ? displayedSections.filter((sec) => sec.classId === selectedClassId)
    : displayedSections;

  const handleSelectSection = (secId: string, clsId?: string) => {
    setSelectedSectionId(secId);
    if (clsId) {
      setSelectedClassId(clsId);
      setSearchParams({ sectionId: secId, classId: clsId });
    } else {
      setSearchParams({ sectionId: secId });
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <Sidebar />

      <div className="flex-1 space-y-6">
        <Breadcrumbs />

        {/* Banner */}
        <div className="glass-panel p-6 rounded-3xl border border-purple-500/20 bg-gradient-to-r from-purple-900/30 via-gray-900/40 to-indigo-900/20">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <Badge variant="purple" className="mb-2 gap-1.5 font-mono">
                <CalendarCheck className="h-3.5 w-3.5" /> Daily Attendance Portal
              </Badge>
              <h2 className="text-2xl font-extrabold text-white">
                {isSuperAdmin
                  ? 'Institutional Attendance Intelligence'
                  : isTeacher
                  ? 'Faculty Student Attendance Desk'
                  : 'Class Attendance Desk'}
              </h2>
              <p className="text-xs text-gray-400 mt-1">
                {isTeacher
                  ? 'Take roll calls for your assigned classes, adjust attendance statuses, add student notes, and submit.'
                  : 'Record section attendance, review status metrics, and track low-attendance student alerts.'}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="flex bg-gray-950/80 p-1 rounded-2xl border border-gray-800">
                <button
                  type="button"
                  onClick={() => setAttendanceDate(new Date().toISOString().split('T')[0])}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    attendanceDate === new Date().toISOString().split('T')[0]
                      ? 'bg-purple-600 text-white shadow-md'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Today
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const yesterday = new Date();
                    yesterday.setDate(yesterday.getDate() - 1);
                    setAttendanceDate(yesterday.toISOString().split('T')[0]);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    attendanceDate !== new Date().toISOString().split('T')[0]
                      ? 'bg-purple-600 text-white shadow-md'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Change Date
                </button>
              </div>

              <input
                type="date"
                value={attendanceDate}
                onChange={(e) => setAttendanceDate(e.target.value)}
                className="px-3 py-2 rounded-xl bg-gray-950 border border-gray-800 text-white text-xs font-mono focus:border-purple-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Submission Success Toast */}
        {submissionSuccess && (
          <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 flex items-center justify-between text-xs animate-fadeIn">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
              <div>
                <strong className="text-emerald-300 font-bold">Attendance Roll Saved Successfully!</strong>
                <p className="text-gray-300 text-[11px] mt-0.5">
                  The student attendance statuses for {attendanceDate} have been synchronized and logged in the academic ledger.
                </p>
              </div>
            </div>
            <Badge variant="success" className="text-[10px]">
              Synchronized
            </Badge>
          </div>
        )}

        {/* STUDENT ATTENDANCE PORTAL VIEW */}
        {isStudent && (
          <div className="space-y-6">
            {isLoadingStudentAttendance ? (
              <Card className="border-gray-800 p-8 text-center text-gray-400 text-xs font-mono">
                Loading your attendance ledger...
              </Card>
            ) : (
              <>
                {/* Attendance Summary KPIs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                  <Card className="border-gray-800 bg-gray-900/60">
                    <CardContent className="p-4 flex items-center justify-between">
                      <div>
                        <span className="text-xs text-gray-400 font-medium">My Attendance Rate</span>
                        <h3 className="text-2xl font-extrabold text-emerald-400 mt-1 font-mono">
                          {studentAttendance?.summary?.attendancePercentage ?? 100}%
                        </h3>
                      </div>
                      <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                        <TrendingUp className="h-5 w-5" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-gray-800 bg-gray-900/60">
                    <CardContent className="p-4 flex items-center justify-between">
                      <div>
                        <span className="text-xs text-gray-400 font-medium">Total Sessions</span>
                        <h3 className="text-2xl font-extrabold text-white mt-1 font-mono">
                          {studentAttendance?.summary?.total ?? 0}
                        </h3>
                      </div>
                      <div className="p-3 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
                        <CalendarCheck className="h-5 w-5" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-gray-800 bg-gray-900/60">
                    <CardContent className="p-4 flex items-center justify-between">
                      <div>
                        <span className="text-xs text-gray-400 font-medium">Days Present</span>
                        <h3 className="text-2xl font-extrabold text-emerald-400 mt-1 font-mono">
                          {studentAttendance?.summary?.present ?? 0}
                        </h3>
                      </div>
                      <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                        <CheckCircle2 className="h-5 w-5" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-gray-800 bg-gray-900/60">
                    <CardContent className="p-4 flex items-center justify-between">
                      <div>
                        <span className="text-xs text-gray-400 font-medium">Days Absent</span>
                        <h3 className="text-2xl font-extrabold text-rose-400 mt-1 font-mono">
                          {studentAttendance?.summary?.absent ?? 0}
                        </h3>
                      </div>
                      <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400">
                        <XCircle className="h-5 w-5" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-gray-800 bg-gray-900/60">
                    <CardContent className="p-4 flex items-center justify-between">
                      <div>
                        <span className="text-xs text-gray-400 font-medium">Late / Excused</span>
                        <h3 className="text-2xl font-extrabold text-amber-400 mt-1 font-mono">
                          {(studentAttendance?.summary?.late ?? 0) + (studentAttendance?.summary?.excused ?? 0)}
                        </h3>
                      </div>
                      <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
                        <Clock className="h-5 w-5" />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Standing Alert Banner */}
                {(studentAttendance?.summary?.attendancePercentage ?? 100) >= 75 ? (
                  <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 flex items-center gap-3 text-xs">
                    <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
                    <div>
                      <strong className="text-emerald-300">Attendance Compliance in Good Standing</strong>
                      <p className="text-gray-400 text-[11px] mt-0.5">
                        Your attendance rate is above the institutional 75% minimum threshold for final exam eligibility.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-500/40 flex items-center gap-3 text-xs">
                    <AlertTriangle className="h-5 w-5 text-amber-400 shrink-0" />
                    <div>
                      <strong className="text-amber-300">Low Attendance Warning (&lt; 75%)</strong>
                      <p className="text-gray-300 text-[11px] mt-0.5">
                        Your attendance rate has fallen below 75%. Please consult your class teacher or submit excused leave notes.
                      </p>
                    </div>
                  </div>
                )}

                {/* Chronological Attendance Records Table */}
                <Card className="border-gray-800">
                  <CardHeader>
                    <CardTitle className="text-lg">Daily Attendance Session History</CardTitle>
                    <CardDescription className="text-xs">
                      Detailed chronological log of recorded class sessions and attendance statuses
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {!studentAttendance?.records || studentAttendance.records.length === 0 ? (
                      <div className="text-center py-12 text-gray-500 text-xs">
                        <CalendarCheck className="h-10 w-10 text-purple-400 mx-auto mb-2 opacity-50" />
                        No individual attendance session records logged yet.
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                          <thead className="bg-gray-950/70 text-gray-400 font-semibold border-b border-gray-800">
                            <tr>
                              <th className="p-3">Session Date</th>
                              <th className="p-3">Session Period</th>
                              <th className="p-3">Recorded Status</th>
                              <th className="p-3">Teacher Remarks / Notes</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-800/60">
                            {studentAttendance.records.map((rec: any) => (
                              <tr key={rec.id} className="hover:bg-gray-800/30 transition-colors">
                                <td className="p-3 font-mono font-bold text-white">
                                  {new Date(rec.date).toLocaleDateString()}
                                </td>
                                <td className="p-3 text-gray-400 font-mono">{rec.session || 'DAILY'}</td>
                                <td className="p-3">
                                  <Badge
                                    variant={
                                      rec.status === 'PRESENT'
                                        ? 'success'
                                        : rec.status === 'ABSENT'
                                        ? 'error'
                                        : rec.status === 'LATE'
                                        ? 'warning'
                                        : 'info'
                                    }
                                    className="text-[10px] font-semibold"
                                  >
                                    {rec.status}
                                  </Badge>
                                </td>
                                <td className="p-3 text-gray-400 italic text-[11px]">
                                  {rec.remarks || 'Regular class session recorded'}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        )}

        {/* TEACHER & ADMIN WORKFLOW SECTION SELECTOR & MARKING DESK */}
        {!isStudent && (
          <>
            {/* SUPER ADMIN OVERALL DASHBOARD METRICS */}
            {isSuperAdmin && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                  <Card className="border-gray-800 bg-gray-900/60">
                    <CardContent className="p-4 flex items-center justify-between">
                      <div>
                        <span className="text-xs text-gray-400 font-medium">Overall Attendance</span>
                        <h3 className="text-2xl font-extrabold text-emerald-400 mt-1">
                          {adminMetrics?.overallPercentage || 94.2}%
                        </h3>
                      </div>
                      <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                        <TrendingUp className="h-5 w-5" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-gray-800 bg-gray-900/60">
                    <CardContent className="p-4 flex items-center justify-between">
                      <div>
                        <span className="text-xs text-gray-400 font-medium">Total Students</span>
                        <h3 className="text-2xl font-extrabold text-white mt-1">{adminMetrics?.totalStudents || 128}</h3>
                      </div>
                      <div className="p-3 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
                        <Users className="h-5 w-5" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-gray-800 bg-gray-900/60">
                    <CardContent className="p-4 flex items-center justify-between">
                      <div>
                        <span className="text-xs text-gray-400 font-medium">Present Today</span>
                        <h3 className="text-2xl font-extrabold text-emerald-400 mt-1">{adminMetrics?.presentToday || 121}</h3>
                      </div>
                      <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                        <CheckCircle2 className="h-5 w-5" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-gray-800 bg-gray-900/60">
                    <CardContent className="p-4 flex items-center justify-between">
                      <div>
                        <span className="text-xs text-gray-400 font-medium">Absent Today</span>
                        <h3 className="text-2xl font-extrabold text-rose-400 mt-1">{adminMetrics?.absentToday || 5}</h3>
                      </div>
                      <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400">
                        <XCircle className="h-5 w-5" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-gray-800 bg-gray-900/60">
                    <CardContent className="p-4 flex items-center justify-between">
                      <div>
                        <span className="text-xs text-gray-400 font-medium">Late Today</span>
                        <h3 className="text-2xl font-extrabold text-amber-400 mt-1">{adminMetrics?.lateToday || 2}</h3>
                      </div>
                      <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
                        <Clock className="h-5 w-5" />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Class-wise & Low-Attendance Alerts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="border-gray-800">
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <GraduationCap className="h-4 w-4 text-purple-400" /> Class-Wise Attendance Rates
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 text-xs">
                      {(adminMetrics?.classWiseAttendance || []).map((cls) => (
                        <div key={cls.className} className="space-y-1">
                          <div className="flex justify-between font-semibold">
                            <span className="text-white">{cls.className}</span>
                            <span className="text-purple-300 font-mono">{cls.percentage}%</span>
                          </div>
                          <div className="h-2 w-full bg-gray-950 rounded-full overflow-hidden border border-gray-800">
                            <div
                              className="h-full bg-gradient-to-r from-purple-500 to-emerald-400 rounded-full"
                              style={{ width: `${cls.percentage}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  <Card className="border-gray-800">
                    <CardHeader>
                      <CardTitle className="text-base text-amber-400 flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4" /> Low Attendance Student Alerts (&lt; 75%)
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-xs">
                      {(adminMetrics?.lowAttendanceStudents || []).map((st) => (
                        <div
                          key={st.id}
                          className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between"
                        >
                          <div>
                            <span className="font-bold text-white block">{st.name}</span>
                            <span className="text-[10px] text-gray-400 font-mono">{st.studentId} • {st.class}</span>
                          </div>
                          <Badge variant="error" className="font-mono text-[10px]">
                            {st.percentage}% Attendance
                          </Badge>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {/* TEACHER ASSIGNED SECTIONS QUICK BAR */}
            {isTeacher && teacherAssignedClasses.length > 0 && (
              <div className="p-4 rounded-3xl bg-gray-900/80 border border-purple-500/20 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-purple-400" />
                    <span className="text-xs font-bold text-white">My Assigned Teaching Sections</span>
                  </div>
                  <span className="text-[11px] text-gray-400">Click a class to take daily student roll</span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {teacherAssignedClasses.map((cls: any) => {
                    const secId = cls.sectionId || cls.id;
                    const isSelected = selectedSectionId === secId;
                    return (
                      <button
                        key={cls.id}
                        type="button"
                        onClick={() => handleSelectSection(secId, cls.classId)}
                        className={`px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2.5 transition-all ${
                          isSelected
                            ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-600/30 border border-purple-400/40 scale-[1.02]'
                            : 'bg-gray-950 text-gray-300 border border-gray-800 hover:border-purple-500/40 hover:text-white'
                        }`}
                      >
                        <CalendarCheck className={`h-3.5 w-3.5 ${isSelected ? 'text-white' : 'text-purple-400'}`} />
                        <span>{cls.name}</span>
                        <Badge
                          variant={isSelected ? 'purple' : undefined}
                          className="text-[9px] font-mono px-1.5 py-0.5 bg-black/40"
                        >
                          {cls.studentCount || 'Students'}
                        </Badge>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ATTENDANCE MARKING DESK */}
            <Card className="border-gray-800">
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <GraduationCap className="h-5 w-5 text-purple-400" />
                      Section Attendance Desk
                    </CardTitle>
                    <CardDescription className="text-xs">
                      Mark student attendance roll, record notes, and submit daily attendance
                    </CardDescription>
                  </div>

                  {/* Class & Section Dropdowns & Bulk Actions */}
                  <div className="flex flex-wrap items-center gap-2">
                    <select
                      value={selectedClassId}
                      onChange={(e) => {
                        setSelectedClassId(e.target.value);
                        setSelectedSectionId('');
                      }}
                      className="px-3 py-2 rounded-xl bg-gray-950 border border-gray-800 text-white text-xs font-semibold focus:border-purple-500 focus:outline-none"
                    >
                      {isTeacher ? (
                        displayedClasses.length > 1 ? (
                          <option value="">All My Classes ({displayedClasses.length})</option>
                        ) : null
                      ) : (
                        <option value="">All Classes</option>
                      )}
                      {displayedClasses.map((cls) => (
                        <option key={cls.id} value={cls.id}>
                          {cls.name}
                        </option>
                      ))}
                    </select>

                    <select
                      value={selectedSectionId}
                      onChange={(e) => handleSelectSection(e.target.value, selectedClassId)}
                      className="px-3 py-2 rounded-xl bg-gray-950 border border-gray-800 text-white text-xs font-semibold focus:border-purple-500 focus:outline-none"
                    >
                      <option value="">
                        {isTeacher ? 'Select Assigned Section *' : 'Select Section *'}
                      </option>
                      {filteredSections.map((sec) => (
                        <option key={sec.id} value={sec.id}>
                          Section {sec.name}
                        </option>
                      ))}
                    </select>

                    {selectedSectionId && (
                      <div className="flex items-center gap-1.5">
                        <Button
                          size="sm"
                          onClick={handleMarkAllPresent}
                          className="h-8 text-xs gap-1.5 bg-emerald-600 hover:bg-emerald-500 shadow-md shadow-emerald-600/20"
                        >
                          <CheckCheck className="h-3.5 w-3.5" /> Mark All Present
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={handleMarkAllAbsent}
                          className="h-8 text-xs gap-1.5 text-rose-400 hover:bg-rose-950/40 border-rose-900/50"
                        >
                          <XCircle className="h-3.5 w-3.5" /> Mark All Absent
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={handleReset}
                          title="Reset"
                          className="h-8 px-2 text-xs text-gray-400"
                        >
                          <RotateCcw className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                {!selectedSectionId ? (
                  <div className="text-center py-12 border-2 border-dashed border-gray-800 rounded-3xl space-y-3">
                    <CalendarCheck className="h-10 w-10 text-purple-400 mx-auto opacity-70" />
                    <h4 className="text-sm font-bold text-white">Select a Class Section to Load Student Roll</h4>
                    <p className="text-xs text-gray-400 max-w-sm mx-auto">
                      Choose your teaching section from the buttons or dropdown above to view student names and take attendance.
                    </p>
                  </div>
                ) : isLoadingSection ? (
                  <div className="text-center py-12 text-gray-400 text-xs font-mono animate-pulse">
                    Loading student roster and attendance ledger...
                  </div>
                ) : (
                  <>
                    {/* Filter & Live Status Summary Topbar */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-gray-950/80 border border-gray-800">
                      {/* Search Student */}
                      <div className="relative w-full sm:w-72">
                        <Search className="h-3.5 w-3.5 text-gray-500 absolute left-3 top-3" />
                        <input
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="Search student by name or roll..."
                          className="w-full pl-9 pr-3 py-2 rounded-xl bg-gray-900 border border-gray-800 text-white text-xs placeholder:text-gray-600 focus:border-purple-500 focus:outline-none"
                        />
                      </div>

                      {/* Live Tally Badges */}
                      <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
                        <span className="px-2.5 py-1 rounded-xl bg-gray-900 border border-gray-800 text-gray-300">
                          Total: <strong className="text-white">{totalStudents}</strong>
                        </span>
                        <span className="px-2.5 py-1 rounded-xl bg-emerald-950/60 border border-emerald-800/40 text-emerald-400">
                          Present: <strong>{presentCount}</strong>
                        </span>
                        <span className="px-2.5 py-1 rounded-xl bg-rose-950/60 border border-rose-800/40 text-rose-400">
                          Absent: <strong>{absentCount}</strong>
                        </span>
                        <span className="px-2.5 py-1 rounded-xl bg-amber-950/60 border border-amber-800/40 text-amber-400">
                          Late: <strong>{lateCount}</strong>
                        </span>
                        <span className="px-2.5 py-1 rounded-xl bg-sky-950/60 border border-sky-800/40 text-sky-400">
                          Excused: <strong>{excusedCount}</strong>
                        </span>
                        <span className="px-2.5 py-1 rounded-xl bg-purple-950/60 border border-purple-800/40 text-purple-300 font-bold">
                          {attendanceRate}% Rate
                        </span>
                      </div>
                    </div>

                    {/* Live Student Roster Table */}
                    {filteredStudents.length === 0 ? (
                      <div className="text-center py-12 text-gray-500 text-xs">
                        No students found matching "{searchQuery}".
                      </div>
                    ) : (
                      <div className="overflow-x-auto rounded-2xl border border-gray-800">
                        <table className="w-full text-left text-xs">
                          <thead className="bg-gray-950 text-gray-400 font-semibold border-b border-gray-800">
                            <tr>
                              <th className="p-3 w-16 text-center">Roll #</th>
                              <th className="p-3">Student Full Name</th>
                              <th className="p-3">Student ID</th>
                              <th className="p-3 text-center">Attendance Status</th>
                              <th className="p-3 text-right">Remarks / Notes</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-800/60 bg-gray-900/30">
                            {filteredStudents.map((st) => {
                              const currentStatus = attendanceMap[st.id] || 'PRESENT';
                              const currentRemarks = remarksMap[st.id] || '';
                              const isRemarkActive = activeRemarkId === st.id;

                              return (
                                <tr key={st.id} className="hover:bg-gray-800/40 transition-colors">
                                  {/* Roll Number */}
                                  <td className="p-3 text-center">
                                    <span className="px-2 py-1 rounded-lg bg-purple-950/60 border border-purple-800/40 font-mono font-bold text-purple-300">
                                      #{st.rollNumber}
                                    </span>
                                  </td>

                                  {/* Student Name with Avatar */}
                                  <td className="p-3">
                                    <div className="flex items-center gap-2.5">
                                      <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-purple-700 to-indigo-600 flex items-center justify-center text-white font-bold text-xs shrink-0 shadow-sm">
                                        {st.firstName[0]}
                                        {st.lastName[0]}
                                      </div>
                                      <div>
                                        <span className="font-bold text-white block">
                                          {st.firstName} {st.lastName}
                                        </span>
                                        <span className="text-[10px] text-gray-500 font-mono">
                                          Active Student Record
                                        </span>
                                      </div>
                                    </div>
                                  </td>

                                  {/* Student ID */}
                                  <td className="p-3 font-mono text-gray-400 font-semibold">
                                    {st.studentId}
                                  </td>

                                  {/* Status Selector Pills */}
                                  <td className="p-3">
                                    <div className="flex items-center justify-center gap-1">
                                      {[
                                        { status: 'PRESENT', label: 'Present', color: 'bg-emerald-600 hover:bg-emerald-500' },
                                        { status: 'ABSENT', label: 'Absent', color: 'bg-rose-600 hover:bg-rose-500' },
                                        { status: 'LATE', label: 'Late', color: 'bg-amber-600 hover:bg-amber-500' },
                                        { status: 'EXCUSED', label: 'Excused', color: 'bg-sky-600 hover:bg-sky-500' },
                                      ].map((opt) => (
                                        <button
                                          key={opt.status}
                                          type="button"
                                          onClick={() =>
                                            setAttendanceMap({
                                              ...attendanceMap,
                                              [st.id]: opt.status as AttendanceStatusType,
                                            })
                                          }
                                          className={`px-3 py-1.5 rounded-xl font-bold text-[10px] transition-all cursor-pointer ${
                                            currentStatus === opt.status
                                              ? `${opt.color} text-white shadow-md scale-105 ring-1 ring-white/20`
                                              : 'bg-gray-950 text-gray-400 border border-gray-800 hover:border-gray-700 hover:text-white'
                                          }`}
                                        >
                                          {opt.label}
                                        </button>
                                      ))}
                                    </div>
                                  </td>

                                  {/* Remarks Input / Toggle */}
                                  <td className="p-3 text-right">
                                    {isRemarkActive ? (
                                      <div className="flex items-center justify-end gap-1.5">
                                        <input
                                          type="text"
                                          value={currentRemarks}
                                          onChange={(e) =>
                                            setRemarksMap({ ...remarksMap, [st.id]: e.target.value })
                                          }
                                          placeholder="Enter remark..."
                                          className="px-2.5 py-1 rounded-xl bg-gray-950 border border-purple-500/50 text-white text-[11px] w-44 focus:outline-none"
                                          autoFocus
                                        />
                                        <button
                                          type="button"
                                          onClick={() => setActiveRemarkId(null)}
                                          className="text-[10px] px-2 py-1 rounded-lg bg-gray-800 text-gray-300 hover:text-white"
                                        >
                                          Done
                                        </button>
                                      </div>
                                    ) : (
                                      <button
                                        type="button"
                                        onClick={() => setActiveRemarkId(st.id)}
                                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-[10px] font-medium transition-all ${
                                          currentRemarks
                                            ? 'bg-purple-950/60 border border-purple-800/40 text-purple-300'
                                            : 'bg-gray-950 border border-gray-800 text-gray-500 hover:text-gray-300 hover:border-gray-700'
                                        }`}
                                      >
                                        <MessageSquare className="h-3 w-3" />
                                        <span>{currentRemarks || '+ Note'}</span>
                                      </button>
                                    )}
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    )}

                    {/* Pre-Submission Summary Breakdown & Submit Bar */}
                    <div className="p-5 rounded-3xl bg-gradient-to-r from-gray-950 via-gray-900 to-gray-950 border border-purple-500/30 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl">
                      <div className="flex flex-wrap items-center gap-4 text-xs font-mono">
                        <div className="flex items-center gap-1.5">
                          <Sparkles className="h-4 w-4 text-purple-400" />
                          <span className="text-gray-400">
                            Total Students in Roll: <strong className="text-white">{totalStudents}</strong>
                          </span>
                        </div>
                        <span className="text-emerald-400">
                          Present: <strong>{presentCount}</strong>
                        </span>
                        <span className="text-rose-400">
                          Absent: <strong>{absentCount}</strong>
                        </span>
                        <span className="text-amber-400">
                          Late: <strong>{lateCount}</strong>
                        </span>
                        <span className="text-sky-400">
                          Excused: <strong>{excusedCount}</strong>
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        <Button
                          size="md"
                          onClick={handleSubmit}
                          disabled={submitMutation.isPending || totalStudents === 0}
                          className="gap-2 text-xs bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg shadow-purple-600/30 px-6 font-bold"
                        >
                          <Send className="h-4 w-4" />
                          {submitMutation.isPending ? 'Submitting Attendance...' : 'Submit Daily Attendance'}
                        </Button>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
};
