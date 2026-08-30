import { apiClient as api } from '../lib/axios';

export const reportService = {
  getStudentReport: async (params?: { classId?: string; status?: string }) => {
    const response = await api.get('/v1/reports/students', { params });
    return response.data.data;
  },

  getAttendanceReport: async (params?: { classId?: string; sectionId?: string; startDate?: string; endDate?: string }) => {
    const response = await api.get('/v1/reports/attendance', { params });
    return response.data.data;
  },

  getFinanceReport: async (params?: { startDate?: string; endDate?: string }) => {
    const response = await api.get('/v1/reports/finance', { params });
    return response.data.data;
  },

  getAcademicReport: async (params?: { examId?: string; classId?: string }) => {
    const response = await api.get('/v1/reports/academic', { params });
    return response.data.data;
  },

  exportCSV: (filename: string, headers: string[], rows: (string | number)[][]) => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.map((val) => `"${String(val).replace(/"/g, '""')}"`).join(','))].join(
        '\n'
      );
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${filename}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },
};
