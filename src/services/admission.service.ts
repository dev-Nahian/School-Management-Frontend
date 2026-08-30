import { apiClient as api } from '../lib/axios';

export interface AdmissionDashboardStats {
  totalStudents: number;
  todayAdmissions: number;
  monthlyAdmissions: number;
  pendingApplications: number;
  recentAdmissions: any[];
}

export interface FullAdmissionInput {
  studentInfo: {
    firstName: string;
    lastName: string;
    photoUrl?: string;
    dateOfBirth: string;
    gender: string;
    bloodGroup?: string;
    phone?: string;
    email?: string;
    address?: string;
    birthCertificateNo?: string;
  };
  parentInfo: {
    firstName: string;
    lastName: string;
    relationship: 'FATHER' | 'MOTHER' | 'GUARDIAN' | 'OTHER';
    phone: string;
    email?: string;
    occupation?: string;
    address?: string;
  };
  academicInfo: {
    academicYearId: string;
    classId: string;
    sectionId: string;
    rollNumber: string;
  };
  documents?: {
    title: string;
    fileUrl: string;
  }[];
}

export interface AdmissionResult {
  studentId: string;
  parentId: string;
  studentUsername: string;
  parentUsername: string;
  studentName: string;
  parentName: string;
  className: string;
  sectionName: string;
  rollNumber: string;
  admissionDate: string;
  tempPassword: string;
  studentAccountCreated: boolean;
  parentAccountCreated: boolean;
}

export const admissionService = {
  getDashboardStats: async (): Promise<AdmissionDashboardStats> => {
    const response = await api.get('/v1/admissions/dashboard-stats');
    return response.data.data;
  },

  submitAdmission: async (input: FullAdmissionInput): Promise<AdmissionResult> => {
    const response = await api.post('/v1/admissions/submit', input);
    return response.data.data;
  },
};
