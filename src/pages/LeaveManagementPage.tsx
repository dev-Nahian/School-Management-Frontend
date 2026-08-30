import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Sidebar } from '../components/layout/Sidebar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { useAuth } from '../context/AuthContext';
import { leaveService } from '../services/leave.service';
import { studentService } from '../services/student.service';
import {
  Calendar,
  Plus,
  AlertCircle,
  CheckCircle2,
  XCircle,
  X,
  FileText,
  UserCheck,
  Clock,
} from 'lucide-react';
import type { LeaveRequestModel, LeaveStatus } from '../services/leave.service';

export const LeaveManagementPage: React.FC = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const isReviewer = user?.role === 'SUPER_ADMIN' || user?.role === 'TEACHER';
  const isApplicant = user?.role === 'STUDENT' || user?.role === 'PARENT' || user?.role === 'SUPER_ADMIN';

  // Modals State
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [selectedLeaveForReview, setSelectedLeaveForReview] = useState<LeaveRequestModel | null>(null);

  // Forms State
  const [form, setForm] = useState({
    studentId: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    reason: '',
    attachmentUrl: '',
  });

  const [reviewNotes, setReviewNotes] = useState('');
  const [feedbackMsg, setFeedbackMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Queries
  const { data: leaveRequests = [], isLoading } = useQuery({
    queryKey: ['leaveRequestsList'],
    queryFn: leaveService.getLeaveRequests,
  });

  const { data: students = [] } = useQuery({
    queryKey: ['studentsForLeaveSelect'],
    queryFn: () => studentService.getStudents(),
    enabled: user?.role === 'PARENT' || user?.role === 'SUPER_ADMIN',
  });

  // Mutations
  const createMutation = useMutation({
    mutationFn: leaveService.createLeaveRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leaveRequestsList'] });
      setIsApplyModalOpen(false);
      setFeedbackMsg('Leave application submitted successfully!');
      setErrorMsg('');
    },
    onError: (err: any) => {
      setErrorMsg(err?.response?.data?.message || err.message || 'Failed to submit leave request.');
    },
  });

  const reviewMutation = useMutation({
    mutationFn: ({ leaveId, status, notes }: { leaveId: string; status: 'APPROVED' | 'REJECTED'; notes?: string }) =>
      leaveService.reviewLeaveRequest(leaveId, { status, reviewNotes: notes }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leaveRequestsList'] });
      setSelectedLeaveForReview(null);
      setReviewNotes('');
      setFeedbackMsg('Leave request status updated!');
      setErrorMsg('');
    },
    onError: (err: any) => {
      setErrorMsg(err?.response?.data?.message || err.message || 'Failed to review leave request.');
    },
  });

  const getStatusBadge = (status: LeaveStatus) => {
    switch (status) {
      case 'APPROVED':
        return (
          <Badge variant="success" className="gap-1 text-[10px]">
            <CheckCircle2 className="h-3 w-3" /> APPROVED
          </Badge>
        );
      case 'REJECTED':
        return (
          <Badge variant="error" className="gap-1 text-[10px]">
            <XCircle className="h-3 w-3" /> REJECTED
          </Badge>
        );
      default:
        return (
          <Badge variant="warning" className="gap-1 text-[10px]">
            <Clock className="h-3 w-3" /> PENDING REVIEW
          </Badge>
        );
    }
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
                <Calendar className="h-3.5 w-3.5 text-purple-400" /> Phase 15 Leave Management
              </Badge>
              <h2 className="text-2xl font-extrabold text-white">Student Leave Applications & History</h2>
              <p className="text-xs text-gray-400 mt-1">
                Submit absence requests, upload medical certificates, and track teacher/admin approval status.
              </p>
            </div>

            {isApplicant && (
              <Button size="sm" onClick={() => setIsApplyModalOpen(true)} className="gap-1.5 text-xs bg-purple-600 hover:bg-purple-500">
                <Plus className="h-4 w-4" /> Apply for Leave
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

        {/* Leave Requests Table */}
        <Card className="border-gray-800 bg-gray-900/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-white">Leave Requests & Approval History</CardTitle>
            <CardDescription className="text-xs text-gray-400">
              Showing student leave applications for your class/section or children.
            </CardDescription>
          </CardHeader>

          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-gray-300">
                <thead className="bg-gray-950/60 text-gray-400 uppercase font-mono text-[10px] border-b border-gray-800">
                  <tr>
                    <th className="p-3">Student Details</th>
                    <th className="p-3">Leave Duration</th>
                    <th className="p-3">Reason</th>
                    <th className="p-3">Attachment</th>
                    <th className="p-3">Status</th>
                    {isReviewer && <th className="p-3 text-right">Review Action</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {isLoading ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-gray-400">
                        Loading leave applications...
                      </td>
                    </tr>
                  ) : leaveRequests.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-gray-400">
                        No leave applications submitted yet.
                      </td>
                    </tr>
                  ) : (
                    leaveRequests.map((leave) => (
                      <tr key={leave.id} className="hover:bg-gray-800/30 transition-colors">
                        <td className="p-3">
                          <div className="font-medium text-white">
                            {leave.student?.firstName} {leave.student?.lastName}
                          </div>
                          <span className="text-[10px] text-gray-400 font-mono">
                            {leave.student?.studentId} • {leave.student?.class?.name} Section {leave.student?.section?.name}
                          </span>
                        </td>

                        <td className="p-3 font-mono">
                          <div className="text-white">
                            {new Date(leave.startDate).toLocaleDateString()} – {new Date(leave.endDate).toLocaleDateString()}
                          </div>
                          <span className="text-[10px] text-purple-400">
                            {Math.ceil(
                              (new Date(leave.endDate).getTime() - new Date(leave.startDate).getTime()) /
                                (1000 * 3600 * 24)
                            ) + 1}{' '}
                            day(s)
                          </span>
                        </td>

                        <td className="p-3 max-w-xs">
                          <p className="line-clamp-2 text-gray-300">{leave.reason}</p>
                          {leave.reviewNotes && (
                            <p className="text-[10px] text-amber-300 mt-1 italic">
                              Note: {leave.reviewNotes}
                            </p>
                          )}
                        </td>

                        <td className="p-3 font-mono">
                          {leave.attachmentUrl ? (
                            <a
                              href={leave.attachmentUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-blue-400 hover:text-blue-300 flex items-center gap-1 text-[11px] underline"
                            >
                              <FileText className="h-3 w-3" /> Document
                            </a>
                          ) : (
                            <span className="text-gray-500 text-[10px]">None</span>
                          )}
                        </td>

                        <td className="p-3">{getStatusBadge(leave.status)}</td>

                        {isReviewer && (
                          <td className="p-3 text-right">
                            {leave.status === 'PENDING' ? (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setSelectedLeaveForReview(leave)}
                                className="h-7 text-[10px] gap-1 text-purple-300 border-purple-500/30"
                              >
                                <UserCheck className="h-3 w-3" /> Review
                              </Button>
                            ) : (
                              <span className="text-[10px] text-gray-500">Processed</span>
                            )}
                          </td>
                        )}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* MODAL 1: Apply for Leave */}
      {isApplyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg glass-panel p-6 rounded-3xl border border-purple-500/30 space-y-4 bg-gray-900">
            <div className="flex items-center justify-between border-b border-gray-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Calendar className="h-5 w-5 text-purple-400" /> Apply for Student Leave
              </h3>
              <button onClick={() => setIsApplyModalOpen(false)} className="text-gray-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              {(user?.role === 'PARENT' || user?.role === 'SUPER_ADMIN') && (
                <div>
                  <label className="text-gray-300 font-medium block">Select Student</label>
                  <select
                    value={form.studentId}
                    onChange={(e) => setForm({ ...form, studentId: e.target.value })}
                    className="w-full mt-1 px-3 py-2 rounded-xl bg-gray-950 border border-gray-800 text-white"
                  >
                    <option value="">Select Student</option>
                    {(students as any[]).map((s: any) => (
                      <option key={s.id} value={s.id}>
                        {s.firstName} {s.lastName} ({s.studentId})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-gray-300 font-medium block">Start Date</label>
                  <input
                    type="date"
                    value={form.startDate}
                    onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                    className="w-full mt-1 px-3 py-2 rounded-xl bg-gray-950 border border-gray-800 text-white"
                  />
                </div>

                <div>
                  <label className="text-gray-300 font-medium block">End Date</label>
                  <input
                    type="date"
                    value={form.endDate}
                    onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                    className="w-full mt-1 px-3 py-2 rounded-xl bg-gray-950 border border-gray-800 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-gray-300 font-medium block">Reason for Leave</label>
                <textarea
                  rows={3}
                  placeholder="State the reason (e.g. Fever & Doctor recommended 3 days rest)"
                  value={form.reason}
                  onChange={(e) => setForm({ ...form, reason: e.target.value })}
                  className="w-full mt-1 px-3 py-2 rounded-xl bg-gray-950 border border-gray-800 text-white"
                />
              </div>

              <div>
                <label className="text-gray-300 font-medium block">Attachment URL / Medical Note (Optional)</label>
                <input
                  type="text"
                  placeholder="https://drive.google.com/medical_note.pdf"
                  value={form.attachmentUrl}
                  onChange={(e) => setForm({ ...form, attachmentUrl: e.target.value })}
                  className="w-full mt-1 px-3 py-2 rounded-xl bg-gray-950 border border-gray-800 text-white"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-gray-800">
              <Button variant="outline" size="sm" onClick={() => setIsApplyModalOpen(false)}>
                Cancel
              </Button>
              <Button
                size="sm"
                disabled={!form.reason || createMutation.isPending}
                onClick={() => createMutation.mutate(form)}
                className="bg-purple-600 hover:bg-purple-500"
              >
                Submit Application
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Review Leave Request */}
      {selectedLeaveForReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-md glass-panel p-6 rounded-3xl border border-purple-500/30 space-y-4 bg-gray-900">
            <div className="flex items-center justify-between border-b border-gray-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <UserCheck className="h-5 w-5 text-purple-400" /> Review Leave Application
              </h3>
              <button onClick={() => setSelectedLeaveForReview(null)} className="text-gray-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-3 rounded-2xl bg-gray-950 border border-gray-800 text-xs space-y-1">
              <p className="font-bold text-white">
                {selectedLeaveForReview.student?.firstName} {selectedLeaveForReview.student?.lastName}
              </p>
              <p className="text-[11px] text-purple-400 font-mono">
                Duration: {new Date(selectedLeaveForReview.startDate).toLocaleDateString()} to{' '}
                {new Date(selectedLeaveForReview.endDate).toLocaleDateString()}
              </p>
              <p className="text-gray-300 mt-1 italic">"{selectedLeaveForReview.reason}"</p>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-gray-300 font-medium block">Review Notes / Remarks (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Approved. Student must submit missed homework on return."
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  className="w-full mt-1 px-3 py-2 rounded-xl bg-gray-950 border border-gray-800 text-white"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-gray-800">
              <Button
                size="sm"
                variant="outline"
                disabled={reviewMutation.isPending}
                onClick={() =>
                  reviewMutation.mutate({
                    leaveId: selectedLeaveForReview.id,
                    status: 'REJECTED',
                    notes: reviewNotes,
                  })
                }
                className="text-rose-400 border-rose-500/30 hover:bg-rose-950/40"
              >
                Reject Request
              </Button>
              <Button
                size="sm"
                disabled={reviewMutation.isPending}
                onClick={() =>
                  reviewMutation.mutate({
                    leaveId: selectedLeaveForReview.id,
                    status: 'APPROVED',
                    notes: reviewNotes,
                  })
                }
                className="bg-emerald-600 hover:bg-emerald-500"
              >
                Approve Request
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
