import { apiClient as api } from '../lib/axios';

export const dashboardService = {
  getSuperAdminDashboard: async () => {
    const response = await api.get('/v1/dashboard/super-admin');
    return response.data.data;
  },
};
