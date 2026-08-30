import { apiClient as api } from '../lib/axios';

export const dashboardService = {
  getSuperAdminDashboard: async () => {
    const response = await api.get('/v1/dashboard/super-admin');
    return response.data.data;
  },

  getAdmissionAdminDashboard: async () => {
    const response = await api.get('/v1/dashboard/admission-admin');
    return response.data.data;
  },

  getTeacherDashboard: async () => {
    const response = await api.get('/v1/dashboard/teacher');
    return response.data.data;
  },

  getFinanceDashboard: async () => {
    const response = await api.get('/v1/dashboard/finance');
    return response.data.data;
  },

  getStudentDashboard: async () => {
    const response = await api.get('/v1/dashboard/student');
    return response.data.data;
  },

  getParentDashboard: async () => {
    const response = await api.get('/v1/dashboard/parent');
    return response.data.data;
  },
};
