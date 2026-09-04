import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Sidebar } from '../components/layout/Sidebar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { useAuth } from '../context/AuthContext';
import { announcementService } from '../services/announcement.service';
import { structureService } from '../services/structure.service';
import {
  Megaphone,
  Plus,
  Trash2,
  AlertCircle,
  CheckCircle2,
  X,
  ExternalLink,
  Users,
  Check,
  Globe,
  GraduationCap,
  Briefcase,
  Layers,
} from 'lucide-react';
import type { TargetAudience } from '../services/announcement.service';

export const AnnouncementPage: React.FC = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const isSuperAdmin = user?.role === 'SUPER_ADMIN' || user?.role === 'ADMISSION_ADMIN' || user?.role === 'FINANCE';

  // Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Form State
  const [form, setForm] = useState({
    title: '',
    description: '',
    targetAudience: 'EVERYONE' as TargetAudience,
    classId: '',
    sectionId: '',
    publishDate: new Date().toISOString().split('T')[0],
    expiryDate: '',
    attachmentUrl: '',
  });

  const [feedbackMsg, setFeedbackMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Queries
  const { data: announcements = [], isLoading } = useQuery({
    queryKey: ['announcementsList'],
    queryFn: announcementService.getAnnouncements,
  });

  const { data: classes = [] } = useQuery({
    queryKey: ['classesAnnouncementModal'],
    queryFn: structureService.getClasses,
  });

  const { data: allSections = [] } = useQuery({
    queryKey: ['sectionsAnnouncementModal'],
    queryFn: structureService.getSections,
  });

  const modalSections = (allSections as any[]).filter(
    (sec) => !form.classId || sec.classId === form.classId
  );

  // Mutations
  const createMutation = useMutation({
    mutationFn: announcementService.createAnnouncement,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['announcementsList'] });
      setIsCreateModalOpen(false);
      setFeedbackMsg('Broadcast announcement published successfully!');
      setErrorMsg('');
    },
    onError: (err: any) => {
      setErrorMsg(err?.response?.data?.message || err.message || 'Failed to publish announcement.');
    },
  });

  const readMutation = useMutation({
    mutationFn: announcementService.markAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['announcementsList'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: announcementService.deleteAnnouncement,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['announcementsList'] });
      setFeedbackMsg('Announcement deleted.');
      setErrorMsg('');
    },
  });

  const getAudienceIcon = (target: TargetAudience) => {
    switch (target) {
      case 'EVERYONE':
        return <Globe className="h-3.5 w-3.5 text-blue-400" />;
      case 'TEACHERS':
        return <Briefcase className="h-3.5 w-3.5 text-purple-400" />;
      case 'STUDENTS':
        return <GraduationCap className="h-3.5 w-3.5 text-emerald-400" />;
      case 'PARENTS':
        return <Users className="h-3.5 w-3.5 text-amber-400" />;
      default:
        return <Layers className="h-3.5 w-3.5 text-indigo-400" />;
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <Sidebar />

      <div className="flex-1 space-y-6">
        {/* Banner */}
        <div className="glass-panel p-6 rounded-3xl border border-blue-500/20 bg-gradient-to-r from-blue-950/40 via-gray-900/60 to-indigo-950/40">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <Badge variant="info" className="mb-2 gap-1.5 font-mono">
                <Megaphone className="h-3.5 w-3.5 text-blue-400" /> Phase 13 Official Announcements
              </Badge>
              <h2 className="text-2xl font-extrabold text-white">Broadcast Notices & Circulars</h2>
              <p className="text-xs text-gray-400 mt-1">
                One-way school-wide notices, targeted role circulars, and class announcements.
              </p>
            </div>

            {isSuperAdmin && (
              <Button size="sm" onClick={() => setIsCreateModalOpen(true)} className="gap-1.5 text-xs bg-blue-600 hover:bg-blue-500">
                <Plus className="h-4 w-4" /> Broadcast Notice
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

        {/* Feed List */}
        <div className="space-y-4">
          {isLoading ? (
            <Card className="border-gray-800 p-8 text-center text-xs text-gray-400">
              Loading notices...
            </Card>
          ) : announcements.length === 0 ? (
            <Card className="border-gray-800 p-8 text-center bg-gray-900/40">
              <Megaphone className="h-10 w-10 text-blue-400 mx-auto mb-2 opacity-60" />
              <CardTitle className="text-base text-gray-200">No Active Announcements</CardTitle>
              <CardDescription className="text-xs max-w-sm mx-auto mt-1">
                New school broadcasts, exam schedules, and holiday notices will appear here.
              </CardDescription>
            </Card>
          ) : (
            announcements.map((ann) => (
              <Card
                key={ann.id}
                className={`border-gray-800 transition-all ${
                  !ann.isRead ? 'bg-gradient-to-r from-blue-950/20 via-gray-900 to-gray-900 border-l-4 border-l-blue-500' : 'bg-gray-900/60 opacity-90'
                }`}
              >
                <CardHeader className="pb-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="purple" className="text-[10px] gap-1 font-mono uppercase">
                        {getAudienceIcon(ann.targetAudience)} {ann.targetAudience}
                      </Badge>

                      {ann.class && (
                        <Badge variant="info" className="text-[10px]">
                          {ann.class.name} {ann.section ? `• Section ${ann.section.name}` : ''}
                        </Badge>
                      )}

                      {!ann.isRead && (
                        <Badge variant="warning" className="text-[9px] font-bold">
                          NEW
                        </Badge>
                      )}
                    </div>

                    <span className="text-[10px] font-mono text-gray-400">
                      Published: {new Date(ann.publishDate).toLocaleDateString()}
                    </span>
                  </div>

                  <CardTitle className="text-lg text-white mt-2 flex items-center justify-between">
                    <span>{ann.title}</span>
                  </CardTitle>
                </CardHeader>

                <CardContent className="space-y-4 pt-1">
                  <p className="text-xs text-gray-300 leading-relaxed whitespace-pre-line">{ann.description}</p>

                  <div className="flex items-center justify-between pt-2 border-t border-gray-800/80 text-xs">
                    <div className="flex items-center gap-3">
                      {ann.attachmentUrl && (
                        <a
                          href={ann.attachmentUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[11px] text-blue-400 hover:text-blue-300 flex items-center gap-1 font-medium underline"
                        >
                          <ExternalLink className="h-3 w-3" /> View Attachment Resource
                        </a>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {!ann.isRead && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => readMutation.mutate(ann.id)}
                          className="h-7 text-[10px] gap-1 text-emerald-400 border-emerald-500/30"
                        >
                          <Check className="h-3 w-3" /> Mark as Read
                        </Button>
                      )}

                      {isSuperAdmin && (
                        <button
                          onClick={() => deleteMutation.mutate(ann.id)}
                          className="text-gray-500 hover:text-rose-400 transition-colors p-1"
                          title="Delete notice"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* MODAL: Create Broadcast Notice */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg glass-panel p-6 rounded-3xl border border-blue-500/30 space-y-4 bg-gray-900">
            <div className="flex items-center justify-between border-b border-gray-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Megaphone className="h-5 w-5 text-blue-400" /> Broadcast School Notice
              </h3>
              <button onClick={() => setIsCreateModalOpen(false)} className="text-gray-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-gray-300 font-medium block">Notice Title</label>
                <input
                  type="text"
                  placeholder="e.g. Annual Sports Day & Holiday Schedule"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full mt-1 px-3 py-2 rounded-xl bg-gray-950 border border-gray-800 text-white"
                />
              </div>

              <div>
                <label className="text-gray-300 font-medium block">Target Audience</label>
                <select
                  value={form.targetAudience}
                  onChange={(e) => setForm({ ...form, targetAudience: e.target.value as TargetAudience })}
                  className="w-full mt-1 px-3 py-2 rounded-xl bg-gray-950 border border-gray-800 text-white"
                >
                  <option value="EVERYONE">Everyone (School-wide)</option>
                  <option value="TEACHERS">Teachers Only</option>
                  <option value="STUDENTS">Students Only</option>
                  <option value="PARENTS">Parents Only</option>
                  <option value="CLASS">Specific Class</option>
                  <option value="SECTION">Specific Section</option>
                </select>
              </div>

              {(form.targetAudience === 'CLASS' || form.targetAudience === 'SECTION') && (
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-gray-300 font-medium block">Target Class</label>
                    <select
                      value={form.classId}
                      onChange={(e) => setForm({ ...form, classId: e.target.value, sectionId: '' })}
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

                  {form.targetAudience === 'SECTION' && (
                    <div>
                      <label className="text-gray-300 font-medium block">Target Section</label>
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
                  )}
                </div>
              )}

              <div>
                <label className="text-gray-300 font-medium block">Notice Content & Instructions</label>
                <textarea
                  rows={4}
                  placeholder="Enter full notice announcement details..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full mt-1 px-3 py-2 rounded-xl bg-gray-950 border border-gray-800 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-gray-300 font-medium block">Publish Date</label>
                  <input
                    type="date"
                    value={form.publishDate}
                    onChange={(e) => setForm({ ...form, publishDate: e.target.value })}
                    className="w-full mt-1 px-3 py-2 rounded-xl bg-gray-950 border border-gray-800 text-white"
                  />
                </div>

                <div>
                  <label className="text-gray-300 font-medium block">Expiry Date (Optional)</label>
                  <input
                    type="date"
                    value={form.expiryDate}
                    onChange={(e) => setForm({ ...form, expiryDate: e.target.value })}
                    className="w-full mt-1 px-3 py-2 rounded-xl bg-gray-950 border border-gray-800 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-gray-300 font-medium block">Attachment URL / Document (Optional)</label>
                <input
                  type="text"
                  placeholder="https://drive.google.com/notice.pdf"
                  value={form.attachmentUrl}
                  onChange={(e) => setForm({ ...form, attachmentUrl: e.target.value })}
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
                disabled={!form.title || !form.description || createMutation.isPending}
                onClick={() => createMutation.mutate(form)}
                className="bg-blue-600 hover:bg-blue-500"
              >
                Publish Broadcast
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
