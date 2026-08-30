import { apiClient as api } from '../lib/axios';

export const documentService = {
  uploadDocument: async (formData: FormData) => {
    const response = await api.post('/v1/documents/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data;
  },

  listDocuments: async (entityType?: string, entityId?: string) => {
    const params: any = {};
    if (entityType) params.entityType = entityType;
    if (entityId) params.entityId = entityId;

    const response = await api.get('/v1/documents', { params });
    return response.data.data;
  },

  downloadDocument: async (documentId: string, filename: string) => {
    const response = await api.get(`/v1/documents/${documentId}/download`, {
      responseType: 'blob',
    });

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  },

  deleteDocument: async (documentId: string) => {
    const response = await api.delete(`/v1/documents/${documentId}`);
    return response.data;
  },
};
