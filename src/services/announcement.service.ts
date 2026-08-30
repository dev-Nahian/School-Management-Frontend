import { apiClient as api } from '../lib/axios';

export type TargetAudience = 'EVERYONE' | 'TEACHERS' | 'STUDENTS' | 'PARENTS' | 'CLASS' | 'SECTION';

export interface AnnouncementModel {
  id: string;
  title: string;
  description: string;
  targetAudience: TargetAudience;
  classId?: string;
  sectionId?: string;
  publishDate: string;
  expiryDate?: string;
  attachmentUrl?: string;
  isRead: boolean;
  class?: { name: string };
  section?: { name: string };
  createdAt: string;
}

export const announcementService = {
  getAnnouncements: async (): Promise<AnnouncementModel[]> => {
    const response = await api.get('/v1/announcements');
    return response.data.data;
  },

  createAnnouncement: async (input: {
    title: string;
    description: string;
    targetAudience: TargetAudience;
    classId?: string;
    sectionId?: string;
    publishDate?: string;
    expiryDate?: string;
    attachmentUrl?: string;
  }): Promise<AnnouncementModel> => {
    const response = await api.post('/v1/announcements', input);
    return response.data.data;
  },

  markAsRead: async (id: string): Promise<void> => {
    await api.post(`/v1/announcements/${id}/read`);
  },

  deleteAnnouncement: async (id: string): Promise<void> => {
    await api.delete(`/v1/announcements/${id}`);
  },
};
