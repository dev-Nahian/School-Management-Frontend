import { apiClient } from '../lib/axios';
import type { HealthStatusResponse } from '../types';

export const healthService = {
  async checkHealth(): Promise<HealthStatusResponse> {
    const response = await apiClient.get<HealthStatusResponse>('/health');
    return response.data;
  },
};
