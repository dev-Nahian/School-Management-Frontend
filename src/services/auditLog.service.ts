import { apiClient as api } from '../lib/axios';

export interface AuditLogItem {
  id: string;
  userId: string | null;
  action: string;
  entity: string;
  entityId: string | null;
  details: any;
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: string;
  user?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
  } | null;
}

export interface AuditLogResponse {
  logs: AuditLogItem[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export const auditLogService = {
  listAuditLogs: async (params?: {
    action?: string;
    entity?: string;
    userId?: string;
    page?: number;
    limit?: number;
  }): Promise<AuditLogResponse> => {
    const response = await api.get('/v1/audit-logs', { params });
    return response.data.data;
  },
};
