import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Sidebar } from '../components/layout/Sidebar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { useAuth } from '../context/AuthContext';
import { assignmentService } from '../services/assignment.service';
import { structureService } from '../services/structure.service';
import {
  FileText,
  Plus,
  Clock,
  CheckCircle2,
  AlertCircle,
  X,
  Upload,
  Award,
  BookOpen,
  MessageSquare,
} from 'lucide-react';
import type { AssignmentModel, AssignmentSubmissionModel } from '../services/assignment.service';

export const AssignmentPage: React.FC = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const isTeacherOrAdmin = user?.role === 'SUPER_ADMIN' || user?.role === 'TEACHER';
  const isStudent = user?.role === 'STUDENT';
  const isParent = user?.role === 'PARENT';

  // Modal States
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [isGradingDrawerOpen, setIsGradingDrawerOpen] = useState(false);

  const [selectedAssignment, setSelectedAssignment] = useState<AssignmentModel | null>(null);
  const [selectedSubmission, setSelectedSubmission] = useState<AssignmentSubmissionModel | null>(null);

  // Creation Form State
  const [createForm, setCreateForm] = useState({
    title: '',
    description: '',
    classId: '',
    sectionId: '',
    subjectId: '',
    dueDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
    totalPoints: 100,
    attachmentUrl: '',
  });

  // Student Submission Form State
  const [submitForm, setSubmitForm] = useState({
    submissionText: '',
    attachmentUrl: '',
  });

  // Grading Form State
  const [gradeForm, setGradeForm] = useState({
    marksObtained: 95,
    feedback: '',
  });

  const [feedbackMsg, setFeedbackMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Queries
  const { data: assignments = [], isLoading } = useQuery({
    queryKey: ['assignmentsList'],
    queryFn: () => assignmentService.getAssignments(),
  });

  const { data: classes = [] } = useQuery({
    queryKey: ['classesAssignment'],
    queryFn: structureService.getClasses,
  });

  const { data: allSections = [] } = useQuery({
    queryKey: ['sectionsAssignment'],
    queryFn: structureService.getSections,
  });

  const { data: allSubjects = [] } = useQuery({
    queryKey: ['subjectsAssignment'],
    queryFn: structureService.getSubjects,
  });

  const classSections = (allSections as any[]).filter(
    (sec) => !createForm.classId || sec.classId === createForm.classId
  );
  const classSubjects = (allSubjects as any[]).filter(
    (sub) => !createForm.classId || sub.classId === createForm.classId
  );

  // Mutations
  const createMutation = useMutation({
    mutationFn: assignmentService.createAssignment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assignmentsList'] });
      setIsCreateModalOpen(false);
      setFeedbackMsg('Homework assignment published successfully!');
      setErrorMsg('');
    },
    onError: (err: any) => {
      setErrorMsg(err?.response?.data?.message || err.message || 'Failed to create assignment.');
    },
  });

  const submitMutation = useMutation({
    mutationFn: assignmentService.submitAssignment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assignmentsList'] });
      setIsSubmitModalOpen(false);
      setFeedbackMsg('Homework submission recorded successfully!');
      setErrorMsg('');
    },
    onError: (err: any) => {
      setErrorMsg(err?.response?.data?.message || err.message || 'Failed to submit homework.');
    },
  });

  const gradeMutation = useMutation({
    mutationFn: assignmentService.gradeSubmission,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assignmentsList'] });
      setIsGradingDrawerOpen(false);
      setFeedbackMsg('Submission graded and student notified with feedback!');
      setErrorMsg('');
    },
    onError: (err: any) => {
      setErrorMsg(err?.response?.data?.message || err.message || 'Failed to grade submission.');
    },
  });

  const handleOpenSubmitModal = (assignment: AssignmentModel) => {
    setSelectedAssignment(assignment);
    setIsSubmitModalOpen(true);
  };

  const handleOpenGradingDrawer = (assignment: AssignmentModel, submission: AssignmentSubmissionModel) => {
    setSelectedAssignment(assignment);
    setSelectedSubmission(submission);
    setGradeForm({
      marksObtained: submission.marksObtained || assignment.totalPoints,
      feedback: submission.feedback || 'Excellent work! Keep it up.',
    });
    setIsGradingDrawerOpen(true);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <Sidebar />

      <div className="flex-1 space-y-6">
        {/* Banner */}
        <div className="glass-panel p-6 rounded-3xl border border-purple-500/20 bg-gradient-to-r from-purple-950/40 via-gray-900/60 to-indigo-950/40">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <Badge variant="purple" className="mb-2 gap-1.5 font-mono">
                <FileText className="h-3.5 w-3.5 text-purple-400" /> Phase 11 Homework & Assignments
              </Badge>
              <h2 className="text-2xl font-extrabold text-white">Academic Homework Management</h2>
              <p className="text-xs text-gray-400 mt-1">
                Assign tasks, submit online homework attachments, review student work, and deliver feedback.
              </p>
            </div>

            {isTeacherOrAdmin && (
              <Button size="sm" onClick={() => setIsCreateModalOpen(true)} className="gap-1.5 text-xs">
                <Plus className="h-4 w-4" /> Create Homework Task
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

        {/* Assignments List Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {isLoading ? (
            <Card className="col-span-full border-gray-800 p-8 text-center text-xs text-gray-400">
              Loading homework tasks...
            </Card>
          ) : assignments.length === 0 ? (
            <Card className="col-span-full border-gray-800 p-8 text-center bg-gray-900/40">
              <BookOpen className="h-10 w-10 text-purple-400 mx-auto mb-2 opacity-60" />
              <CardTitle className="text-base text-gray-200">No Homework Assigned Yet</CardTitle>
              <CardDescription className="text-xs max-w-sm mx-auto mt-1">
                Homework assignments and student submission tasks will appear here when published.
              </CardDescription>
            </Card>
          ) : (
            assignments.map((asg) => {
              const submission = asg.submissions && asg.submissions.length > 0 ? asg.submissions[0] : null;
              const isPastDue = new Date() > new Date(asg.dueDate);

              return (
                <Card key={asg.id} className="border-gray-800 hover:border-purple-500/30 transition-all flex flex-col justify-between">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-2">
                      <Badge variant="purple" className="text-[10px]">
                        {asg.subject?.name || 'Subject'} ({asg.subject?.code})
                      </Badge>
                      <span className="text-[10px] font-mono text-gray-400 flex items-center gap-1">
                        <Clock className="h-3 w-3 text-amber-400" /> Due: {new Date(asg.dueDate).toLocaleDateString()}
                      </span>
                    </div>

                    <CardTitle className="text-base text-white mt-2">{asg.title}</CardTitle>
                    <CardDescription className="text-xs text-gray-400 line-clamp-2 mt-1">
                      {asg.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-3 pt-0">
                    <div className="flex items-center justify-between text-xs text-gray-400 font-mono bg-gray-950/60 p-2.5 rounded-xl border border-gray-800">
                      <span>
                        Target: <strong className="text-white">{asg.class?.name || 'Class'}</strong> - Section{' '}
                        <strong className="text-purple-300">{asg.section?.name || 'A'}</strong>
                      </span>
                      <span>Total Points: <strong className="text-emerald-400">{asg.totalPoints}</strong></span>
                    </div>

                    {/* Student / Parent View */}
                    {(isStudent || isParent) && (
                      <div className="p-3 rounded-xl bg-gray-900/80 border border-gray-800 text-xs space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-400 text-[10px]">MY SUBMISSION STATUS:</span>
                          <Badge
                            variant={
                              submission?.status === 'GRADED'
                                ? 'success'
                                : submission?.status === 'SUBMITTED'
                                ? 'purple'
                                : submission?.status === 'LATE'
                                ? 'warning'
                                : 'info'
                            }
                            className="text-[10px]"
                          >
                            {submission?.status || (isPastDue ? 'OVERDUE' : 'PENDING')}
                          </Badge>
                        </div>

                        {submission?.status === 'GRADED' && (
                          <div className="space-y-1 border-t border-gray-800 pt-2 text-[11px]">
                            <div className="flex justify-between font-mono">
                              <span className="text-gray-400">Score Awarded:</span>
                              <strong className="text-emerald-400 font-bold">
                                {submission.marksObtained} / {asg.totalPoints}
                              </strong>
                            </div>
                            {submission.feedback && (
                              <p className="text-gray-300 italic text-[10px] bg-purple-950/30 p-2 rounded-lg border border-purple-800/30 flex items-start gap-1">
                                <MessageSquare className="h-3 w-3 text-purple-400 shrink-0 mt-0.5" />
                                "{submission.feedback}"
                              </p>
                            )}
                          </div>
                        )}

                        {isStudent && submission?.status !== 'GRADED' && (
                          <Button
                            size="sm"
                            onClick={() => handleOpenSubmitModal(asg)}
                            className="w-full text-xs gap-1.5 mt-1"
                          >
                            <Upload className="h-3.5 w-3.5" /> {submission ? 'Update Submission' : 'Submit Homework'}
                          </Button>
                        )}
                      </div>
                    )}

                    {/* Teacher Submissions View */}
                    {isTeacherOrAdmin && (
                      <div className="space-y-2 pt-1 border-t border-gray-800/60">
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-gray-400 text-[10px] font-mono">
                            Submissions ({asg.submissions?.length || 0})
                          </span>
                        </div>

                        {asg.submissions && asg.submissions.length > 0 ? (
                          <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1 text-xs">
                            {asg.submissions.map((sub) => (
                              <div
                                key={sub.id}
                                className="flex items-center justify-between p-2 rounded-xl bg-gray-950 border border-gray-800 hover:border-gray-700"
                              >
                                <div>
                                  <p className="font-bold text-white text-[11px]">
                                    {sub.student?.firstName} {sub.student?.lastName}
                                  </p>
                                  <span className="text-[9px] text-gray-500 font-mono">
                                    Roll {sub.student?.rollNumber} • {sub.status}
                                  </span>
                                </div>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleOpenGradingDrawer(asg, sub)}
                                  className="h-6 px-2 text-[10px] gap-1 text-purple-300"
                                >
                                  <Award className="h-3 w-3 text-amber-400" /> Grade
                                </Button>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-[11px] text-gray-500 italic">No student submissions recorded yet.</p>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>

      {/* MODAL 1: Create Homework Task */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg glass-panel p-6 rounded-3xl border border-purple-500/30 space-y-4 bg-gray-900">
            <div className="flex items-center justify-between border-b border-gray-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <FileText className="h-5 w-5 text-purple-400" /> Create Homework Task
              </h3>
              <button onClick={() => setIsCreateModalOpen(false)} className="text-gray-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-gray-300 font-medium block">Title</label>
                <input
                  type="text"
                  placeholder="e.g. Algebra Trigonometry Problem Set 4"
                  value={createForm.title}
                  onChange={(e) => setCreateForm({ ...createForm, title: e.target.value })}
                  className="w-full mt-1 px-3 py-2 rounded-xl bg-gray-950 border border-gray-800 text-white"
                />
              </div>

              <div>
                <label className="text-gray-300 font-medium block">Task Description & Instructions</label>
                <textarea
                  rows={3}
                  placeholder="Describe task instructions, questions, or chapter references..."
                  value={createForm.description}
                  onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
                  className="w-full mt-1 px-3 py-2 rounded-xl bg-gray-950 border border-gray-800 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-gray-300 font-medium block">Target Class</label>
                  <select
                    value={createForm.classId}
                    onChange={(e) => setCreateForm({ ...createForm, classId: e.target.value })}
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
                  <label className="text-gray-300 font-medium block">Target Section</label>
                  <select
                    value={createForm.sectionId}
                    onChange={(e) => setCreateForm({ ...createForm, sectionId: e.target.value })}
                    disabled={!createForm.classId}
                    className="w-full mt-1 px-3 py-2 rounded-xl bg-gray-950 border border-gray-800 text-white"
                  >
                    <option value="">Select Section</option>
                    {classSections.map((sec: any) => (
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
                    value={createForm.subjectId}
                    onChange={(e) => setCreateForm({ ...createForm, subjectId: e.target.value })}
                    disabled={!createForm.classId}
                    className="w-full mt-1 px-3 py-2 rounded-xl bg-gray-950 border border-gray-800 text-white"
                  >
                    <option value="">Select Subject</option>
                    {classSubjects.map((sub: any) => (
                      <option key={sub.id} value={sub.id}>
                        {sub.name} ({sub.code})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-gray-300 font-medium block">Due Date</label>
                  <input
                    type="date"
                    value={createForm.dueDate}
                    onChange={(e) => setCreateForm({ ...createForm, dueDate: e.target.value })}
                    className="w-full mt-1 px-3 py-2 rounded-xl bg-gray-950 border border-gray-800 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-gray-300 font-medium block">Attachment Resource URL (Optional)</label>
                <input
                  type="text"
                  placeholder="https://drive.google.com/doc-link"
                  value={createForm.attachmentUrl}
                  onChange={(e) => setCreateForm({ ...createForm, attachmentUrl: e.target.value })}
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
                  !createForm.title ||
                  !createForm.classId ||
                  !createForm.sectionId ||
                  !createForm.subjectId ||
                  createMutation.isPending
                }
                onClick={() => createMutation.mutate(createForm)}
              >
                Publish Assignment
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Student Homework Submission */}
      {isSubmitModalOpen && selectedAssignment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-md glass-panel p-6 rounded-3xl border border-purple-500/30 space-y-4 bg-gray-900">
            <div className="flex items-center justify-between border-b border-gray-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Upload className="h-5 w-5 text-purple-400" /> Submit Homework Task
                </h3>
                <p className="text-[10px] text-gray-400">{selectedAssignment.title}</p>
              </div>
              <button onClick={() => setIsSubmitModalOpen(false)} className="text-gray-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-gray-300 font-medium block">Text Response / Solution</label>
                <textarea
                  rows={4}
                  placeholder="Type your answer or submission notes here..."
                  value={submitForm.submissionText}
                  onChange={(e) => setSubmitForm({ ...submitForm, submissionText: e.target.value })}
                  className="w-full mt-1 px-3 py-2 rounded-xl bg-gray-950 border border-gray-800 text-white"
                />
              </div>

              <div>
                <label className="text-gray-300 font-medium block">Attachment Drive / Document Link</label>
                <input
                  type="text"
                  placeholder="https://drive.google.com/file/d/your-homework.pdf"
                  value={submitForm.attachmentUrl}
                  onChange={(e) => setSubmitForm({ ...submitForm, attachmentUrl: e.target.value })}
                  className="w-full mt-1 px-3 py-2 rounded-xl bg-gray-950 border border-gray-800 text-white"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-gray-800">
              <Button variant="outline" size="sm" onClick={() => setIsSubmitModalOpen(false)}>
                Cancel
              </Button>
              <Button
                size="sm"
                disabled={submitMutation.isPending}
                onClick={() =>
                  submitMutation.mutate({
                    assignmentId: selectedAssignment.id,
                    studentId: user?.id || '',
                    submissionText: submitForm.submissionText,
                    attachmentUrl: submitForm.attachmentUrl,
                  })
                }
              >
                Submit Homework
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: Teacher Submission Grading Drawer */}
      {isGradingDrawerOpen && selectedAssignment && selectedSubmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-md glass-panel p-6 rounded-3xl border border-amber-500/30 space-y-4 bg-gray-900">
            <div className="flex items-center justify-between border-b border-gray-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Award className="h-5 w-5 text-amber-400" /> Grade Student Homework
                </h3>
                <p className="text-[10px] text-gray-400">
                  Student: {selectedSubmission.student?.firstName} {selectedSubmission.student?.lastName}
                </p>
              </div>
              <button onClick={() => setIsGradingDrawerOpen(false)} className="text-gray-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            {selectedSubmission.submissionText && (
              <div className="p-3 rounded-xl bg-gray-950 border border-gray-800 text-xs">
                <span className="text-[10px] text-gray-400 block mb-1">Student Answer:</span>
                <p className="text-gray-200">{selectedSubmission.submissionText}</p>
              </div>
            )}

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-gray-300 font-medium block">
                  Score / Marks Obtained (Max: {selectedAssignment.totalPoints})
                </label>
                <input
                  type="number"
                  max={selectedAssignment.totalPoints}
                  value={gradeForm.marksObtained}
                  onChange={(e) => setGradeForm({ ...gradeForm, marksObtained: Number(e.target.value) })}
                  className="w-full mt-1 px-3 py-2 rounded-xl bg-gray-950 border border-gray-800 text-white font-mono text-sm"
                />
              </div>

              <div>
                <label className="text-gray-300 font-medium block">Teacher Written Feedback & Comments</label>
                <textarea
                  rows={3}
                  placeholder="Provide constructive feedback for the student..."
                  value={gradeForm.feedback}
                  onChange={(e) => setGradeForm({ ...gradeForm, feedback: e.target.value })}
                  className="w-full mt-1 px-3 py-2 rounded-xl bg-gray-950 border border-gray-800 text-white"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-gray-800">
              <Button variant="outline" size="sm" onClick={() => setIsGradingDrawerOpen(false)}>
                Cancel
              </Button>
              <Button
                size="sm"
                disabled={gradeMutation.isPending}
                onClick={() =>
                  gradeMutation.mutate({
                    submissionId: selectedSubmission.id,
                    marksObtained: gradeForm.marksObtained,
                    feedback: gradeForm.feedback,
                  })
                }
                className="bg-amber-600 hover:bg-amber-500"
              >
                Submit Grade & Feedback
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
