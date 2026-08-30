import { apiClient as api } from '../lib/axios';

export type LeaveStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface LeaveRequestModel {
  id: string;
  studentId: string;
  student?: {
    id: string;
    studentId: string;
    firstName: string;
    lastName: string;
    class?: { name: string };
    section?: { name: string };
  };
  startDate: string;
  endDate: string;
  reason: string;
  attachmentUrl?: string;
  status: LeaveStatus;
  reviewNotes?: string;
  createdAt: string;
}

export const leaveService = {
  getLeaveRequests: async (): Promise<LeaveRequestModel[]> => {
    const response = await api.get('/v1/leave');
    return response.data.data;
  },

  createLeaveRequest: async (input: {
    studentId?: string;
    startDate: string;
    endDate: string;
    reason: string;
    attachmentUrl?: string;
  }): Promise<LeaveRequestModel> => {
    const response = await api.post('/v1/leave', input);
    return response.data.data;
  },

  reviewLeaveRequest: async (
    leaveId: string,
    input: { status: 'APPROVED' | 'REJECTED'; reviewNotes?: string }
  ): Promise<LeaveRequestModel> => {
    const response = await api.post(`/v1/leave/${leaveId}/review`, input);
    return response.data.data;
  },
};
