import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Sidebar } from '../components/layout/Sidebar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { useAuth } from '../context/AuthContext';
import { attendanceService } from '../services/attendance.service';
import { structureService } from '../services/structure.service';
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
} from 'lucide-react';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';
import type { AttendanceStatusType } from '../services/attendance.service';

export const AttendancePage: React.FC = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const isSuperAdmin = user?.role === 'SUPER_ADMIN' || user?.role === 'ADMISSION_ADMIN';

  // Selection States
  const [selectedClassId, setSelectedClassId] = useState('');
  const [selectedSectionId, setSelectedSectionId] = useState('');
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0]);

  // Attendance Form Map { studentId: status }
  const [attendanceMap, setAttendanceMap] = useState<Record<string, AttendanceStatusType>>({});

  // React Queries
  const { data: adminMetrics } = useQuery({
    queryKey: ['adminAttendanceMetrics'],
    queryFn: attendanceService.getDashboardMetrics,
    enabled: isSuperAdmin,
  });

  const { data: classes = [] } = useQuery({
    queryKey: ['classes'],
    queryFn: structureService.getClasses,
  });

  const { data: sections = [] } = useQuery({
    queryKey: ['sections'],
    queryFn: structureService.getSections,
  });

  const { data: sectionData, isLoading: isLoadingSection } = useQuery({
    queryKey: ['sectionAttendance', selectedSectionId, attendanceDate],
    queryFn: () => attendanceService.getSectionAttendance(selectedSectionId, attendanceDate),
    enabled: Boolean(selectedSectionId),
  });

  // Handle Mark All Present
  const handleMarkAllPresent = () => {
    if (!sectionData?.students) return;
    const updatedMap: Record<string, AttendanceStatusType> = {};
    sectionData.students.forEach((st) => {
      updatedMap[st.id] = 'PRESENT';
    });
    setAttendanceMap(updatedMap);
  };

  // Status counters
  const studentsList = sectionData?.students || [];
  const totalStudents = studentsList.length;

  const presentCount = studentsList.filter((st) => (attendanceMap[st.id] || 'PRESENT') === 'PRESENT').length;
  const absentCount = studentsList.filter((st) => attendanceMap[st.id] === 'ABSENT').length;
  const lateCount = studentsList.filter((st) => attendanceMap[st.id] === 'LATE').length;
  const excusedCount = studentsList.filter((st) => attendanceMap[st.id] === 'EXCUSED').length;

  // Submit Mutation
  const submitMutation = useMutation({
    mutationFn: attendanceService.submitAttendance,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sectionAttendance'] });
      queryClient.invalidateQueries({ queryKey: ['adminAttendanceMetrics'] });
    },
  });

  const handleSubmit = () => {
    if (!selectedSectionId) return;
    const records = studentsList.map((st) => ({
      studentId: st.id,
      status: attendanceMap[st.id] || 'PRESENT',
    }));

    submitMutation.mutate({
      sectionId: selectedSectionId,
      date: attendanceDate,
      session: 'DAILY',
      records,
    });
  };

  const filteredSections = selectedClassId
    ? sections.filter((sec) => sec.classId === selectedClassId)
    : sections;

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
                <CalendarCheck className="h-3.5 w-3.5" /> Phase 7 Daily Attendance Portal
              </Badge>
              <h2 className="text-2xl font-extrabold text-white">
                {isSuperAdmin ? 'Institutional Attendance Intelligence' : 'Class Attendance Desk'}
              </h2>
              <p className="text-xs text-gray-400 mt-1">
                Record section attendance, review status metrics, and track low-attendance student alerts.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="date"
                value={attendanceDate}
                onChange={(e) => setAttendanceDate(e.target.value)}
                className="px-3 py-2 rounded-xl bg-gray-950 border border-gray-800 text-white text-xs font-mono"
              />
            </div>
          </div>
        </div>

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

        {/* TEACHER WORKFLOW SECTION SELECTOR & MARKING DESK */}
        <Card className="border-gray-800">
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-lg">Section Attendance Desk</CardTitle>
                <CardDescription className="text-xs">
                  Select class and section to mark daily attendance roll
                </CardDescription>
              </div>

              {/* Class & Section Dropdowns */}
              <div className="flex flex-wrap gap-2">
                <select
                  value={selectedClassId}
                  onChange={(e) => {
                    setSelectedClassId(e.target.value);
                    setSelectedSectionId('');
                  }}
                  className="px-3 py-2 rounded-xl bg-gray-950 border border-gray-800 text-white text-xs"
                >
                  <option value="">All Classes</option>
                  {classes.map((cls) => (
                    <option key={cls.id} value={cls.id}>
                      {cls.name}
                    </option>
                  ))}
                </select>

                <select
                  value={selectedSectionId}
                  onChange={(e) => setSelectedSectionId(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-gray-950 border border-gray-800 text-white text-xs font-semibold"
                >
                  <option value="">Select Section *</option>
                  {filteredSections.map((sec) => (
                    <option key={sec.id} value={sec.id}>
                      Section {sec.name}
                    </option>
                  ))}
                </select>

                {selectedSectionId && (
                  <Button
                    size="sm"
                    onClick={handleMarkAllPresent}
                    className="gap-1.5 text-xs shadow-md shadow-purple-600/30"
                  >
                    <CheckCheck className="h-4 w-4" /> Mark All Present
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {!selectedSectionId ? (
              <div className="text-center py-12 border-2 border-dashed border-gray-800 rounded-3xl space-y-3">
                <CalendarCheck className="h-10 w-10 text-purple-400 mx-auto" />
                <h4 className="text-sm font-bold text-white">Select Class Section to Load Student Roll</h4>
                <p className="text-xs text-gray-500 max-w-sm mx-auto">
                  Choose a class section from the header dropdown above to start marking daily attendance.
                </p>
              </div>
            ) : isLoadingSection ? (
              <div className="text-center py-12 text-gray-400 text-xs font-mono">
                Loading assigned student roster...
              </div>
            ) : (
              <>
                {/* Live Roster Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-gray-950/70 text-gray-400 font-semibold border-b border-gray-800">
                      <tr>
                        <th className="p-3">Roll #</th>
                        <th className="p-3">Student Name</th>
                        <th className="p-3">Student ID</th>
                        <th className="p-3 text-center">Attendance Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800/60">
                      {studentsList.map((st) => {
                        const currentStatus = attendanceMap[st.id] || 'PRESENT';
                        return (
                          <tr key={st.id} className="hover:bg-gray-800/30 transition-colors">
                            <td className="p-3 font-mono font-bold text-purple-300">{st.rollNumber}</td>
                            <td className="p-3 font-bold text-white">
                              {st.firstName} {st.lastName}
                            </td>
                            <td className="p-3 font-mono text-gray-400">{st.studentId}</td>
                            <td className="p-3">
                              <div className="flex items-center justify-center gap-1.5">
                                {[
                                  { status: 'PRESENT', label: 'Present', color: 'bg-emerald-600' },
                                  { status: 'ABSENT', label: 'Absent', color: 'bg-rose-600' },
                                  { status: 'LATE', label: 'Late', color: 'bg-amber-600' },
                                  { status: 'EXCUSED', label: 'Excused', color: 'bg-sky-600' },
                                ].map((opt) => (
                                  <button
                                    key={opt.status}
                                    onClick={() =>
                                      setAttendanceMap({
                                        ...attendanceMap,
                                        [st.id]: opt.status as AttendanceStatusType,
                                      })
                                    }
                                    className={`px-3 py-1.5 rounded-xl font-semibold text-[10px] transition-all ${
                                      currentStatus === opt.status
                                        ? `${opt.color} text-white shadow-md`
                                        : 'bg-gray-950 text-gray-400 border border-gray-800 hover:border-gray-700'
                                    }`}
                                  >
                                    {opt.label}
                                  </button>
                                ))}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Pre-Submission Summary Breakdown */}
                <div className="p-4 rounded-2xl bg-gray-950 border border-purple-500/20 flex flex-col md:flex-row items-center justify-between gap-4">
                  <div className="flex flex-wrap gap-4 text-xs font-mono">
                    <span className="text-gray-400">
                      Total Students: <strong className="text-white">{totalStudents}</strong>
                    </span>
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

                  <Button
                    size="sm"
                    onClick={handleSubmit}
                    disabled={submitMutation.isPending}
                    className="gap-2 text-xs shadow-lg shadow-purple-600/30"
                  >
                    <Send className="h-4 w-4" />
                    {submitMutation.isPending ? 'Submitting...' : 'Submit Attendance'}
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
