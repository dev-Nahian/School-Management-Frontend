export type UserRole =
  | 'SUPER_ADMIN'
  | 'ADMISSION_ADMIN'
  | 'TEACHER'
  | 'FINANCE'
  | 'STUDENT'
  | 'PARENT';

export interface HealthStatusResponse {
  status: 'ok' | 'degraded' | 'error';
  frontend: string;
  backend: string;
  database: string;
  isDbConnected: boolean;
  timestamp: string;
  uptime: number;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  phone?: string;
  avatarUrl?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
