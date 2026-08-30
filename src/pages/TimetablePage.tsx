import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Sidebar } from '../components/layout/Sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { useAuth } from '../context/AuthContext';
import { timetableService } from '../services/timetable.service';
import { structureService } from '../services/structure.service';
import { teacherService } from '../services/teacher.service';
import {
  Calendar,
  Clock,
  Plus,
  Trash2,
  AlertCircle,
  CheckCircle2,
  X,
  UserCheck,
  BookOpen,
  Filter,
} from 'lucide-react';
import type { DayOfWeek } from '../services/timetable.service';

const DAYS: DayOfWeek[] = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];

export const TimetablePage: React.FC = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const isSuperAdmin = user?.role === 'SUPER_ADMIN';

  // Filters State
  const [selectedClassId, setSelectedClassId] = useState('');
  const [selectedSectionId, setSelectedSectionId] = useState('');
  const [selectedTeacherId, setSelectedTeacherId] = useState('');

  // Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Form State
  const [form, setForm] = useState({
    dayOfWeek: 'MONDAY' as DayOfWeek,
    startTime: '08:00',
    endTime: '09:00',
    classId: '',
    sectionId: '',
    subjectId: '',
    teacherId: '',
    roomNumber: 'Room 101',
  });

  const [feedbackMsg, setFeedbackMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Queries
  const { data: timetables = [] } = useQuery({
    queryKey: ['timetableList', selectedClassId, selectedSectionId, selectedTeacherId],
    queryFn: () =>
      timetableService.getTimetables({
        classId: selectedClassId || undefined,
        sectionId: selectedSectionId || undefined,
        teacherId: selectedTeacherId || undefined,
      }),
  });

  const { data: classes = [] } = useQuery({
    queryKey: ['classesTimetable'],
    queryFn: structureService.getClasses,
  });

  const { data: allSections = [] } = useQuery({
    queryKey: ['sectionsTimetable'],
    queryFn: structureService.getSections,
  });

  const { data: allSubjects = [] } = useQuery({
    queryKey: ['subjectsTimetable'],
    queryFn: structureService.getSubjects,
  });

  const { data: teachers = [] } = useQuery({
    queryKey: ['teachersTimetable'],
    queryFn: teacherService.getTeachers,
  });

  const modalSections = (allSections as any[]).filter(
    (sec) => !form.classId || sec.classId === form.classId
  );
  const modalSubjects = (allSubjects as any[]).filter(
    (sub) => !form.classId || sub.classId === form.classId
  );

  const filterSections = (allSections as any[]).filter(
    (sec) => !selectedClassId || sec.classId === selectedClassId
  );

  // Mutations
  const createMutation = useMutation({
    mutationFn: timetableService.createTimetableEntry,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['timetableList'] });
      setIsCreateModalOpen(false);
      setFeedbackMsg('Timetable slot scheduled successfully with conflict checks verified!');
      setErrorMsg('');
    },
    onError: (err: any) => {
      setErrorMsg(err?.response?.data?.message || err.message || 'Failed to schedule timetable slot.');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: timetableService.deleteTimetableEntry,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['timetableList'] });
      setFeedbackMsg('Timetable slot removed.');
      setErrorMsg('');
    },
    onError: (err: any) => {
      setErrorMsg(err?.response?.data?.message || err.message || 'Failed to delete entry.');
    },
  });

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <Sidebar />

      <div className="flex-1 space-y-6">
        {/* Banner */}
        <div className="glass-panel p-6 rounded-3xl border border-indigo-500/20 bg-gradient-to-r from-indigo-950/40 via-gray-900/60 to-purple-950/40">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <Badge variant="purple" className="mb-2 gap-1.5 font-mono">
                <Calendar className="h-3.5 w-3.5 text-indigo-400" /> Phase 12 Class & Teacher Timetable
              </Badge>
              <h2 className="text-2xl font-extrabold text-white">Weekly Academic Timetable</h2>
              <p className="text-xs text-gray-400 mt-1">
                Automated scheduling conflict engine for teachers, classrooms, and student sections.
              </p>
            </div>

            {isSuperAdmin && (
              <Button size="sm" onClick={() => setIsCreateModalOpen(true)} className="gap-1.5 text-xs">
                <Plus className="h-4 w-4" /> Schedule Class Slot
              </Button>
            )}
          </div>
        </div>

        {/* Notifications */}
        {feedbackMsg && (
          <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 shrink-0" /> {feedbackMsg}
          </div>
        )}

        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" /> {errorMsg}
          </div>
        )}

        {/* Filters Bar for Super Admin / Viewers */}
        <Card className="border-gray-800 bg-gray-900/60 p-4">
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <span className="text-gray-400 font-medium flex items-center gap-1">
              <Filter className="h-3.5 w-3.5 text-purple-400" /> Filter View:
            </span>

            <select
              value={selectedClassId}
              onChange={(e) => {
                setSelectedClassId(e.target.value);
                setSelectedSectionId('');
              }}
              className="px-3 py-1.5 rounded-xl bg-gray-950 border border-gray-800 text-white"
            >
              <option value="">All Classes</option>
              {(classes as any[]).map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>

            <select
              value={selectedSectionId}
              onChange={(e) => setSelectedSectionId(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-gray-950 border border-gray-800 text-white"
            >
              <option value="">All Sections</option>
              {filterSections.map((sec: any) => (
                <option key={sec.id} value={sec.id}>
                  Section {sec.name}
                </option>
              ))}
            </select>

            {isSuperAdmin && (
              <select
                value={selectedTeacherId}
                onChange={(e) => setSelectedTeacherId(e.target.value)}
                className="px-3 py-1.5 rounded-xl bg-gray-950 border border-gray-800 text-white"
              >
                <option value="">All Teachers</option>
                {(teachers as any[]).map((t: any) => (
                  <option key={t.id} value={t.id}>
                    {t.firstName} {t.lastName} ({t.teacherProfile?.employeeId || 'Teacher'})
                  </option>
                ))}
              </select>
            )}

            {(selectedClassId || selectedSectionId || selectedTeacherId) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSelectedClassId('');
                  setSelectedSectionId('');
                  setSelectedTeacherId('');
                }}
                className="h-7 text-[10px] text-gray-400 hover:text-white"
              >
                Clear Filters
              </Button>
            )}
          </div>
        </Card>

        {/* Visual Weekly Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {DAYS.map((day) => {
            const dayEntries = timetables.filter((t) => t.dayOfWeek === day);

            return (
              <Card key={day} className="border-gray-800 bg-gray-900/40 flex flex-col justify-between">
                <CardHeader className="pb-3 border-b border-gray-800/60 bg-gray-950/40 rounded-t-xl">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-bold text-white tracking-wide uppercase font-mono">
                      {day}
                    </CardTitle>
                    <Badge variant="purple" className="text-[10px]">
                      {dayEntries.length} Periods
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="p-3 space-y-2.5 min-h-48">
                  {dayEntries.length === 0 ? (
                    <div className="h-40 flex flex-col items-center justify-center text-center text-gray-500">
                      <Clock className="h-6 w-6 mb-1 opacity-30 text-purple-400" />
                      <p className="text-[11px] italic">No periods scheduled for {day}</p>
                    </div>
                  ) : (
                    dayEntries.map((entry) => (
                      <div
                        key={entry.id}
                        className="p-3 rounded-2xl bg-gradient-to-r from-purple-950/30 to-indigo-950/30 border border-purple-500/20 hover:border-purple-500/40 transition-all space-y-2 relative group"
                      >
                        <div className="flex items-start justify-between">
                          <span className="text-[11px] font-mono font-bold text-amber-400 flex items-center gap-1">
                            <Clock className="h-3 w-3 text-amber-400" /> {entry.startTime} - {entry.endTime}
                          </span>
                          <Badge variant="info" className="text-[9px]">
                            {entry.roomNumber}
                          </Badge>
                        </div>

                        <div>
                          <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                            <BookOpen className="h-3.5 w-3.5 text-purple-400" />
                            {entry.subject?.name} ({entry.subject?.code})
                          </h4>
                          <p className="text-[10px] text-gray-300 mt-0.5 font-mono">
                            {entry.class?.name} • Section {entry.section?.name}
                          </p>
                        </div>

                        <div className="flex items-center justify-between pt-1 border-t border-purple-900/30 text-[10px] text-gray-400">
                          <span className="flex items-center gap-1 text-purple-300 font-medium">
                            <UserCheck className="h-3 w-3 text-indigo-400" />
                            {entry.teacher?.firstName} {entry.teacher?.lastName}
                          </span>

                          {isSuperAdmin && (
                            <button
                              onClick={() => deleteMutation.mutate(entry.id)}
                              className="text-gray-500 hover:text-rose-400 transition-colors p-1"
                              title="Delete schedule entry"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* MODAL: Schedule Timetable Slot */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg glass-panel p-6 rounded-3xl border border-purple-500/30 space-y-4 bg-gray-900">
            <div className="flex items-center justify-between border-b border-gray-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Calendar className="h-5 w-5 text-purple-400" /> Schedule Class Period Slot
              </h3>
              <button onClick={() => setIsCreateModalOpen(false)} className="text-gray-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-gray-300 font-medium block">Day of Week</label>
                  <select
                    value={form.dayOfWeek}
                    onChange={(e) => setForm({ ...form, dayOfWeek: e.target.value as DayOfWeek })}
                    className="w-full mt-1 px-3 py-2 rounded-xl bg-gray-950 border border-gray-800 text-white"
                  >
                    {DAYS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-gray-300 font-medium block">Start Time (HH:mm)</label>
                  <input
                    type="text"
                    placeholder="08:00"
                    value={form.startTime}
                    onChange={(e) => setForm({ ...form, startTime: e.target.value })}
                    className="w-full mt-1 px-3 py-2 rounded-xl bg-gray-950 border border-gray-800 text-white font-mono"
                  />
                </div>

                <div>
                  <label className="text-gray-300 font-medium block">End Time (HH:mm)</label>
                  <input
                    type="text"
                    placeholder="09:00"
                    value={form.endTime}
                    onChange={(e) => setForm({ ...form, endTime: e.target.value })}
                    className="w-full mt-1 px-3 py-2 rounded-xl bg-gray-950 border border-gray-800 text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-gray-300 font-medium block">Class</label>
                  <select
                    value={form.classId}
                    onChange={(e) => setForm({ ...form, classId: e.target.value, sectionId: '', subjectId: '' })}
                    className="w-full mt-1 px-3 py-2 rounded-xl bg-gray-950 border border-gray-800 text-white"
                  >
                    <option value="">Select Class</option>
                    {(classes as any[]).map((c: any) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-gray-300 font-medium block">Section</label>
                  <select
                    value={form.sectionId}
                    onChange={(e) => setForm({ ...form, sectionId: e.target.value })}
                    disabled={!form.classId}
                    className="w-full mt-1 px-3 py-2 rounded-xl bg-gray-950 border border-gray-800 text-white"
                  >
                    <option value="">Select Section</option>
                    {modalSections.map((sec: any) => (
                      <option key={sec.id} value={sec.id}>
                        Section {sec.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-gray-300 font-medium block">Subject</label>
                  <select
                    value={form.subjectId}
                    onChange={(e) => setForm({ ...form, subjectId: e.target.value })}
                    disabled={!form.classId}
                    className="w-full mt-1 px-3 py-2 rounded-xl bg-gray-950 border border-gray-800 text-white"
                  >
                    <option value="">Select Subject</option>
                    {modalSubjects.map((sub: any) => (
                      <option key={sub.id} value={sub.id}>
                        {sub.name} ({sub.code})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-gray-300 font-medium block">Assigned Teacher</label>
                  <select
                    value={form.teacherId}
                    onChange={(e) => setForm({ ...form, teacherId: e.target.value })}
                    className="w-full mt-1 px-3 py-2 rounded-xl bg-gray-950 border border-gray-800 text-white"
                  >
                    <option value="">Select Teacher</option>
                    {(teachers as any[]).map((t: any) => (
                      <option key={t.id} value={t.id}>
                        {t.firstName} {t.lastName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-gray-300 font-medium block">Room Number / Lab Name</label>
                <input
                  type="text"
                  placeholder="e.g. Room 101 or Computer Lab 2"
                  value={form.roomNumber}
                  onChange={(e) => setForm({ ...form, roomNumber: e.target.value })}
                  className="w-full mt-1 px-3 py-2 rounded-xl bg-gray-950 border border-gray-800 text-white"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-gray-800">
              <Button variant="outline" size="sm" onClick={() => setIsCreateModalOpen(false)}>
                Cancel
              </Button>
              <Button
                size="sm"
                disabled={
                  !form.classId ||
                  !form.sectionId ||
                  !form.subjectId ||
                  !form.teacherId ||
                  !form.roomNumber ||
                  createMutation.isPending
                }
                onClick={() => createMutation.mutate(form)}
              >
                Schedule Period
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
