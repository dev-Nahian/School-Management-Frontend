import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Sidebar } from '../components/layout/Sidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { useAuth } from '../context/AuthContext';
import { structureService } from '../services/structure.service';
import { 
  Calendar, 
  Layers, 
  BookOpen, 
  UserCheck, 
  Plus, 
  Star, 
  School,
  X
} from 'lucide-react';
import type { SubjectType } from '../types/structure';

export const SchoolStructurePage: React.FC = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<'years' | 'classes' | 'subjects' | 'assignments'>('classes');

  // Modal Dialog States
  const [isClassModalOpen, setIsClassModalOpen] = useState(false);
  const [isSubjectModalOpen, setIsSubjectModalOpen] = useState(false);

  // Form Field States
  const [className, setClassName] = useState('');
  const [classCode, setClassCode] = useState('');

  const [subName, setSubName] = useState('');
  const [subCode, setSubCode] = useState('');
  const [subType, setSubType] = useState<SubjectType>('CORE');

  const isSuperAdmin = user?.role === 'SUPER_ADMIN';

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

  // Mutations
  const setYearCurrentMutation = useMutation({
    mutationFn: structureService.setCurrentAcademicYear,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['academicYears'] });
    },
  });

  const createClassMutation = useMutation({
    mutationFn: structureService.createClass,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['classes'] });
      setIsClassModalOpen(false);
      setClassName('');
      setClassCode('');
    },
  });

  const createSubjectMutation = useMutation({
    mutationFn: structureService.createSubject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subjects'] });
      setIsSubjectModalOpen(false);
      setSubName('');
      setSubCode('');
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

                <Button size="sm" variant="outline" onClick={() => setIsSubjectModalOpen(true)} className="gap-1.5 text-xs">
                  <Plus className="h-4 w-4" /> Add Subject
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {classes.map((cls) => {
                const clsSections = sections.filter((sec) => sec.classId === cls.id);
                const clsSubjects = subjects.filter((sub) => sub.classId === cls.id);

                return (
                  <Card key={cls.id} className="border-gray-800 hover:border-purple-500/40 transition-all">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <Badge variant="purple" className="font-mono text-[10px]">
                          {cls.code}
                        </Badge>
                        <Badge variant="success" className="text-[9px]">
                          Active
                        </Badge>
                      </div>
                      <CardTitle className="text-lg font-bold text-white mt-1">{cls.name}</CardTitle>
                      <CardDescription className="text-xs">Display Order: {cls.displayOrder}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <span className="text-[11px] font-semibold text-purple-300 uppercase tracking-wider block mb-1.5">
                          Assigned Sections ({clsSections.length})
                        </span>
                        {clsSections.length === 0 ? (
                          <p className="text-xs text-gray-400 italic">No sections created yet.</p>
                        ) : (
                          <div className="flex flex-wrap gap-1.5">
                            {clsSections.map((sec) => (
                              <div
                                key={sec.id}
                                className="px-2.5 py-1 rounded-lg bg-purple-500/10 border border-purple-500/20 text-xs text-purple-200 flex items-center gap-1 font-mono"
                              >
                                <span>{sec.name}</span>
                                <span className="text-[9px] text-gray-400">({sec.capacity} seats)</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="pt-2 border-t border-gray-800/80">
                        <span className="text-[11px] font-semibold text-sky-300 uppercase tracking-wider block mb-1.5">
                          Curriculum Subjects ({clsSubjects.length})
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {clsSubjects.map((sub) => (
                            <Badge key={sub.id} variant="info" className="text-[10px]">
                              {sub.name}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
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
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-950/60 text-gray-400 font-semibold border-b border-gray-800">
                    <tr>
                      <th className="p-3">Subject Name</th>
                      <th className="p-3">Subject Code</th>
                      <th className="p-3">Subject Type</th>
                      <th className="p-3">Assigned Class</th>
                      <th className="p-3 text-right">Status</th>
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
                          <Badge variant="success" className="text-[10px]">
                            Active
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
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
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-950/60 text-gray-400 font-semibold border-b border-gray-800">
                    <tr>
                      <th className="p-3">Educator Name</th>
                      <th className="p-3">Subject</th>
                      <th className="p-3">Class & Section</th>
                      <th className="p-3 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800/60">
                    {assignments.map((ta) => (
                      <tr key={ta.id} className="hover:bg-gray-800/30 transition-colors">
                        <td className="p-3 font-bold text-white flex items-center gap-2">
                          <UserCheck className="h-4 w-4 text-emerald-400" />
                          {ta.teacher ? `${ta.teacher.firstName} ${ta.teacher.lastName}` : 'Marcus Vance'}
                        </td>
                        <td className="p-3 text-purple-300 font-medium">{ta.subject?.name || 'Mathematics'}</td>
                        <td className="p-3 font-mono text-gray-300">
                          {ta.section?.class?.name || 'Grade 8'} - {ta.section?.name || 'Section A'}
                        </td>
                        <td className="p-3 text-right">
                          <Badge variant="success" className="text-[10px]">
                            Assigned & Active
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
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
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {years.map((ay) => (
                  <div
                    key={ay.id}
                    className={`p-4 rounded-2xl border transition-all ${
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
                    </div>
                    <div className="mt-3 flex items-center justify-between text-xs text-gray-400 font-mono">
                      <span>Start: {new Date(ay.startDate).toLocaleDateString()}</span>
                      <span>End: {new Date(ay.endDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* MODAL 1: Create Class Dialog */}
      {isClassModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-md glass-panel p-6 rounded-3xl border border-purple-500/30 space-y-4 bg-gray-900">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Layers className="h-5 w-5 text-purple-400" /> Add New Academic Class
              </h3>
              <button onClick={() => setIsClassModalOpen(false)} className="text-gray-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs text-gray-300 font-medium">Class Name (e.g. Grade 11)</label>
                <input
                  type="text"
                  value={className}
                  onChange={(e) => setClassName(e.target.value)}
                  placeholder="Grade 11"
                  className="w-full mt-1 px-3 py-2 rounded-xl bg-gray-950 border border-gray-800 text-white text-xs"
                />
              </div>

              <div>
                <label className="text-xs text-gray-300 font-medium">Class Code (e.g. G11)</label>
                <input
                  type="text"
                  value={classCode}
                  onChange={(e) => setClassCode(e.target.value)}
                  placeholder="G11"
                  className="w-full mt-1 px-3 py-2 rounded-xl bg-gray-950 border border-gray-800 text-white text-xs"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" size="sm" onClick={() => setIsClassModalOpen(false)}>
                Cancel
              </Button>
              <Button
                size="sm"
                disabled={!className || !classCode}
                onClick={() => createClassMutation.mutate({ name: className, code: classCode })}
              >
                Create Class
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Create Subject Dialog */}
      {isSubjectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-md glass-panel p-6 rounded-3xl border border-purple-500/30 space-y-4 bg-gray-900">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-purple-400" /> Register New Subject
              </h3>
              <button onClick={() => setIsSubjectModalOpen(false)} className="text-gray-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs text-gray-300 font-medium">Subject Name (e.g. Chemistry)</label>
                <input
                  type="text"
                  value={subName}
                  onChange={(e) => setSubName(e.target.value)}
                  placeholder="Chemistry"
                  className="w-full mt-1 px-3 py-2 rounded-xl bg-gray-950 border border-gray-800 text-white text-xs"
                />
              </div>

              <div>
                <label className="text-xs text-gray-300 font-medium">Subject Code (e.g. CHEM101)</label>
                <input
                  type="text"
                  value={subCode}
                  onChange={(e) => setSubCode(e.target.value)}
                  placeholder="CHEM101"
                  className="w-full mt-1 px-3 py-2 rounded-xl bg-gray-950 border border-gray-800 text-white text-xs"
                />
              </div>

              <div>
                <label className="text-xs text-gray-300 font-medium">Subject Classification</label>
                <select
                  value={subType}
                  onChange={(e) => setSubType(e.target.value as SubjectType)}
                  className="w-full mt-1 px-3 py-2 rounded-xl bg-gray-950 border border-gray-800 text-white text-xs"
                >
                  <option value="CORE">CORE</option>
                  <option value="ELECTIVE">ELECTIVE</option>
                  <option value="LAB">LAB</option>
                  <option value="OPTIONAL">OPTIONAL</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" size="sm" onClick={() => setIsSubjectModalOpen(false)}>
                Cancel
              </Button>
              <Button
                size="sm"
                disabled={!subName || !subCode}
                onClick={() => createSubjectMutation.mutate({ name: subName, code: subCode, type: subType })}
              >
                Register Subject
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
