import { apiClient as api } from '../lib/axios';

export type AttendanceStatusType = 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED';

export interface SubmitAttendanceInput {
  sectionId: string;
  date: string;
  session?: string;
  records: {
    studentId: string;
    status: AttendanceStatusType;
    remarks?: string;
  }[];
}

export interface SectionAttendanceData {
  students: {
    id: string;
    studentId: string;
    firstName: string;
    lastName: string;
    rollNumber: string;
  }[];
  existingRecords: {
    studentId: string;
    status: AttendanceStatusType;
    remarks?: string;
  }[];
}

export interface StudentAttendanceHistory {
  summary: {
    present: number;
    absent: number;
    late: number;
    excused: number;
    total: number;
    attendancePercentage: number;
  };
  records: {
    id: string;
    date: string;
    status: AttendanceStatusType;
    session: string;
    remarks?: string;
  }[];
}

export interface SuperAdminAttendanceMetrics {
  overallPercentage: number;
  totalStudents: number;
  presentToday: number;
  absentToday: number;
  lateToday: number;
  classWiseAttendance: {
    className: string;
    percentage: number;
    present: number;
    total: number;
  }[];
  monthlyTrends: {
    month: string;
    percentage: number;
  }[];
  lowAttendanceStudents: {
    id: string;
    name: string;
    studentId: string;
    class: string;
    percentage: number;
  }[];
}

export const attendanceService = {
  getSectionAttendance: async (sectionId: string, date?: string): Promise<SectionAttendanceData> => {
    const response = await api.get(`/v1/attendance/section/${sectionId}`, {
      params: { date },
    });
    return response.data.data;
  },

  submitAttendance: async (input: SubmitAttendanceInput): Promise<any> => {
    const response = await api.post('/v1/attendance/submit', input);
    return response.data.data;
  },

  getStudentAttendanceHistory: async (studentId: string): Promise<StudentAttendanceHistory> => {
    const response = await api.get(`/v1/attendance/student/${studentId}`);
    return response.data.data;
  },

  getDashboardMetrics: async (): Promise<SuperAdminAttendanceMetrics> => {
    const response = await api.get('/v1/attendance/dashboard');
    return response.data.data;
  },
};
