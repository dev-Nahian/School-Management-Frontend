import { apiClient } from '../lib/axios';
import type { LoginCredentials, LoginResponse, AuthUser, ChangePasswordCredentials } from '../types/auth';

export const authService = {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const response = await apiClient.post<{ success: boolean; data: LoginResponse }>('/v1/auth/login', credentials);
    return response.data.data;
  },

  async logout(): Promise<void> {
    const refreshToken = localStorage.getItem('refreshToken');
    try {
      await apiClient.post('/v1/auth/logout', { refreshToken });
    } catch {
      // Ignore errors during logout
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
    }
  },

  async getMe(): Promise<AuthUser> {
    const response = await apiClient.get<{ success: boolean; data: AuthUser }>('/v1/auth/me');
    return response.data.data;
  },

  async changePassword(credentials: ChangePasswordCredentials): Promise<string> {
    const response = await apiClient.post<{ success: boolean; message: string }>('/v1/auth/change-password', credentials);
    return response.data.message;
  },

  async testRoleEndpoint(roleEndpoint: string): Promise<{ success: boolean; message: string }> {
    const response = await apiClient.get<{ success: boolean; message: string }>(`/v1/test/${roleEndpoint}`);
    return response.data;
  },
};
