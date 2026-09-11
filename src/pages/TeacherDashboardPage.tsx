import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Sidebar } from '../components/layout/Sidebar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { useAuth } from '../context/AuthContext';
import { teacherService } from '../services/teacher.service';
import { structureService } from '../services/structure.service';
import { dashboardService } from '../services/dashboard.service';
import {
  UserCheck,
  BookOpen,
  Clock,
  Award,
  FileText,
  Megaphone,
  Plus,
  Power,
  X,
  Layers,
  Users,
  CalendarCheck,
  Calendar,
  Phone,
  Mail,
  Search,
} from 'lucide-react';

export const TeacherDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const isSuperAdmin = user?.role === 'SUPER_ADMIN' || user?.role === 'ADMISSION_ADMIN';
  const isParent = user?.role === 'PARENT';
  const isTeacher = user?.role === 'TEACHER';

  // Parent view state
  const [searchQuery, setSearchQuery] = useState('');

  // Modal Dialog States
  const [isAddTeacherOpen, setIsAddTeacherOpen] = useState(false);
  const [isAssignOpen, setIsAssignOpen] = useState(false);

  // Form Field States
  const [newTeacher, setNewTeacher] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    qualification: 'M.Sc. Mathematics',
    specialization: 'Algebra & Geometry',
  });

  const [assignForm, setAssignForm] = useState({
    teacherId: '',
    subjectId: '',
    sectionId: '',
  });

  // React Queries
  const { data: dashboard } = useQuery({
    queryKey: ['teacherDashboard'],
    queryFn: teacherService.getTeacherDashboard,
    enabled: isTeacher,
  });

  const { data: parentData } = useQuery({
    queryKey: ['parentDashboardTeachers'],
    queryFn: dashboardService.getParentDashboard,
    enabled: isParent,
  });

  const { data: teachers = [] } = useQuery({
    queryKey: ['teachers'],
    queryFn: teacherService.getTeachers,
    enabled: isSuperAdmin || isParent,
  });

  const { data: subjects = [] } = useQuery({
    queryKey: ['subjects'],
    queryFn: structureService.getSubjects,
    enabled: isSuperAdmin,
  });

  const { data: sections = [] } = useQuery({
    queryKey: ['sections'],
    queryFn: structureService.getSections,
    enabled: isSuperAdmin,
  });

  // Extract my children's teachers
  const parentChildren = parentData?.children || [];
  const myChildrenTeachers = parentChildren.flatMap((ch: any) => ch.teachers || []);
  const uniqueChildTeachers = Array.from(
    new Map(myChildrenTeachers.map((t: any) => [t.id || t.email, t])).values()
  );

  // Filtered full teachers list for search
  const filteredTeachers = teachers.filter((t: any) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      t.firstName?.toLowerCase().includes(q) ||
      t.lastName?.toLowerCase().includes(q) ||
      t.email?.toLowerCase().includes(q) ||
      t.phone?.toLowerCase().includes(q) ||
      t.teacherProfile?.qualification?.toLowerCase().includes(q) ||
      t.teacherProfile?.specialization?.toLowerCase().includes(q)
    );
  });

  // Mutations
  const createTeacherMutation = useMutation({
    mutationFn: teacherService.createTeacher,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teachers'] });
      setIsAddTeacherOpen(false);
      setNewTeacher({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        qualification: 'M.Sc. Mathematics',
        specialization: 'Algebra & Geometry',
      });
    },
  });

  const updateTeacherMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => teacherService.updateTeacher(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teachers'] });
    },
  });

  const assignClassMutation = useMutation({
    mutationFn: teacherService.assignClassSubject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teachers'] });
      setIsAssignOpen(false);
    },
  });

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <Sidebar />

      <div className="flex-1 space-y-6">
        {/* Header Panel */}
        <div className="glass-panel p-6 rounded-3xl border border-purple-500/20 bg-gradient-to-r from-purple-900/30 via-gray-900/40 to-indigo-900/20">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <Badge variant="purple" className="mb-2 gap-1.5 font-mono">
                <UserCheck className="h-3.5 w-3.5" />
                {isParent ? 'Faculty & Educator Contact Directory' : 'Phase 6 Faculty & Academic Portal'}
              </Badge>
              <h2 className="text-2xl font-extrabold text-white">
                {isParent
                  ? 'Teacher Contact Directory'
                  : isSuperAdmin
                  ? 'Faculty Administration Desk'
                  : 'Teacher Academic Workbench'}
              </h2>
              <p className="text-xs text-gray-400 mt-1">
                {isParent
                  ? 'Access contact phone numbers and email addresses for your children’s educators to discuss academic progress, attendance, and welfare.'
                  : isSuperAdmin
                  ? 'Manage teacher profiles, section placements, subject mappings, and access scopes.'
                  : `Welcome back, Professor ${user?.firstName || ''}. View today's schedule, classes, and exams.`}
              </p>
            </div>

            {isParent ? (
              <div className="flex flex-wrap gap-2">
                <Button size="sm" onClick={() => navigate('/attendance')} className="gap-1.5 text-xs bg-emerald-600 hover:bg-emerald-500">
                  <CalendarCheck className="h-4 w-4" /> Attendance Desk
                </Button>
                <Button size="sm" onClick={() => navigate('/results')} className="gap-1.5 text-xs bg-purple-600 hover:bg-purple-500">
                  <Award className="h-4 w-4" /> Exam Routine & Marks
                </Button>
              </div>
            ) : isSuperAdmin ? (
              <div className="flex flex-wrap gap-2">
                <Button size="sm" onClick={() => setIsAddTeacherOpen(true)} className="gap-1.5 text-xs">
                  <Plus className="h-4 w-4" /> Add New Educator
                </Button>

                <Button size="sm" variant="outline" onClick={() => setIsAssignOpen(true)} className="gap-1.5 text-xs">
                  <Layers className="h-4 w-4 text-purple-400" /> Assign Class & Subject
                </Button>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                <Button size="sm" onClick={() => navigate('/attendance')} className="gap-1.5 text-xs bg-emerald-600 hover:bg-emerald-500">
                  <CalendarCheck className="h-4 w-4" /> Attendance Desk
                </Button>
                <Button size="sm" onClick={() => navigate('/exams')} className="gap-1.5 text-xs bg-purple-600 hover:bg-purple-500">
                  <Award className="h-4 w-4" /> Gradebook
                </Button>
                <Button size="sm" variant="outline" onClick={() => navigate('/assignments')} className="gap-1.5 text-xs">
                  <FileText className="h-4 w-4 text-sky-400" /> Homework
                </Button>
                <Button size="sm" variant="outline" onClick={() => navigate('/timetable')} className="gap-1.5 text-xs">
                  <Calendar className="h-4 w-4 text-indigo-400" /> Timetable
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* PARENT VIEW: Teacher Contacts & Directory */}
        {isParent && (
          <div className="space-y-6">
            {/* 1. My Children's Educators */}
            <Card className="border-purple-500/20 bg-gradient-to-br from-gray-900/90 via-purple-950/20 to-gray-900/90">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <Phone className="h-5 w-5 text-emerald-400" />
                  <div>
                    <CardTitle className="text-base text-white">My Children's Assigned Educators</CardTitle>
                    <CardDescription className="text-xs">
                      Direct phone and email communication channels with class teachers and subject faculty
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {uniqueChildTeachers.length === 0 ? (
                  <p className="p-6 text-center text-gray-400 text-xs">No assigned teachers found.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {uniqueChildTeachers.map((tch: any) => (
                      <div
                        key={tch.id}
                        className="p-4 rounded-2xl bg-gray-950/90 border border-gray-800 hover:border-purple-500/40 transition-all flex flex-col justify-between space-y-4 shadow-lg"
                      >
                        <div className="space-y-2">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-2.5">
                              <div className="h-10 w-10 rounded-xl bg-purple-600/30 border border-purple-500/30 flex items-center justify-center font-bold text-white text-sm">
                                {tch.name?.charAt(0) || 'T'}
                              </div>
                              <div>
                                <h4 className="font-bold text-white text-sm">{tch.name}</h4>
                                <span className="text-xs text-purple-300 font-medium block">
                                  {tch.subject || 'Academic Educator'}
                                </span>
                              </div>
                            </div>
                            {tch.isClassTeacher && (
                              <Badge variant="purple" className="text-[9px]">
                                Class Teacher
                              </Badge>
                            )}
                          </div>

                          <div className="text-[11px] text-gray-400 space-y-0.5 pt-1">
                            <p><strong className="text-gray-300">Qualification:</strong> {tch.qualification || 'M.Sc.'}</p>
                            <p><strong className="text-gray-300">Specialization:</strong> {tch.specialization || tch.subject}</p>
                          </div>
                        </div>

                        {/* Direct Contact Buttons */}
                        <div className="pt-3 border-t border-gray-800/80 space-y-2">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-400 flex items-center gap-1 text-[11px]">
                              <Phone className="h-3 w-3 text-emerald-400" /> Phone:
                            </span>
                            <a
                              href={`tel:${tch.phone || '+15550199182'}`}
                              className="font-mono text-emerald-400 hover:underline font-bold text-[11px]"
                            >
                              {tch.phone || '+1 (555) 019-9182'}
                            </a>
                          </div>

                          <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-400 flex items-center gap-1 text-[11px]">
                              <Mail className="h-3 w-3 text-blue-400" /> Email:
                            </span>
                            <a
                              href={`mailto:${tch.email}`}
                              className="font-mono text-blue-300 hover:underline text-[11px] truncate max-w-[170px]"
                            >
                              {tch.email}
                            </a>
                          </div>

                          <div className="grid grid-cols-2 gap-2 pt-1">
                            <a
                              href={`tel:${tch.phone || '+15550199182'}`}
                              className="px-2.5 py-2 rounded-xl bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-900/50 text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-all text-center"
                            >
                              <Phone className="h-3 w-3" /> Call Teacher
                            </a>
                            <a
                              href={`mailto:${tch.email}?subject=Parent%20Inquiry%20from%20${encodeURIComponent(user.firstName + ' ' + user.lastName)}`}
                              className="px-2.5 py-2 rounded-xl bg-purple-950/60 border border-purple-500/30 text-purple-300 hover:bg-purple-900/50 text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-all text-center"
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

            {/* 2. All School Faculty Directory with Search */}
            <Card className="border-gray-800">
              <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Users className="h-4 w-4 text-purple-400" /> All Institutional Faculty Members ({filteredTeachers.length})
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Search and view official contact credentials for the school’s academic staff
                  </CardDescription>
                </div>

                <div className="relative w-full sm:w-64">
                  <Search className="h-3.5 w-3.5 text-gray-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by name, subject, email..."
                    className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-gray-950 border border-gray-800 text-white text-xs focus:border-purple-500 focus:outline-none"
                  />
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-gray-950/70 text-gray-400 font-semibold border-b border-gray-800">
                      <tr>
                        <th className="p-3">Faculty Name</th>
                        <th className="p-3">Qualification</th>
                        <th className="p-3">Specialization</th>
                        <th className="p-3">Phone Number</th>
                        <th className="p-3">Email Address</th>
                        <th className="p-3 text-right">Quick Contact</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800/60">
                      {filteredTeachers.map((tch: any) => (
                        <tr key={tch.id} className="hover:bg-gray-800/30 transition-colors">
                          <td className="p-3 font-bold text-white flex items-center gap-2">
                            <UserCheck className="h-4 w-4 text-purple-400 shrink-0" />
                            <div>
                              <span>{tch.firstName} {tch.lastName}</span>
                              <span className="block text-[10px] text-gray-500 font-mono">
                                {tch.teacherProfile?.employeeId || 'TCH-2026'}
                              </span>
                            </div>
                          </td>
                          <td className="p-3 text-gray-300">{tch.teacherProfile?.qualification || 'M.Sc.'}</td>
                          <td className="p-3 text-gray-300">{tch.teacherProfile?.specialization || 'Academic Instruction'}</td>
                          <td className="p-3 font-mono font-bold text-emerald-400">
                            <a href={`tel:${tch.phone || '+15550199182'}`} className="hover:underline flex items-center gap-1">
                              <Phone className="h-3 w-3" /> {tch.phone || '+1 (555) 019-9182'}
                            </a>
                          </td>
                          <td className="p-3 font-mono text-blue-300">
                            <a href={`mailto:${tch.email}`} className="hover:underline flex items-center gap-1">
                              <Mail className="h-3 w-3" /> {tch.email}
                            </a>
                          </td>
                          <td className="p-3 text-right space-x-1.5">
                            <a
                              href={`tel:${tch.phone || '+15550199182'}`}
                              className="px-2 py-1 rounded-lg bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-[10px] font-semibold inline-flex items-center gap-1 hover:bg-emerald-900/50"
                            >
                              <Phone className="h-2.5 w-2.5" /> Call
                            </a>
                            <a
                              href={`mailto:${tch.email}`}
                              className="px-2 py-1 rounded-lg bg-purple-950/60 border border-purple-500/30 text-purple-300 text-[10px] font-semibold inline-flex items-center gap-1 hover:bg-purple-900/50"
                            >
                              <Mail className="h-2.5 w-2.5" /> Email
                            </a>
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

        {/* TEACHER & ADMIN DASHBOARD PANELS */}
        {!isParent && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Today's Schedule & Attendance Tasks */}
          <div className="lg:col-span-2 space-y-6">
            {/* Today's Classes */}
            <Card className="border-gray-800">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Clock className="h-4 w-4 text-purple-400" /> Today's Lecture Schedule
                </CardTitle>
                <CardDescription className="text-xs">Timetable for today's active classes</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {(dashboard?.todaySchedule || []).map((sched: any) => (
                  <div
                    key={sched.id}
                    className="p-3.5 rounded-2xl bg-gray-950/60 border border-gray-800 flex items-center justify-between hover:border-purple-500/30 transition-all"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-xs">{sched.subject}</span>
                        <Badge variant="purple" className="text-[10px]">
                          {sched.className} - {sched.sectionName}
                        </Badge>
                      </div>
                      <p className="text-[11px] text-gray-400 font-mono flex items-center gap-2">
                        <Clock className="h-3 w-3 text-purple-400" /> {sched.time} • {sched.room}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        onClick={() => navigate(`/attendance?sectionId=${sched.sectionId || ''}&classId=${sched.classId || ''}`)}
                        className="h-7 px-2.5 text-[10px] gap-1 bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm"
                      >
                        <CalendarCheck className="h-3 w-3" /> Mark Attendance
                      </Button>
                      <Badge variant="success" className="text-[9px]">
                        {sched.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Attendance & Exams Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Pending Attendance Tasks */}
              <Card className="border-gray-800">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <UserCheck className="h-4 w-4 text-emerald-400" /> Attendance Tasks
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-xs">
                  {(dashboard?.attendanceTasks || []).map((task: any) => (
                    <div
                      key={task.id}
                      className="p-2.5 rounded-xl bg-gray-950/60 border border-gray-800 flex items-center justify-between"
                    >
                      <div>
                        <span className="font-semibold text-white block">{task.className}</span>
                        <span className="text-[10px] text-gray-400 font-mono">{task.date}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Button
                          size="sm"
                          onClick={() => navigate(`/attendance?sectionId=${task.sectionId || ''}&classId=${task.classId || ''}`)}
                          className="h-6 px-2 text-[9px] gap-1 bg-purple-600 hover:bg-purple-500 text-white"
                        >
                          <CalendarCheck className="h-2.5 w-2.5" /> Take Attendance
                        </Button>
                        <Badge variant={task.status === 'COMPLETED' ? 'success' : 'warning'} className="text-[9px]">
                          {task.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Upcoming Exams */}
              <Card className="border-gray-800">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Award className="h-4 w-4 text-amber-400" /> Upcoming Exams
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-xs">
                  {(dashboard?.upcomingExams || []).map((exam: any) => (
                    <div
                      key={exam.id}
                      className="p-2.5 rounded-xl bg-gray-950/60 border border-gray-800 space-y-1"
                    >
                      <span className="font-bold text-white block">{exam.name}</span>
                      <div className="flex justify-between text-gray-400 font-mono text-[10px]">
                        <span>{exam.class}</span>
                        <span>{exam.date}</span>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Assignments & Submissions Desk */}
            <Card className="border-gray-800">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <FileText className="h-4 w-4 text-sky-400" /> Active Course Assignments
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {(dashboard?.activeAssignments || []).map((asgn: any) => (
                  <div
                    key={asgn.id}
                    className="p-3 rounded-2xl bg-gray-950/60 border border-gray-800 flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-bold text-white block">{asgn.title}</span>
                      <span className="text-[10px] text-gray-400">Due: {asgn.dueDate}</span>
                    </div>
                    <Badge variant="purple" className="font-mono text-[10px]">
                      {asgn.totalSubmissions} Submissions
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar Cards: Assigned Classes, Subjects & Announcements */}
          <div className="space-y-6">
            {/* Assigned Classes */}
            <Card className="border-gray-800">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Users className="h-4 w-4 text-purple-400" /> Assigned Classes
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-xs">
                {(dashboard?.assignedClasses || []).map((cls: any) => (
                  <div
                    key={cls.id}
                    className="p-3 rounded-2xl bg-gray-950/60 border border-gray-800 flex items-center justify-between hover:border-purple-500/30 transition-all"
                  >
                    <div className="space-y-0.5">
                      <span className="font-bold text-white block">{cls.name.replace(' (Class Educator)', '')}</span>
                      {cls.name.includes('(Class Educator)') && (
                        <Badge variant="purple" className="text-[9px] gap-1 font-mono">
                          <UserCheck className="h-2.5 w-2.5" /> Class Educator
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => navigate(`/attendance?sectionId=${cls.sectionId || cls.id}&classId=${cls.classId || ''}`)}
                        className="h-6 px-2 text-[9px] gap-1 text-purple-300 hover:text-white"
                      >
                        <CalendarCheck className="h-2.5 w-2.5 text-purple-400" /> Take Roll
                      </Button>
                      <span className="text-purple-300 font-mono text-[10px] shrink-0">{cls.studentCount} Students</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Assigned Subjects */}
            <Card className="border-gray-800">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-sky-400" /> Assigned Subjects
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-xs">
                {(dashboard?.assignedSubjects || []).map((sub) => (
                  <div
                    key={sub.id}
                    className="p-3 rounded-2xl bg-gray-950/60 border border-gray-800 flex items-center justify-between"
                  >
                    <span className="font-bold text-white">{sub.name}</span>
                    <Badge variant="purple" className="font-mono text-[9px]">
                      {sub.code}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* School Announcements */}
            <Card className="border-gray-800">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Megaphone className="h-4 w-4 text-amber-400" /> Faculty Notice Board
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-xs">
                {(dashboard?.announcements || []).map((ann) => (
                  <div key={ann.id} className="p-3 rounded-2xl bg-purple-950/20 border border-purple-800/30 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white text-xs">{ann.title}</span>
                    </div>
                    <p className="text-[11px] text-gray-300 leading-relaxed">{ann.content}</p>
                    <span className="text-[9px] text-gray-500 font-mono block pt-1">
                      Posted by {ann.author} • {ann.date}
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      )}

        {/* SUPER ADMIN FACULTY ROSTER TABLE */}
        {isSuperAdmin && (
          <Card className="border-gray-800 mt-6">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg">Faculty Directory ({teachers.length})</CardTitle>
                <CardDescription className="text-xs">Manage educator profiles, status, and assigned classes</CardDescription>
              </div>

              <Button size="sm" onClick={() => setIsAddTeacherOpen(true)} className="gap-1.5 text-xs">
                <Plus className="h-4 w-4" /> Add Educator
              </Button>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-950/70 text-gray-400 font-semibold border-b border-gray-800">
                    <tr>
                      <th className="p-3">Educator Details</th>
                      <th className="p-3">Employee ID</th>
                      <th className="p-3">Qualification</th>
                      <th className="p-3">Specialization</th>
                      <th className="p-3">Assignments</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800/60">
                    {teachers.map((tch) => (
                      <tr key={tch.id} className="hover:bg-gray-800/30 transition-colors">
                        <td className="p-3 font-bold text-white flex items-center gap-2">
                          <UserCheck className="h-4 w-4 text-purple-400" />
                          <div>
                            <span className="block">{tch.firstName} {tch.lastName}</span>
                            <span className="text-[10px] font-normal text-gray-400">{tch.email}</span>
                          </div>
                        </td>
                        <td className="p-3 font-mono text-purple-300 font-semibold">
                          {tch.teacherProfile?.employeeId || 'TCH-2026-001'}
                        </td>
                        <td className="p-3 text-gray-300">{tch.teacherProfile?.qualification || 'M.Sc. Mathematics'}</td>
                        <td className="p-3 text-gray-300">{tch.teacherProfile?.specialization || 'Algebra & Physics'}</td>
                        <td className="p-3">
                          <Badge variant="purple" className="text-[10px]">
                            {tch.teacherAssignments?.length || 1} Subjects Assigned
                          </Badge>
                        </td>
                        <td className="p-3 text-right">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              updateTeacherMutation.mutate({
                                id: tch.id,
                                data: { isActive: !tch.isActive },
                              })
                            }
                            className={`h-7 px-2 text-[10px] gap-1 ${
                              tch.isActive ? 'text-amber-400' : 'text-emerald-400'
                            }`}
                          >
                            <Power className="h-3 w-3" /> {tch.isActive ? 'Deactivate' : 'Activate'}
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* MODAL 1: Add Teacher Dialog */}
      {isAddTeacherOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-md glass-panel p-6 rounded-3xl border border-purple-500/30 space-y-4 bg-gray-900">
            <div className="flex items-center justify-between border-b border-gray-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <UserCheck className="h-5 w-5 text-purple-400" /> Create Teacher Record
              </h3>
              <button onClick={() => setIsAddTeacherOpen(false)} className="text-gray-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-gray-300 font-medium block">First Name</label>
                  <input
                    type="text"
                    value={newTeacher.firstName}
                    onChange={(e) => setNewTeacher({ ...newTeacher, firstName: e.target.value })}
                    placeholder="Marcus"
                    className="w-full mt-1 px-3 py-2 rounded-xl bg-gray-950 border border-gray-800 text-white text-xs"
                  />
                </div>
                <div>
                  <label className="text-gray-300 font-medium block">Last Name</label>
                  <input
                    type="text"
                    value={newTeacher.lastName}
                    onChange={(e) => setNewTeacher({ ...newTeacher, lastName: e.target.value })}
                    placeholder="Vance"
                    className="w-full mt-1 px-3 py-2 rounded-xl bg-gray-950 border border-gray-800 text-white text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="text-gray-300 font-medium block">Email Address</label>
                <input
                  type="email"
                  value={newTeacher.email}
                  onChange={(e) => setNewTeacher({ ...newTeacher, email: e.target.value })}
                  placeholder="marcus.vance@school.com"
                  className="w-full mt-1 px-3 py-2 rounded-xl bg-gray-950 border border-gray-800 text-white text-xs"
                />
              </div>

              <div>
                <label className="text-gray-300 font-medium block">Phone Number</label>
                <input
                  type="text"
                  value={newTeacher.phone}
                  onChange={(e) => setNewTeacher({ ...newTeacher, phone: e.target.value })}
                  placeholder="+1 555-8822"
                  className="w-full mt-1 px-3 py-2 rounded-xl bg-gray-950 border border-gray-800 text-white text-xs font-mono"
                />
              </div>

              <div>
                <label className="text-gray-300 font-medium block">Highest Qualification</label>
                <input
                  type="text"
                  value={newTeacher.qualification}
                  onChange={(e) => setNewTeacher({ ...newTeacher, qualification: e.target.value })}
                  placeholder="M.Sc. Mathematics"
                  className="w-full mt-1 px-3 py-2 rounded-xl bg-gray-950 border border-gray-800 text-white text-xs"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-gray-800">
              <Button variant="outline" size="sm" onClick={() => setIsAddTeacherOpen(false)}>
                Cancel
              </Button>
              <Button
                size="sm"
                disabled={!newTeacher.firstName || !newTeacher.lastName || !newTeacher.email}
                onClick={() => createTeacherMutation.mutate(newTeacher)}
              >
                Create Educator
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Assign Class & Subject Dialog */}
      {isAssignOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-md glass-panel p-6 rounded-3xl border border-purple-500/30 space-y-4 bg-gray-900">
            <div className="flex items-center justify-between border-b border-gray-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Layers className="h-5 w-5 text-purple-400" /> Assign Class & Subject
              </h3>
              <button onClick={() => setIsAssignOpen(false)} className="text-gray-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-gray-300 font-medium block">Select Teacher</label>
                <select
                  value={assignForm.teacherId}
                  onChange={(e) => setAssignForm({ ...assignForm, teacherId: e.target.value })}
                  className="w-full mt-1 px-3 py-2 rounded-xl bg-gray-950 border border-gray-800 text-white text-xs"
                >
                  <option value="">Select Educator</option>
                  {teachers.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.firstName} {t.lastName} ({t.email})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-gray-300 font-medium block">Select Subject</label>
                <select
                  value={assignForm.subjectId}
                  onChange={(e) => setAssignForm({ ...assignForm, subjectId: e.target.value })}
                  className="w-full mt-1 px-3 py-2 rounded-xl bg-gray-950 border border-gray-800 text-white text-xs"
                >
                  <option value="">Select Subject</option>
                  {subjects.map((sub) => (
                    <option key={sub.id} value={sub.id}>
                      {sub.name} ({sub.code})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-gray-300 font-medium block">Select Class Section</label>
                <select
                  value={assignForm.sectionId}
                  onChange={(e) => setAssignForm({ ...assignForm, sectionId: e.target.value })}
                  className="w-full mt-1 px-3 py-2 rounded-xl bg-gray-950 border border-gray-800 text-white text-xs"
                >
                  <option value="">Select Section</option>
                  {sections.map((sec) => (
                    <option key={sec.id} value={sec.id}>
                      {sec.name} (Section ID: {sec.id})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-gray-800">
              <Button variant="outline" size="sm" onClick={() => setIsAssignOpen(false)}>
                Cancel
              </Button>
              <Button
                size="sm"
                disabled={!assignForm.teacherId || !assignForm.subjectId || !assignForm.sectionId}
                onClick={() => assignClassMutation.mutate(assignForm)}
              >
                Assign Subject
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
