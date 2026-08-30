import { apiClient as api } from '../lib/axios';

export interface TeacherModel {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  isActive: boolean;
  teacherProfile?: {
    employeeId: string;
    qualification?: string;
    specialization?: string;
    joiningDate?: string;
  };
  teacherAssignments?: {
    id: string;
    subject?: { id: string; name: string; code: string };
    section?: { id: string; name: string; class?: { name: string; code: string } };
  }[];
}

export interface TeacherDashboardData {
  todaySchedule: {
    id: string;
    time: string;
    subject: string;
    className: string;
    sectionName: string;
    room: string;
    status: string;
  }[];
  assignedClasses: {
    id: string;
    name: string;
    studentCount: number;
  }[];
  assignedSubjects: {
    id: string;
    name: string;
    code: string;
  }[];
  attendanceTasks: {
    id: string;
    className: string;
    date: string;
    status: string;
  }[];
  upcomingExams: {
    id: string;
    name: string;
    class: string;
    date: string;
  }[];
  activeAssignments: {
    id: string;
    title: string;
    dueDate: string;
    totalSubmissions: number;
  }[];
  announcements: {
    id: string;
    title: string;
    date: string;
    author: string;
    content: string;
  }[];
}

export const teacherService = {
  getTeachers: async (): Promise<TeacherModel[]> => {
    const response = await api.get('/v1/teachers');
    return response.data.data;
  },

  createTeacher: async (input: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    qualification?: string;
    specialization?: string;
  }): Promise<TeacherModel> => {
    const response = await api.post('/v1/teachers', input);
    return response.data.data;
  },

  updateTeacher: async (id: string, input: Partial<TeacherModel>): Promise<TeacherModel> => {
    const response = await api.patch(`/v1/teachers/${id}`, input);
    return response.data.data;
  },

  assignClassSubject: async (input: {
    teacherId: string;
    subjectId: string;
    sectionId: string;
  }): Promise<any> => {
    const response = await api.post('/v1/teachers/assign-class', input);
    return response.data.data;
  },

  getTeacherDashboard: async (): Promise<TeacherDashboardData> => {
    const response = await api.get('/v1/teachers/dashboard');
    return response.data.data;
  },
};
