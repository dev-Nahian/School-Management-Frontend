import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Sidebar } from '../components/layout/Sidebar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { useAuth } from '../context/AuthContext';
import { examService } from '../services/exam.service';
import { structureService as schoolStructureService } from '../services/structure.service';
import { studentService } from '../services/student.service';
import {
  Award,
  BookOpen,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Plus,
  Printer,
  X,
  FileCheck2,
  GraduationCap,
  Save,
} from 'lucide-react';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';
import type { ReportCardResponse } from '../services/exam.service';

export const ExamManagementPage: React.FC = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const isSuperAdmin = user?.role === 'SUPER_ADMIN' || user?.role === 'ADMISSION_ADMIN';

  // Active View Tab
  const [activeTab, setActiveTab] = useState<'gradebook' | 'schedules' | 'results'>('gradebook');

  // Modals
  const [isCreateExamOpen, setIsCreateExamOpen] = useState(false);
  const [isReportCardModalOpen, setIsReportCardModalOpen] = useState(false);
  const [selectedStudentReport, setSelectedStudentReport] = useState<ReportCardResponse | null>(null);

  // Gradebook Selector State
  const [selectedExamId, setSelectedExamId] = useState('');
  const [selectedClassId, setSelectedClassId] = useState('');
  const [selectedSectionId, setSelectedSectionId] = useState('');
  const [selectedSubjectId, setSelectedSubjectId] = useState('');

  // Mark Entry Form State: Map of studentId -> { writtenMarks, mcqMarks, practicalMarks, remarks }
  const [marksMap, setMarksMap] = useState<
    Record<string, { writtenMarks: number; mcqMarks: number; practicalMarks: number; remarks: string }>
  >({});

  const [markSaveError, setMarkSaveError] = useState('');
  const [markSaveSuccess, setMarkSaveSuccess] = useState('');

  // Exam Creation Form State
  const [examForm, setExamForm] = useState({
    title: 'Final Term Examination 2026',
    term: 'FINAL_TERM' as const,
    academicYearId: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
  });

  // Queries
  const { data: exams = [] } = useQuery({
    queryKey: ['examsList'],
    queryFn: examService.getExams,
  });

  const { data: classes = [] } = useQuery({
    queryKey: ['classesExam'],
    queryFn: schoolStructureService.getClasses,
  });

  const { data: academicYears = [] } = useQuery({
    queryKey: ['academicYearsExam'],
    queryFn: schoolStructureService.getAcademicYears,
  });

  const { data: allSections = [] } = useQuery({
    queryKey: ['sectionsExam'],
    queryFn: schoolStructureService.getSections,
  });

  const { data: allSubjects = [] } = useQuery({
    queryKey: ['subjectsExam'],
    queryFn: schoolStructureService.getSubjects,
  });

  const classSections = (allSections as any[]).filter(
    (sec) => !selectedClassId || sec.classId === selectedClassId
  );
  const classSubjects = (allSubjects as any[]).filter(
    (sub) => !selectedClassId || sub.classId === selectedClassId
  );

  const { data: studentRoster } = useQuery({
    queryKey: ['studentsGradebook', selectedClassId, selectedSectionId],
    queryFn: () =>
      studentService.getStudents({
        classId: selectedClassId,
        sectionId: selectedSectionId,
      }),
    enabled: Boolean(selectedClassId && selectedSectionId),
  });

  const studentsList = Array.isArray(studentRoster)
    ? studentRoster
    : (studentRoster as any)?.students || [];

  const { data: schedules = [] } = useQuery({
    queryKey: ['examSchedules', selectedExamId, selectedClassId],
    queryFn: () => examService.getExamSchedules(selectedExamId, selectedClassId),
  });

  // Mutations
  const createExamMutation = useMutation({
    mutationFn: examService.createExam,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['examsList'] });
      setIsCreateExamOpen(false);
    },
  });

  const saveMarksMutation = useMutation({
    mutationFn: examService.saveMarkEntries,
    onSuccess: () => {
      setMarkSaveSuccess('Marks recorded and GPA/Grades calculated successfully!');
      setMarkSaveError('');
      queryClient.invalidateQueries({ queryKey: ['examSchedules'] });
    },
    onError: (err: any) => {
      setMarkSaveError(err?.response?.data?.message || err.message || 'Failed to save marks.');
      setMarkSaveSuccess('');
    },
  });

  // Helper calculation for gradebook preview
  const computeLiveResult = (written: number, mcq: number, practical: number, passMarks = 33, fullMarks = 100) => {
    const total = (written || 0) + (mcq || 0) + (practical || 0);
    const percentage = Number(((total / fullMarks) * 100).toFixed(1));
    const isPassed = total >= passMarks;
    let grade = 'F';
    let gpa = 0.0;

    if (isPassed && percentage >= 33) {
      if (percentage >= 80) {
        grade = 'A+';
        gpa = 5.0;
      } else if (percentage >= 70) {
        grade = 'A';
        gpa = 4.0;
      } else if (percentage >= 60) {
        grade = 'A-';
        gpa = 3.5;
      } else if (percentage >= 50) {
        grade = 'B';
        gpa = 3.0;
      } else if (percentage >= 40) {
        grade = 'C';
        gpa = 2.0;
      } else {
        grade = 'D';
        gpa = 1.0;
      }
    }
    return { total, percentage, grade, gpa, isPassed };
  };

  const handleSaveMarksSubmit = () => {
    if (!selectedExamId || !selectedClassId || !selectedSectionId || !selectedSubjectId) {
      setMarkSaveError('Please select Exam, Class, Section, and Subject before saving.');
      return;
    }

    const marksArray = studentsList.map((stu: any) => {
      const entry = marksMap[stu.id] || { writtenMarks: 0, mcqMarks: 0, practicalMarks: 0, remarks: '' };
      return {
        studentId: stu.id,
        writtenMarks: Number(entry.writtenMarks || 0),
        mcqMarks: Number(entry.mcqMarks || 0),
        practicalMarks: Number(entry.practicalMarks || 0),
        remarks: entry.remarks || '',
      };
    });

    saveMarksMutation.mutate({
      examId: selectedExamId,
      classId: selectedClassId,
      sectionId: selectedSectionId,
      subjectId: selectedSubjectId,
      marks: marksArray,
    });
  };

  const handleViewReportCard = async (studentId: string) => {
    try {
      const card = await examService.getStudentReportCard(studentId, selectedExamId);
      setSelectedStudentReport(card);
      setIsReportCardModalOpen(true);
    } catch {
      alert('Could not fetch report card for this student.');
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <Sidebar />

      <div className="flex-1 space-y-6">
        <Breadcrumbs />

        {/* Banner */}
        <div className="glass-panel p-6 rounded-3xl border border-purple-500/20 bg-gradient-to-r from-indigo-950/40 via-gray-900/60 to-purple-950/40">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <Badge variant="purple" className="mb-2 gap-1.5 font-mono">
                <Award className="h-3.5 w-3.5 text-amber-400" /> Phase 10 Academic Results & Gradebook
              </Badge>
              <h2 className="text-2xl font-extrabold text-white">Examinations & Result Management</h2>
              <p className="text-xs text-gray-400 mt-1">
                Configure exam schedules, record teacher marks with automatic GPA calculations, and generate printable report cards.
              </p>
            </div>

            {isSuperAdmin && (
              <Button size="sm" onClick={() => setIsCreateExamOpen(true)} className="gap-1.5 text-xs">
                <Plus className="h-4 w-4" /> Create Exam Term
              </Button>
            )}
          </div>
        </div>

        {/* View Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-gray-800 pb-3">
          {[
            { id: 'gradebook', label: 'Teacher Gradebook / Mark Entry', icon: FileCheck2 },
            { id: 'schedules', label: 'Exam Schedules & Full Marks', icon: Calendar },
            { id: 'results', label: 'Student Report Cards', icon: GraduationCap },
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

        {/* TAB 1: TEACHER GRADEBOOK & MARK ENTRY */}
        {activeTab === 'gradebook' && (
          <div className="space-y-6">
            {/* Filter selectors */}
            <Card className="border-gray-800 bg-gray-900/60 p-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                <div>
                  <label className="text-gray-300 font-semibold block mb-1">Select Exam Term</label>
                  <select
                    value={selectedExamId}
                    onChange={(e) => setSelectedExamId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-gray-950 border border-gray-800 text-white text-xs font-medium"
                  >
                    <option value="">Select Exam</option>
                    {exams.map((ex) => (
                      <option key={ex.id} value={ex.id}>
                        {ex.title} ({ex.term})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-gray-300 font-semibold block mb-1">Select Class</label>
                  <select
                    value={selectedClassId}
                    onChange={(e) => {
                      setSelectedClassId(e.target.value);
                      setSelectedSectionId('');
                      setSelectedSubjectId('');
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-gray-950 border border-gray-800 text-white text-xs font-medium"
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
                  <label className="text-gray-300 font-semibold block mb-1">Select Section</label>
                  <select
                    value={selectedSectionId}
                    onChange={(e) => setSelectedSectionId(e.target.value)}
                    disabled={!selectedClassId}
                    className="w-full px-3 py-2 rounded-xl bg-gray-950 border border-gray-800 text-white text-xs font-medium"
                  >
                    <option value="">Select Section</option>
                    {(classSections as any[]).map((sec: any) => (
                      <option key={sec.id} value={sec.id}>
                        Section {sec.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-gray-300 font-semibold block mb-1">Select Subject</label>
                  <select
                    value={selectedSubjectId}
                    onChange={(e) => setSelectedSubjectId(e.target.value)}
                    disabled={!selectedClassId}
                    className="w-full px-3 py-2 rounded-xl bg-gray-950 border border-gray-800 text-white text-xs font-medium"
                  >
                    <option value="">Select Subject</option>
                    {(classSubjects as any[]).map((sub: any) => (
                      <option key={sub.id} value={sub.id}>
                        {sub.name} ({sub.code})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </Card>

            {/* Notification messages */}
            {markSaveError && (
              <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0" /> {markSaveError}
              </div>
            )}

            {markSaveSuccess && (
              <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 shrink-0" /> {markSaveSuccess}
              </div>
            )}

            {/* Roster Table */}
            {selectedExamId && selectedClassId && selectedSectionId && selectedSubjectId ? (
              <Card className="border-gray-800">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">Marks Entry Grid ({studentsList.length} Students)</CardTitle>
                    <CardDescription className="text-xs">
                      Enter Written, MCQ, and Practical marks. Total, Grade, and GPA are calculated automatically.
                    </CardDescription>
                  </div>
                  <Button
                    size="sm"
                    disabled={saveMarksMutation.isPending}
                    onClick={handleSaveMarksSubmit}
                    className="gap-2 bg-emerald-600 hover:bg-emerald-500 text-xs"
                  >
                    <Save className="h-4 w-4" /> Save Gradebook Entries
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-gray-950/70 text-gray-400 font-semibold border-b border-gray-800">
                        <tr>
                          <th className="p-3">Roll</th>
                          <th className="p-3">Student Name</th>
                          <th className="p-3">Written (70)</th>
                          <th className="p-3">MCQ (30)</th>
                          <th className="p-3">Practical</th>
                          <th className="p-3">Calculated Total</th>
                          <th className="p-3">Grade</th>
                          <th className="p-3">GPA</th>
                          <th className="p-3 text-right">Report Card</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-800/60">
                        {studentsList.map((stu: any) => {
                          const userEntry = marksMap[stu.id] || {
                            writtenMarks: 75,
                            mcqMarks: 25,
                            practicalMarks: 0,
                            remarks: '',
                          };
                          const liveRes = computeLiveResult(
                            userEntry.writtenMarks,
                            userEntry.mcqMarks,
                            userEntry.practicalMarks
                          );

                          return (
                            <tr key={stu.id} className="hover:bg-gray-800/30 transition-colors">
                              <td className="p-3 font-mono text-purple-300 font-bold">{stu.rollNumber}</td>
                              <td className="p-3 font-bold text-white">
                                {stu.firstName} {stu.lastName}
                                <span className="block text-[10px] text-gray-500 font-mono">{stu.studentId}</span>
                              </td>
                              <td className="p-3">
                                <input
                                  type="number"
                                  max={70}
                                  value={userEntry.writtenMarks}
                                  onChange={(e) =>
                                    setMarksMap({
                                      ...marksMap,
                                      [stu.id]: { ...userEntry, writtenMarks: Number(e.target.value) },
                                    })
                                  }
                                  className="w-16 px-2 py-1 rounded-lg bg-gray-950 border border-gray-800 text-white font-mono text-xs text-center"
                                />
                              </td>
                              <td className="p-3">
                                <input
                                  type="number"
                                  max={30}
                                  value={userEntry.mcqMarks}
                                  onChange={(e) =>
                                    setMarksMap({
                                      ...marksMap,
                                      [stu.id]: { ...userEntry, mcqMarks: Number(e.target.value) },
                                    })
                                  }
                                  className="w-16 px-2 py-1 rounded-lg bg-gray-950 border border-gray-800 text-white font-mono text-xs text-center"
                                />
                              </td>
                              <td className="p-3">
                                <input
                                  type="number"
                                  value={userEntry.practicalMarks}
                                  onChange={(e) =>
                                    setMarksMap({
                                      ...marksMap,
                                      [stu.id]: { ...userEntry, practicalMarks: Number(e.target.value) },
                                    })
                                  }
                                  className="w-16 px-2 py-1 rounded-lg bg-gray-950 border border-gray-800 text-white font-mono text-xs text-center"
                                />
                              </td>
                              <td className="p-3 font-mono font-bold text-white">${liveRes.total} / 100</td>
                              <td className="p-3">
                                <Badge
                                  variant={liveRes.grade === 'F' ? 'error' : 'success'}
                                  className="text-[10px]"
                                >
                                  {liveRes.grade}
                                </Badge>
                              </td>
                              <td className="p-3 font-mono font-bold text-purple-300">{liveRes.gpa.toFixed(1)}</td>
                              <td className="p-3 text-right">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleViewReportCard(stu.id)}
                                  className="h-7 px-2 text-[10px] gap-1 text-purple-300"
                                >
                                  <Printer className="h-3 w-3" /> Report Card
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
            ) : (
              <Card className="border-gray-800 text-center p-8 bg-gray-900/40">
                <BookOpen className="h-10 w-10 text-purple-400 mx-auto mb-2 opacity-60" />
                <CardTitle className="text-base text-gray-200">Select Exam Parameters</CardTitle>
                <CardDescription className="text-xs max-w-sm mx-auto mt-1">
                  Please select an Exam Term, Class, Section, and Subject above to populate the student marks entry grid.
                </CardDescription>
              </Card>
            )}
          </div>
        )}

        {/* TAB 2: EXAM SCHEDULES */}
        {activeTab === 'schedules' && (
          <Card className="border-gray-800">
            <CardHeader>
              <CardTitle className="text-lg">Configured Exam Subject Schedules</CardTitle>
              <CardDescription className="text-xs">
                Master full marks, pass marks, and component limits per subject
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-950/70 text-gray-400 font-semibold border-b border-gray-800">
                    <tr>
                      <th className="p-3">Exam Title</th>
                      <th className="p-3">Class</th>
                      <th className="p-3">Subject</th>
                      <th className="p-3">Full Marks</th>
                      <th className="p-3">Pass Marks</th>
                      <th className="p-3">Written / MCQ / Practical</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800/60">
                    {schedules.map((sch) => (
                      <tr key={sch.id} className="hover:bg-gray-800/30 transition-colors">
                        <td className="p-3 font-bold text-white">{sch.exam?.title}</td>
                        <td className="p-3 text-purple-300 font-bold">{sch.class?.name}</td>
                        <td className="p-3 text-emerald-400 font-bold">
                          {sch.subject?.name} ({sch.subject?.code})
                        </td>
                        <td className="p-3 font-mono font-bold text-white">{sch.fullMarks}</td>
                        <td className="p-3 font-mono font-bold text-amber-400">{sch.passMarks}</td>
                        <td className="p-3 font-mono text-gray-400">
                          {sch.writtenMax} / {sch.mcqMax} / {sch.practicalMax}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* TAB 3: STUDENT REPORT CARDS ROSTER */}
        {activeTab === 'results' && (
          <Card className="border-gray-800">
            <CardHeader>
              <CardTitle className="text-lg">Institutional Report Card Directory</CardTitle>
              <CardDescription className="text-xs">
                Generate and print official term performance statements
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-950/70 text-gray-400 font-semibold border-b border-gray-800">
                    <tr>
                      <th className="p-3">Student Name</th>
                      <th className="p-3">ID</th>
                      <th className="p-3">Class</th>
                      <th className="p-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800/60">
                    {studentsList.map((s: any) => (
                      <tr key={s.id} className="hover:bg-gray-800/30 transition-colors">
                        <td className="p-3 font-bold text-white">
                          {s.firstName} {s.lastName}
                        </td>
                        <td className="p-3 font-mono text-purple-300">{s.studentId}</td>
                        <td className="p-3 text-gray-300">{s.class?.name || 'Grade 8'}</td>
                        <td className="p-3 text-right">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleViewReportCard(s.id)}
                            className="h-7 px-2.5 text-[10px] gap-1"
                          >
                            <Printer className="h-3.5 w-3.5" /> View Report Card
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

      {/* MODAL 1: Create Exam Term Dialog */}
      {isCreateExamOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-md glass-panel p-6 rounded-3xl border border-purple-500/30 space-y-4 bg-gray-900">
            <div className="flex items-center justify-between border-b border-gray-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Award className="h-5 w-5 text-purple-400" /> Create Academic Exam Term
              </h3>
              <button onClick={() => setIsCreateExamOpen(false)} className="text-gray-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-gray-300 font-medium block">Exam Title</label>
                <input
                  type="text"
                  value={examForm.title}
                  onChange={(e) => setExamForm({ ...examForm, title: e.target.value })}
                  className="w-full mt-1 px-3 py-2 rounded-xl bg-gray-950 border border-gray-800 text-white text-xs"
                />
              </div>

              <div>
                <label className="text-gray-300 font-medium block">Term Category</label>
                <select
                  value={examForm.term}
                  onChange={(e) => setExamForm({ ...examForm, term: e.target.value as any })}
                  className="w-full mt-1 px-3 py-2 rounded-xl bg-gray-950 border border-gray-800 text-white text-xs"
                >
                  <option value="FIRST_TERM">First Term</option>
                  <option value="MID_TERM">Mid Term</option>
                  <option value="FINAL_TERM">Final Term</option>
                  <option value="TEST">Class Test</option>
                </select>
              </div>

              <div>
                <label className="text-gray-300 font-medium block">Academic Year</label>
                <select
                  value={examForm.academicYearId}
                  onChange={(e) => setExamForm({ ...examForm, academicYearId: e.target.value })}
                  className="w-full mt-1 px-3 py-2 rounded-xl bg-gray-950 border border-gray-800 text-white text-xs"
                >
                  <option value="">Select Academic Year</option>
                  {(academicYears as any[]).map((ay: any) => (
                    <option key={ay.id} value={ay.id}>
                      {ay.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-gray-800">
              <Button variant="outline" size="sm" onClick={() => setIsCreateExamOpen(false)}>
                Cancel
              </Button>
              <Button
                size="sm"
                disabled={!examForm.title || !examForm.academicYearId || createExamMutation.isPending}
                onClick={() => createExamMutation.mutate(examForm)}
              >
                Create Exam
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Official Printable Student Academic Report Card */}
      {isReportCardModalOpen && selectedStudentReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto">
          <div className="w-full max-w-2xl bg-white text-gray-900 p-8 rounded-3xl shadow-2xl space-y-6 my-8 print:m-0 print:p-6 print:rounded-none">
            {/* School Header */}
            <div className="flex justify-between items-start border-b-2 border-purple-900 pb-4">
              <div>
                <h1 className="text-2xl font-black text-purple-950 tracking-tight">APEX ACADEMY HIGH SCHOOL</h1>
                <p className="text-xs text-gray-600 font-mono">Academic Progress & Assessment Report Card</p>
              </div>
              <div className="text-right font-mono text-xs">
                <Badge variant={selectedStudentReport.summary.resultStatus === 'PASSED' ? 'success' : 'error'}>
                  {selectedStudentReport.summary.resultStatus}
                </Badge>
              </div>
            </div>

            {/* Student Info Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono bg-gray-50 p-4 rounded-2xl border border-gray-200">
              <div>
                <span className="text-gray-500 uppercase text-[9px] block">Student Name</span>
                <strong className="text-gray-900 text-sm">
                  {selectedStudentReport.student.firstName} {selectedStudentReport.student.lastName}
                </strong>
              </div>
              <div>
                <span className="text-gray-500 uppercase text-[9px] block">Student ID</span>
                <strong className="text-purple-900">{selectedStudentReport.student.studentId}</strong>
              </div>
              <div>
                <span className="text-gray-500 uppercase text-[9px] block">Class & Section</span>
                <strong className="text-gray-900">
                  {selectedStudentReport.student.class?.name || 'Grade 8'} - {selectedStudentReport.student.section?.name || 'A'}
                </strong>
              </div>
              <div>
                <span className="text-gray-500 uppercase text-[9px] block">Roll Number</span>
                <strong className="text-gray-900">{selectedStudentReport.student.rollNumber}</strong>
              </div>
            </div>

            {/* Subject Marks Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-gray-200">
                <thead className="bg-gray-100 text-gray-700 font-bold font-mono">
                  <tr>
                    <th className="p-2.5 border-b border-gray-200">Subject</th>
                    <th className="p-2.5 border-b border-gray-200 text-center">Written</th>
                    <th className="p-2.5 border-b border-gray-200 text-center">MCQ</th>
                    <th className="p-2.5 border-b border-gray-200 text-center">Practical</th>
                    <th className="p-2.5 border-b border-gray-200 text-center">Total</th>
                    <th className="p-2.5 border-b border-gray-200 text-center">Grade</th>
                    <th className="p-2.5 border-b border-gray-200 text-center">GPA Point</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 font-mono">
                  {selectedStudentReport.markEntries.map((m) => (
                    <tr key={m.id || m.studentId}>
                      <td className="p-2.5 font-bold text-gray-900">{m.subject?.name || 'Mathematics'}</td>
                      <td className="p-2.5 text-center">{m.writtenMarks}</td>
                      <td className="p-2.5 text-center">{m.mcqMarks}</td>
                      <td className="p-2.5 text-center">{m.practicalMarks}</td>
                      <td className="p-2.5 text-center font-bold text-gray-900">{m.totalMarks}</td>
                      <td className="p-2.5 text-center font-bold text-purple-900">{m.grade}</td>
                      <td className="p-2.5 text-center font-bold text-emerald-700">{m.gpa.toFixed(1)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Academic Result Summary Box */}
            <div className="grid grid-cols-3 gap-4 text-center font-mono bg-purple-50 p-4 rounded-2xl border border-purple-200">
              <div>
                <span className="text-[10px] text-gray-600 uppercase block">Obtained Marks</span>
                <p className="text-lg font-black text-purple-950">
                  {selectedStudentReport.summary.totalObtainedMarks} / {selectedStudentReport.summary.totalPossibleMarks}
                </p>
              </div>
              <div>
                <span className="text-[10px] text-gray-600 uppercase block">Cumulative GPA</span>
                <p className="text-xl font-black text-emerald-700">
                  {selectedStudentReport.summary.overallGPA.toFixed(2)}
                </p>
              </div>
              <div>
                <span className="text-[10px] text-gray-600 uppercase block">Final Grade</span>
                <p className="text-xl font-black text-purple-900">
                  {selectedStudentReport.summary.overallGrade}
                </p>
              </div>
            </div>

            {/* Footer Signatures */}
            <div className="flex justify-between items-end pt-8 border-t border-gray-200 text-[10px] text-gray-500 font-mono">
              <div className="text-center border-t border-gray-400 pt-1 w-32">
                Class Teacher
              </div>
              <div className="text-center border-t border-gray-400 pt-1 w-32">
                Headmaster Signature
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-2 pt-2 print:hidden">
              <Button variant="outline" size="sm" onClick={() => setIsReportCardModalOpen(false)}>
                Close
              </Button>
              <Button size="sm" onClick={() => window.print()} className="gap-2">
                <Printer className="h-4 w-4" /> Print Official Report Card
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
