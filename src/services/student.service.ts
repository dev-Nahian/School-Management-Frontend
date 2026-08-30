import { apiClient as api } from '../lib/axios';
import type {
  StudentModel,
  ParentModel,
  CreateStudentInput,
  StudentQueryParams,
} from '../types/student';

export interface PaginatedStudentResponse {
  success: boolean;
  data: StudentModel[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export const studentService = {
  getStudents: async (params?: StudentQueryParams): Promise<PaginatedStudentResponse> => {
    const response = await api.get('/v1/academic/students', { params });
    return response.data;
  },

  getStudentById: async (id: string): Promise<StudentModel> => {
    const response = await api.get(`/v1/academic/students/${id}`);
    return response.data.data;
  },

  createStudent: async (input: CreateStudentInput): Promise<StudentModel> => {
    const response = await api.post('/v1/academic/students', input);
    return response.data.data;
  },

  updateStudent: async (id: string, input: Partial<CreateStudentInput>): Promise<StudentModel> => {
    const response = await api.patch(`/v1/academic/students/${id}`, input);
    return response.data.data;
  },

  deleteStudent: async (id: string): Promise<void> => {
    await api.delete(`/v1/academic/students/${id}`);
  },

  getParents: async (): Promise<ParentModel[]> => {
    const response = await api.get('/v1/academic/parents');
    return response.data.data;
  },

  exportStudentsCSV: async (params?: StudentQueryParams): Promise<Blob> => {
    const response = await api.get('/v1/academic/students/export/csv', {
      params,
      responseType: 'blob',
    });
    return response.data;
  },
};
