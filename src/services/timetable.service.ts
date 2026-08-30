import { apiClient as api } from '../lib/axios';

export type DayOfWeek = 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY';

export interface TimetableEntryModel {
  id: string;
  dayOfWeek: DayOfWeek;
  startTime: string;
  endTime: string;
  classId: string;
  sectionId: string;
  subjectId: string;
  teacherId: string;
  roomNumber: string;
  class?: { name: string; code: string };
  section?: { name: string };
  subject?: { name: string; code: string };
  teacher?: { id: string; firstName: string; lastName: string; email: string };
  createdAt: string;
}

export const timetableService = {
  getTimetables: async (params?: {
    classId?: string;
    sectionId?: string;
    teacherId?: string;
  }): Promise<TimetableEntryModel[]> => {
    const response = await api.get('/v1/timetable', { params });
    return response.data.data;
  },

  createTimetableEntry: async (input: {
    dayOfWeek: DayOfWeek;
    startTime: string;
    endTime: string;
    classId: string;
    sectionId: string;
    subjectId: string;
    teacherId: string;
    roomNumber: string;
  }): Promise<TimetableEntryModel> => {
    const response = await api.post('/v1/timetable', input);
    return response.data.data;
  },

  deleteTimetableEntry: async (id: string): Promise<void> => {
    await api.delete(`/v1/timetable/${id}`);
  },
};
