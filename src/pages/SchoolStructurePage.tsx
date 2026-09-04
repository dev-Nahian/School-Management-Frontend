import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Sidebar } from '../components/layout/Sidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { structureService } from '../services/structure.service';
import { teacherService } from '../services/teacher.service';
import { 
  Calendar, 
  Layers, 
  BookOpen, 
  UserCheck, 
  Plus, 
  Star, 
  School,
  X,
  PlusCircle,
  Trash2
} from 'lucide-react';
import type { SubjectType } from '../types/structure';

export const SchoolStructurePage: React.FC = () => {
  const { user } = useAuth();
  const toast = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<'years' | 'classes' | 'subjects' | 'assignments'>('classes');

  // Modal Dialog States
  const [isClassModalOpen, setIsClassModalOpen] = useState(false);
  const [isSectionModalOpen, setIsSectionModalOpen] = useState(false);
  const [isSubjectModalOpen, setIsSubjectModalOpen] = useState(false);
  const [isYearModalOpen, setIsYearModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);

  // Form Field States
  // Class Form
  const [className, setClassName] = useState('');
  const [classCode, setClassCode] = useState('');

  // Section Form
  const [secName, setSecName] = useState('');
  const [secCapacity, setSecCapacity] = useState('40');
  const [selectedClassIdForSec, setSelectedClassIdForSec] = useState('');
  const [selectedYearIdForSec, setSelectedYearIdForSec] = useState('');

  // Subject Form
  const [subName, setSubName] = useState('');
  const [subCode, setSubCode] = useState('');
  const [subType, setSubType] = useState<SubjectType>('CORE');
  const [subClassId, setSubClassId] = useState('');

  // Year Form
  const [yearName, setYearName] = useState('');
  const [yearStartDate, setYearStartDate] = useState('');
  const [yearEndDate, setYearEndDate] = useState('');
  const [yearIsCurrent, setYearIsCurrent] = useState(false);

  // Assign Teacher Form
  const [assignTeacherId, setAssignTeacherId] = useState('');
  const [assignSubjectId, setAssignSubjectId] = useState('');
  const [assignSectionId, setAssignSectionId] = useState('');

  const isSuperAdmin = user?.role === 'SUPER_ADMIN' || user?.role === 'ADMISSION_ADMIN';

  // React Queries
  const { data: years = [] } = useQuery({
    queryKey: ['academicYears'],
    queryFn: structureService.getAcademicYears,
  });

  const { data: classes = [] } = useQuery({
    queryKey: ['classes'],
    queryFn: structureService.getClasses,
  });

  const { data: sections = [] } = useQuery({
    queryKey: ['sections'],
    queryFn: structureService.getSections,
  });

  const { data: subjects = [] } = useQuery({
    queryKey: ['subjects'],
    queryFn: structureService.getSubjects,
  });

  const { data: assignments = [] } = useQuery({
    queryKey: ['teacherAssignments'],
    queryFn: structureService.getTeacherAssignments,
  });

  const { data: teachers = [] } = useQuery({
    queryKey: ['teachers'],
    queryFn: teacherService.getTeachers,
  });

  // Mutations
  const setYearCurrentMutation = useMutation({
    mutationFn: structureService.setCurrentAcademicYear,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['academicYears'] });
      toast.success('Active Academic Year Updated', 'Current academic year set successfully.');
    },
    onError: (err: any) => {
      toast.error('Failed to update year', err?.response?.data?.message || 'Error occurred');
    },
  });

  const createClassMutation = useMutation({
    mutationFn: structureService.createClass,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['classes'] });
      setIsClassModalOpen(false);
      setClassName('');
      setClassCode('');
      toast.success('Class Created', 'New academic class registered successfully.');
    },
    onError: (err: any) => {
      toast.error('Failed to create class', err?.response?.data?.message || 'Error occurred');
    },
  });

  const deleteClassMutation = useMutation({
    mutationFn: structureService.deleteClass,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['classes'] });
      toast.success('Class Deleted', 'Class removed from school catalog.');
    },
    onError: (err: any) => {
      toast.error('Failed to delete class', err?.response?.data?.message || 'Error occurred');
    },
  });

  const createSectionMutation = useMutation({
    mutationFn: structureService.createSection,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sections'] });
      setIsSectionModalOpen(false);
      setSecName('');
      toast.success('Section Created', 'New class section added successfully.');
    },
    onError: (err: any) => {
      toast.error('Failed to create section', err?.response?.data?.message || 'Error occurred');
    },
  });

  const deleteSectionMutation = useMutation({
    mutationFn: structureService.deleteSection,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sections'] });
      toast.success('Section Deleted', 'Section removed successfully.');
    },
    onError: (err: any) => {
      toast.error('Failed to delete section', err?.response?.data?.message || 'Error occurred');
    },
  });

  const createSubjectMutation = useMutation({
    mutationFn: structureService.createSubject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subjects'] });
      setIsSubjectModalOpen(false);
      setSubName('');
      setSubCode('');
      toast.success('Subject Registered', 'New academic subject saved successfully.');
    },
    onError: (err: any) => {
      toast.error('Failed to register subject', err?.response?.data?.message || 'Error occurred');
    },
  });

  const deleteSubjectMutation = useMutation({
    mutationFn: structureService.deleteSubject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subjects'] });
      toast.success('Subject Deleted', 'Subject removed from curriculum directory.');
    },
    onError: (err: any) => {
      toast.error('Failed to delete subject', err?.response?.data?.message || 'Error occurred');
    },
  });

  const createYearMutation = useMutation({
    mutationFn: structureService.createAcademicYear,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['academicYears'] });
      setIsYearModalOpen(false);
      setYearName('');
      setYearStartDate('');
      setYearEndDate('');
      toast.success('Academic Year Added', 'New academic session registered successfully.');
    },
    onError: (err: any) => {
      toast.error('Failed to add academic year', err?.response?.data?.message || 'Error occurred');
    },
  });

  const deleteYearMutation = useMutation({
    mutationFn: structureService.deleteAcademicYear,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['academicYears'] });
      toast.success('Academic Session Deleted', 'Academic session removed successfully.');
    },
    onError: (err: any) => {
      toast.error('Failed to delete academic session', err?.response?.data?.message || 'Error occurred');
    },
  });

  const assignTeacherMutation = useMutation({
    mutationFn: structureService.assignSubjectTeacher,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teacherAssignments'] });
      setIsAssignModalOpen(false);
      setAssignTeacherId('');
      setAssignSubjectId('');
      setAssignSectionId('');
      toast.success('Teacher Assigned', 'Teacher assigned to subject and section successfully.');
    },
    onError: (err: any) => {
      toast.error('Failed to assign teacher', err?.response?.data?.message || 'Error occurred');
    },
  });

  const deleteAssignmentMutation = useMutation({
    mutationFn: structureService.deleteTeacherAssignment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teacherAssignments'] });
      toast.success('Assignment Removed', 'Teacher subject assignment deleted.');
    },
    onError: (err: any) => {
      toast.error('Failed to remove assignment', err?.response?.data?.message || 'Error occurred');
    },
  });

  // Helper trigger to open Year Modal with default start/end dates
  const handleOpenYearModal = () => {
    const todayStr = new Date().toISOString().split('T')[0];
    const nextYr = new Date();
    nextYr.setFullYear(nextYr.getFullYear() + 1);
    const nextYrStr = nextYr.toISOString().split('T')[0];

    setYearStartDate(todayStr);
    setYearEndDate(nextYrStr);
    setIsYearModalOpen(true);
  };

  // Helper trigger to open Section Modal for a specific Class
  const handleOpenSectionModal = (classId?: string) => {
    if (classId) setSelectedClassIdForSec(classId);
    else if (classes.length > 0) setSelectedClassIdForSec(classes[0].id);
    
    if (years.length > 0) {
      const activeY = years.find((y) => y.isCurrent) || years[0];
      setSelectedYearIdForSec(activeY.id);
    }
    setIsSectionModalOpen(true);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 w-full">
      <Sidebar />

      <div className="flex-1 space-y-6 min-w-0">
        {/* Header Panel */}
        <div className="glass-panel p-6 rounded-3xl border border-purple-500/20 bg-gradient-to-r from-purple-900/30 via-gray-900/40 to-indigo-900/20">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <Badge variant="purple" className="mb-2 gap-1.5 font-mono">
                <School className="h-3.5 w-3.5" /> Phase 3 Academic Infrastructure
              </Badge>
              <h2 className="text-2xl font-extrabold text-white">
                School Structure & Academic Catalog
              </h2>
              <p className="text-xs text-gray-400 mt-1">
                Configure Academic Years, Classes, Sections, Core/Elective Subjects, and Subject Teacher Assignments.
              </p>
            </div>

            {isSuperAdmin && (
              <div className="flex flex-wrap gap-2">
                <Button size="sm" onClick={() => setIsClassModalOpen(true)} className="gap-1.5 text-xs">
                  <Plus className="h-4 w-4" /> Add Class
                </Button>

                <Button size="sm" variant="outline" onClick={() => handleOpenSectionModal()} className="gap-1.5 text-xs">
                  <PlusCircle className="h-4 w-4" /> Add Section
                </Button>

                <Button size="sm" variant="outline" onClick={() => setIsSubjectModalOpen(true)} className="gap-1.5 text-xs">
                  <BookOpen className="h-4 w-4" /> Add Subject
                </Button>

                <Button size="sm" variant="outline" onClick={() => handleOpenYearModal()} className="gap-1.5 text-xs">
                  <Calendar className="h-4 w-4" /> Add Session
                </Button>

                <Button size="sm" variant="primary" onClick={() => setIsAssignModalOpen(true)} className="gap-1.5 text-xs">
                  <UserCheck className="h-4 w-4" /> Assign Teacher
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Custom Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-gray-800 pb-3 overflow-x-auto">
          <button
            onClick={() => setActiveTab('classes')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'classes'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
            }`}
          >
            <Layers className="h-4 w-4" /> Classes & Sections ({classes.length})
          </button>

          <button
            onClick={() => setActiveTab('subjects')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'subjects'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
            }`}
          >
            <BookOpen className="h-4 w-4" /> Subjects Catalog ({subjects.length})
          </button>

          <button
            onClick={() => setActiveTab('assignments')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'assignments'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
            }`}
          >
            <UserCheck className="h-4 w-4" /> Teacher Assignments ({assignments.length})
          </button>

          <button
            onClick={() => setActiveTab('years')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'years'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
            }`}
          >
            <Calendar className="h-4 w-4" /> Academic Years ({years.length})
          </button>
        </div>

        {/* TAB 1: Classes & Sections View */}
        {activeTab === 'classes' && (
          <div className="space-y-4">
            {classes.length === 0 ? (
              <div className="p-12 text-center glass-panel rounded-3xl border border-gray-800 space-y-3">
                <Layers className="h-10 w-10 text-purple-400 mx-auto opacity-50" />
                <h3 className="text-base font-bold text-white">No Classes Registered Yet</h3>
                <p className="text-xs text-gray-400 max-w-sm mx-auto">
                  Get started by adding academic classes (e.g. Grade 1, Grade 8, Grade 10) to build your school structure.
                </p>
                {isSuperAdmin && (
                  <Button size="sm" onClick={() => setIsClassModalOpen(true)} className="gap-1.5 mt-2">
                    <Plus className="h-4 w-4" /> Add First Class
                  </Button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {classes.map((cls) => {
                  const clsSections = sections.filter((sec) => sec.classId === cls.id);
                  const clsSubjects = subjects.filter((sub) => sub.classId === cls.id || !sub.classId);

                  return (
                    <Card key={cls.id} className="border-gray-800 hover:border-purple-500/40 transition-all flex flex-col justify-between">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <Badge variant="purple" className="font-mono text-[10px]">
                            {cls.code}
                          </Badge>
                          <div className="flex items-center gap-2">
                            <Badge variant="success" className="text-[9px]">
                              Active
                            </Badge>
                            {isSuperAdmin && (
                              <button
                                onClick={() => {
                                  if (confirm(`Are you sure you want to delete class "${cls.name}"?`)) {
                                    deleteClassMutation.mutate(cls.id);
                                  }
                                }}
                                title="Delete Class"
                                className="text-gray-500 hover:text-rose-400 p-1 rounded transition-colors"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            )}
                          </div>
                        </div>
                        <CardTitle className="text-lg font-bold text-white mt-1">{cls.name}</CardTitle>
                        <CardDescription className="text-xs">Display Order: {cls.displayOrder}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4 flex-1">
                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-[11px] font-semibold text-purple-300 uppercase tracking-wider">
                              Assigned Sections ({clsSections.length})
                            </span>
                            {isSuperAdmin && (
                              <button
                                onClick={() => handleOpenSectionModal(cls.id)}
                                className="text-[10px] text-purple-400 hover:text-purple-300 font-bold flex items-center gap-0.5"
                              >
                                <Plus className="h-3 w-3" /> Add Section
                              </button>
                            )}
                          </div>
                          {clsSections.length === 0 ? (
                            <p className="text-xs text-gray-500 italic">No sections created yet.</p>
                          ) : (
                            <div className="flex flex-wrap gap-1.5">
                              {clsSections.map((sec) => (
                                <div
                                  key={sec.id}
                                  className="px-2.5 py-1 rounded-lg bg-purple-500/10 border border-purple-500/20 text-xs text-purple-200 flex items-center gap-1.5 font-mono"
                                >
                                  <span>{sec.name}</span>
                                  <span className="text-[9px] text-gray-400">({sec.capacity} max)</span>
                                  {isSuperAdmin && (
                                    <button
                                      onClick={() => {
                                        if (confirm(`Delete section "${sec.name}"?`)) {
                                          deleteSectionMutation.mutate(sec.id);
                                        }
                                      }}
                                      className="text-gray-400 hover:text-rose-400 ml-0.5"
                                    >
                                      <X className="h-3 w-3" />
                                    </button>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        <div className="pt-2 border-t border-gray-800/80">
                          <span className="text-[11px] font-semibold text-sky-300 uppercase tracking-wider block mb-1.5">
                            Curriculum Subjects ({clsSubjects.length})
                          </span>
                          {clsSubjects.length === 0 ? (
                            <p className="text-xs text-gray-500 italic">No subjects assigned.</p>
                          ) : (
                            <div className="flex flex-wrap gap-1">
                              {clsSubjects.map((sub) => (
                                <Badge key={sub.id} variant="info" className="text-[10px]">
                                  {sub.name}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: Subjects Catalog */}
        {activeTab === 'subjects' && (
          <Card className="border-gray-800">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg">Curriculum Subjects Directory</CardTitle>
                <CardDescription>All registered academic subjects categorized by type</CardDescription>
              </div>
              {isSuperAdmin && (
                <Button size="sm" onClick={() => setIsSubjectModalOpen(true)} className="gap-1.5 text-xs">
                  <Plus className="h-4 w-4" /> Add Subject
                </Button>
              )}
            </CardHeader>
            <CardContent>
              {subjects.length === 0 ? (
                <div className="p-8 text-center text-gray-400 text-xs italic">
                  No subjects registered yet. Click "Add Subject" to add your curriculum subjects.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-gray-950/60 text-gray-400 font-semibold border-b border-gray-800">
                      <tr>
                        <th className="p-3">Subject Name</th>
                        <th className="p-3">Subject Code</th>
                        <th className="p-3">Subject Type</th>
                        <th className="p-3">Assigned Class</th>
                        <th className="p-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800/60">
                      {subjects.map((sub) => (
                        <tr key={sub.id} className="hover:bg-gray-800/30 transition-colors">
                          <td className="p-3 font-bold text-white flex items-center gap-2">
                            <BookOpen className="h-4 w-4 text-purple-400" />
                            {sub.name}
                          </td>
                          <td className="p-3 font-mono text-purple-300">{sub.code}</td>
                          <td className="p-3">
                            <Badge variant={sub.type === 'CORE' ? 'purple' : 'info'} className="text-[10px]">
                              {sub.type}
                            </Badge>
                          </td>
                          <td className="p-3 text-gray-300">{sub.class?.name || 'All Classes'}</td>
                          <td className="p-3 text-right">
                            {isSuperAdmin && (
                              <button
                                onClick={() => {
                                  if (confirm(`Delete subject "${sub.name}"?`)) {
                                    deleteSubjectMutation.mutate(sub.id);
                                  }
                                }}
                                className="text-gray-400 hover:text-rose-400 p-1.5 rounded-lg hover:bg-rose-500/10 transition-all"
                                title="Delete Subject"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* TAB 3: Teacher Assignments */}
        {activeTab === 'assignments' && (
          <Card className="border-gray-800">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg">Teacher Subject Assignment Matrix</CardTitle>
                <CardDescription>Mapped educators for class sections and specific subjects</CardDescription>
              </div>
              {isSuperAdmin && (
                <Button size="sm" onClick={() => setIsAssignModalOpen(true)} className="gap-1.5 text-xs">
                  <UserCheck className="h-4 w-4" /> Assign Teacher
                </Button>
              )}
            </CardHeader>
            <CardContent>
              {assignments.length === 0 ? (
                <div className="p-8 text-center text-gray-400 text-xs italic">
                  No teacher assignments found. Click "Assign Teacher" to map teachers to class sections and subjects.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-gray-950/60 text-gray-400 font-semibold border-b border-gray-800">
                      <tr>
                        <th className="p-3">Educator Name</th>
                        <th className="p-3">Subject</th>
                        <th className="p-3">Class & Section</th>
                        <th className="p-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800/60">
                      {assignments.map((ta) => (
                        <tr key={ta.id} className="hover:bg-gray-800/30 transition-colors">
                          <td className="p-3 font-bold text-white flex items-center gap-2">
                            <UserCheck className="h-4 w-4 text-emerald-400" />
                            {ta.teacher ? `${ta.teacher.firstName} ${ta.teacher.lastName}` : 'Teacher'}
                          </td>
                          <td className="p-3 text-purple-300 font-medium">{ta.subject?.name || 'Subject'}</td>
                          <td className="p-3 font-mono text-gray-300">
                            {ta.section?.class?.name || 'Class'} - {ta.section?.name || 'Section'}
                          </td>
                          <td className="p-3 text-right">
                            {isSuperAdmin && (
                              <button
                                onClick={() => {
                                  if (confirm('Delete teacher assignment?')) {
                                    deleteAssignmentMutation.mutate(ta.id);
                                  }
                                }}
                                className="text-gray-400 hover:text-rose-400 p-1.5 rounded-lg hover:bg-rose-500/10 transition-all"
                                title="Remove Assignment"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* TAB 4: Academic Years */}
        {activeTab === 'years' && (
          <Card className="border-gray-800">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg">Academic Years & Terms</CardTitle>
                <CardDescription>Active and upcoming institutional sessions</CardDescription>
              </div>
              {isSuperAdmin && (
                <Button size="sm" onClick={() => handleOpenYearModal()} className="gap-1.5 text-xs">
                  <Calendar className="h-4 w-4" /> Add Academic Session
                </Button>
              )}
            </CardHeader>
            <CardContent>
              {years.length === 0 ? (
                <div className="p-8 text-center text-gray-400 text-xs italic">
                  No academic sessions registered. Click "Add Academic Session" to configure a session (e.g. 2026-2027).
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {years.map((ay) => (
                    <div
                      key={ay.id}
                      className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                        ay.isCurrent
                          ? 'bg-purple-500/10 border-purple-500/40'
                          : 'bg-gray-950/60 border-gray-800'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-5 w-5 text-purple-400" />
                          <span className="text-base font-extrabold text-white">{ay.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {ay.isCurrent ? (
                            <Badge variant="purple" className="gap-1 font-mono text-[10px]">
                              <Star className="h-3 w-3 fill-purple-300 text-purple-300" /> Active Session
                            </Badge>
                          ) : (
                            isSuperAdmin && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setYearCurrentMutation.mutate(ay.id)}
                                className="text-[10px] h-7 px-2.5"
                              >
                                Set Active
                              </Button>
                            )
                          )}
                          {isSuperAdmin && (
                            <button
                              onClick={() => {
                                if (confirm(`Delete session "${ay.name}"?`)) {
                                  deleteYearMutation.mutate(ay.id);
                                }
                              }}
                              className="text-gray-500 hover:text-rose-400 p-1 rounded transition-colors"
                              title="Delete Session"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </div>
                      <div className="mt-3 flex items-center justify-between text-xs text-gray-400 font-mono">
                        <span>Start: {new Date(ay.startDate).toLocaleDateString()}</span>
                        <span>End: {new Date(ay.endDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* MODAL 1: Create Class Dialog */}
      {isClassModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fade-in">
          <div className="w-full max-w-md glass-panel p-6 rounded-3xl border border-purple-500/30 space-y-4 bg-gray-900 shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Layers className="h-5 w-5 text-purple-400" /> Add New Academic Class
              </h3>
              <button onClick={() => setIsClassModalOpen(false)} className="text-gray-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs text-gray-300 font-medium">Class Name</label>
                <input
                  type="text"
                  value={className}
                  onChange={(e) => setClassName(e.target.value)}
                  placeholder="e.g. Grade 8, Grade 10"
                  className="w-full mt-1 px-3 py-2 rounded-xl bg-gray-950 border border-gray-800 text-white text-xs focus:border-purple-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs text-gray-300 font-medium">Class Code</label>
                <input
                  type="text"
                  value={classCode}
                  onChange={(e) => setClassCode(e.target.value)}
                  placeholder="e.g. G8, G10"
                  className="w-full mt-1 px-3 py-2 rounded-xl bg-gray-950 border border-gray-800 text-white text-xs focus:border-purple-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-gray-800">
              <Button variant="outline" size="sm" onClick={() => setIsClassModalOpen(false)}>
                Cancel
              </Button>
              <Button
                size="sm"
                disabled={!className || !classCode || createClassMutation.isPending}
                onClick={() => createClassMutation.mutate({ name: className, code: classCode })}
              >
                {createClassMutation.isPending ? 'Creating...' : 'Create Class'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Create Section Dialog */}
      {isSectionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fade-in">
          <div className="w-full max-w-md glass-panel p-6 rounded-3xl border border-purple-500/30 space-y-4 bg-gray-900 shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <PlusCircle className="h-5 w-5 text-purple-400" /> Add Class Section
              </h3>
              <button onClick={() => setIsSectionModalOpen(false)} className="text-gray-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs text-gray-300 font-medium">Target Class</label>
                <select
                  value={selectedClassIdForSec}
                  onChange={(e) => setSelectedClassIdForSec(e.target.value)}
                  className="w-full mt-1 px-3 py-2 rounded-xl bg-gray-950 border border-gray-800 text-white text-xs focus:border-purple-500 focus:outline-none"
                >
                  <option value="">-- Select Class --</option>
                  {classes.map((cls) => (
                    <option key={cls.id} value={cls.id}>
                      {cls.name} ({cls.code})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs text-gray-300 font-medium">Academic Session</label>
                <select
                  value={selectedYearIdForSec}
                  onChange={(e) => setSelectedYearIdForSec(e.target.value)}
                  className="w-full mt-1 px-3 py-2 rounded-xl bg-gray-950 border border-gray-800 text-white text-xs focus:border-purple-500 focus:outline-none"
                >
                  <option value="">-- Select Academic Session --</option>
                  {years.map((y) => (
                    <option key={y.id} value={y.id}>
                      {y.name} {y.isCurrent ? '(Active)' : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs text-gray-300 font-medium">Section Name</label>
                <input
                  type="text"
                  value={secName}
                  onChange={(e) => setSecName(e.target.value)}
                  placeholder="e.g. Section A, Section B"
                  className="w-full mt-1 px-3 py-2 rounded-xl bg-gray-950 border border-gray-800 text-white text-xs focus:border-purple-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs text-gray-300 font-medium">Student Capacity</label>
                <input
                  type="number"
                  value={secCapacity}
                  onChange={(e) => setSecCapacity(e.target.value)}
                  placeholder="40"
                  className="w-full mt-1 px-3 py-2 rounded-xl bg-gray-950 border border-gray-800 text-white text-xs focus:border-purple-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-gray-800">
              <Button variant="outline" size="sm" onClick={() => setIsSectionModalOpen(false)}>
                Cancel
              </Button>
              <Button
                size="sm"
                disabled={!secName || !selectedClassIdForSec || !selectedYearIdForSec || createSectionMutation.isPending}
                onClick={() =>
                  createSectionMutation.mutate({
                    name: secName,
                    capacity: parseInt(secCapacity, 10) || 40,
                    classId: selectedClassIdForSec,
                    academicYearId: selectedYearIdForSec,
                  })
                }
              >
                {createSectionMutation.isPending ? 'Adding...' : 'Add Section'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: Create Subject Dialog */}
      {isSubjectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fade-in">
          <div className="w-full max-w-md glass-panel p-6 rounded-3xl border border-purple-500/30 space-y-4 bg-gray-900 shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-purple-400" /> Register New Subject
              </h3>
              <button onClick={() => setIsSubjectModalOpen(false)} className="text-gray-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs text-gray-300 font-medium">Subject Name</label>
                <input
                  type="text"
                  value={subName}
                  onChange={(e) => setSubName(e.target.value)}
                  placeholder="e.g. Mathematics, Chemistry"
                  className="w-full mt-1 px-3 py-2 rounded-xl bg-gray-950 border border-gray-800 text-white text-xs focus:border-purple-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs text-gray-300 font-medium">Subject Code</label>
                <input
                  type="text"
                  value={subCode}
                  onChange={(e) => setSubCode(e.target.value)}
                  placeholder="e.g. MATH101, CHEM201"
                  className="w-full mt-1 px-3 py-2 rounded-xl bg-gray-950 border border-gray-800 text-white text-xs focus:border-purple-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs text-gray-300 font-medium">Subject Classification</label>
                <select
                  value={subType}
                  onChange={(e) => setSubType(e.target.value as SubjectType)}
                  className="w-full mt-1 px-3 py-2 rounded-xl bg-gray-950 border border-gray-800 text-white text-xs focus:border-purple-500 focus:outline-none"
                >
                  <option value="CORE">CORE</option>
                  <option value="ELECTIVE">ELECTIVE</option>
                  <option value="LAB">LAB</option>
                  <option value="OPTIONAL">OPTIONAL</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-gray-300 font-medium">Assigned Class (Optional)</label>
                <select
                  value={subClassId}
                  onChange={(e) => setSubClassId(e.target.value)}
                  className="w-full mt-1 px-3 py-2 rounded-xl bg-gray-950 border border-gray-800 text-white text-xs focus:border-purple-500 focus:outline-none"
                >
                  <option value="">All Classes (General Curriculum)</option>
                  {classes.map((cls) => (
                    <option key={cls.id} value={cls.id}>
                      {cls.name} ({cls.code})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-gray-800">
              <Button variant="outline" size="sm" onClick={() => setIsSubjectModalOpen(false)}>
                Cancel
              </Button>
              <Button
                size="sm"
                disabled={!subName || !subCode || createSubjectMutation.isPending}
                onClick={() =>
                  createSubjectMutation.mutate({
                    name: subName,
                    code: subCode,
                    type: subType,
                    classId: subClassId || undefined,
                  })
                }
              >
                {createSubjectMutation.isPending ? 'Registering...' : 'Register Subject'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: Create Academic Year Dialog */}
      {isYearModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fade-in">
          <div className="w-full max-w-md glass-panel p-6 rounded-3xl border border-purple-500/30 space-y-4 bg-gray-900 shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Calendar className="h-5 w-5 text-purple-400" /> Add Academic Session
              </h3>
              <button onClick={() => setIsYearModalOpen(false)} className="text-gray-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs text-gray-300 font-medium">Session Name</label>
                <input
                  type="text"
                  value={yearName}
                  onChange={(e) => setYearName(e.target.value)}
                  placeholder="e.g. 2026-2027"
                  className="w-full mt-1 px-3 py-2 rounded-xl bg-gray-950 border border-gray-800 text-white text-xs focus:border-purple-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs text-gray-300 font-medium">Start Date</label>
                <input
                  type="date"
                  value={yearStartDate}
                  onChange={(e) => setYearStartDate(e.target.value)}
                  className="w-full mt-1 px-3 py-2 rounded-xl bg-gray-950 border border-gray-800 text-white text-xs focus:border-purple-500 focus:outline-none [color-scheme:dark]"
                />
              </div>

              <div>
                <label className="text-xs text-gray-300 font-medium">End Date</label>
                <input
                  type="date"
                  value={yearEndDate}
                  onChange={(e) => setYearEndDate(e.target.value)}
                  className="w-full mt-1 px-3 py-2 rounded-xl bg-gray-950 border border-gray-800 text-white text-xs focus:border-purple-500 focus:outline-none [color-scheme:dark]"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="yearCurrent"
                  checked={yearIsCurrent}
                  onChange={(e) => setYearIsCurrent(e.target.checked)}
                  className="rounded bg-gray-950 border-gray-800 text-purple-600 focus:ring-0"
                />
                <label htmlFor="yearCurrent" className="text-xs text-gray-300 cursor-pointer">
                  Set as Active Current Academic Session
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-gray-800">
              <Button variant="outline" size="sm" onClick={() => setIsYearModalOpen(false)}>
                Cancel
              </Button>
              <Button
                size="sm"
                disabled={!yearName || createYearMutation.isPending}
                onClick={() => {
                  const finalStart = yearStartDate || new Date().toISOString().split('T')[0];
                  const nextYr = new Date();
                  nextYr.setFullYear(nextYr.getFullYear() + 1);
                  const finalEnd = yearEndDate || nextYr.toISOString().split('T')[0];

                  createYearMutation.mutate({
                    name: yearName,
                    startDate: finalStart,
                    endDate: finalEnd,
                    isCurrent: yearIsCurrent,
                  });
                }}
              >
                {createYearMutation.isPending ? 'Adding...' : 'Add Session'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 5: Assign Teacher Dialog */}
      {isAssignModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fade-in">
          <div className="w-full max-w-md glass-panel p-6 rounded-3xl border border-purple-500/30 space-y-4 bg-gray-900 shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <UserCheck className="h-5 w-5 text-purple-400" /> Assign Teacher to Subject & Section
              </h3>
              <button onClick={() => setIsAssignModalOpen(false)} className="text-gray-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs text-gray-300 font-medium">Select Educator / Teacher</label>
                <select
                  value={assignTeacherId}
                  onChange={(e) => setAssignTeacherId(e.target.value)}
                  className="w-full mt-1 px-3 py-2 rounded-xl bg-gray-950 border border-gray-800 text-white text-xs focus:border-purple-500 focus:outline-none"
                >
                  <option value="">-- Select Teacher --</option>
                  {teachers.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.firstName} {t.lastName} ({t.email})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs text-gray-300 font-medium">Select Subject</label>
                <select
                  value={assignSubjectId}
                  onChange={(e) => setAssignSubjectId(e.target.value)}
                  className="w-full mt-1 px-3 py-2 rounded-xl bg-gray-950 border border-gray-800 text-white text-xs focus:border-purple-500 focus:outline-none"
                >
                  <option value="">-- Select Subject --</option>
                  {subjects.map((sub) => (
                    <option key={sub.id} value={sub.id}>
                      {sub.name} ({sub.code})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs text-gray-300 font-medium">Select Class Section</label>
                <select
                  value={assignSectionId}
                  onChange={(e) => setAssignSectionId(e.target.value)}
                  className="w-full mt-1 px-3 py-2 rounded-xl bg-gray-950 border border-gray-800 text-white text-xs focus:border-purple-500 focus:outline-none"
                >
                  <option value="">-- Select Class Section --</option>
                  {sections.map((sec) => (
                    <option key={sec.id} value={sec.id}>
                      {sec.class?.name || 'Class'} - {sec.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-gray-800">
              <Button variant="outline" size="sm" onClick={() => setIsAssignModalOpen(false)}>
                Cancel
              </Button>
              <Button
                size="sm"
                disabled={!assignTeacherId || !assignSubjectId || !assignSectionId || assignTeacherMutation.isPending}
                onClick={() =>
                  assignTeacherMutation.mutate({
                    teacherId: assignTeacherId,
                    subjectId: assignSubjectId,
                    sectionId: assignSectionId,
                  })
                }
              >
                {assignTeacherMutation.isPending ? 'Assigning...' : 'Assign Teacher'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
