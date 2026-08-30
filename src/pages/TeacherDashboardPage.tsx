import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Sidebar } from '../components/layout/Sidebar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { useAuth } from '../context/AuthContext';
import { teacherService } from '../services/teacher.service';
import { structureService } from '../services/structure.service';
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
} from 'lucide-react';

export const TeacherDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const isSuperAdmin = user?.role === 'SUPER_ADMIN' || user?.role === 'ADMISSION_ADMIN';

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
  });

  const { data: teachers = [] } = useQuery({
    queryKey: ['teachers'],
    queryFn: teacherService.getTeachers,
    enabled: isSuperAdmin,
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
                <UserCheck className="h-3.5 w-3.5" /> Phase 6 Faculty & Academic Portal
              </Badge>
              <h2 className="text-2xl font-extrabold text-white">
                {isSuperAdmin ? 'Faculty Administration Desk' : 'Teacher Academic Workbench'}
              </h2>
              <p className="text-xs text-gray-400 mt-1">
                {isSuperAdmin
                  ? 'Manage teacher profiles, section placements, subject mappings, and access scopes.'
                  : `Welcome back, Professor ${user?.firstName || ''}. View today's schedule, classes, and exams.`}
              </p>
            </div>

            {isSuperAdmin && (
              <div className="flex flex-wrap gap-2">
                <Button size="sm" onClick={() => setIsAddTeacherOpen(true)} className="gap-1.5 text-xs">
                  <Plus className="h-4 w-4" /> Add New Educator
                </Button>

                <Button size="sm" variant="outline" onClick={() => setIsAssignOpen(true)} className="gap-1.5 text-xs">
                  <Layers className="h-4 w-4 text-purple-400" /> Assign Class & Subject
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* TEACHER DASHBOARD PANELS */}
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
                {(dashboard?.todaySchedule || []).map((sched) => (
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

                    <Badge variant="success" className="text-[9px]">
                      {sched.status}
                    </Badge>
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
                  {(dashboard?.attendanceTasks || []).map((task) => (
                    <div
                      key={task.id}
                      className="p-2.5 rounded-xl bg-gray-950/60 border border-gray-800 flex items-center justify-between"
                    >
                      <span className="font-semibold text-white">{task.className}</span>
                      <Badge variant={task.status === 'COMPLETED' ? 'success' : 'warning'} className="text-[9px]">
                        {task.status}
                      </Badge>
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
                  {(dashboard?.upcomingExams || []).map((exam) => (
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
                {(dashboard?.activeAssignments || []).map((asgn) => (
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
                {(dashboard?.assignedClasses || []).map((cls) => (
                  <div
                    key={cls.id}
                    className="p-3 rounded-2xl bg-gray-950/60 border border-gray-800 flex items-center justify-between"
                  >
                    <span className="font-bold text-white">{cls.name}</span>
                    <span className="text-purple-300 font-mono text-[10px]">{cls.studentCount} Students</span>
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
