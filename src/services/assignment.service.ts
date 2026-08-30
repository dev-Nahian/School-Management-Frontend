import { apiClient as api } from '../lib/axios';

export type SubmissionStatus = 'PENDING' | 'SUBMITTED' | 'GRADED' | 'LATE';

export interface AssignmentSubmissionModel {
  id: string;
  assignmentId: string;
  studentId: string;
  submissionText?: string;
  attachmentUrl?: string;
  status: SubmissionStatus;
  submittedAt: string;
  marksObtained?: number;
  feedback?: string;
  gradedAt?: string;
  student?: {
    id: string;
    firstName: string;
    lastName: string;
    studentId: string;
    rollNumber: string;
  };
}

export interface AssignmentModel {
  id: string;
  title: string;
  description: string;
  classId: string;
  sectionId: string;
  subjectId: string;
  dueDate: string;
  totalPoints: number;
  attachmentUrl?: string;
  class?: { name: string };
  section?: { name: string };
  subject?: { name: string; code: string };
  submissions?: AssignmentSubmissionModel[];
  createdAt: string;
}

export const assignmentService = {
  getAssignments: async (params?: { classId?: string; sectionId?: string }): Promise<AssignmentModel[]> => {
    const response = await api.get('/v1/assignments', { params });
    return response.data.data;
  },

  createAssignment: async (input: {
    title: string;
    description: string;
    classId: string;
    sectionId: string;
    subjectId: string;
    dueDate: string;
    totalPoints: number;
    attachmentUrl?: string;
  }): Promise<AssignmentModel> => {
    const response = await api.post('/v1/assignments', input);
    return response.data.data;
  },

  submitAssignment: async (input: {
    assignmentId: string;
    studentId: string;
    submissionText?: string;
    attachmentUrl?: string;
  }): Promise<AssignmentSubmissionModel> => {
    const response = await api.post('/v1/assignments/submit', input);
    return response.data.data;
  },

  gradeSubmission: async (input: {
    submissionId: string;
    marksObtained: number;
    feedback?: string;
  }): Promise<AssignmentSubmissionModel> => {
    const response = await api.post('/v1/assignments/grade', input);
    return response.data.data;
  },
};
