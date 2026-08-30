import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import { Sidebar } from '../components/layout/Sidebar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { documentService } from '../services/document.service';
import {
  FileText,
  Upload,
  Download,
  Trash2,
  Lock,
  Filter,
  Paperclip,
  AlertCircle,
  File,
  Image as ImageIcon,
} from 'lucide-react';

export const DocumentsPage: React.FC = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [selectedEntityType, setSelectedEntityType] = useState<string>('');
  const [filterEntityType, setFilterEntityType] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [entityIdInput, setEntityIdInput] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Fetch documents
  const { data: documents = [], isLoading } = useQuery({
    queryKey: ['documents', filterEntityType],
    queryFn: () => documentService.listDocuments(filterEntityType || undefined),
  });

  // Upload mutation
  const uploadMutation = useMutation({
    mutationFn: documentService.uploadDocument,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      setSelectedFile(null);
      setSelectedEntityType('');
      setEntityIdInput('');
      setErrorMessage(null);
    },
    onError: (err: any) => {
      setErrorMessage(err?.response?.data?.message || 'File upload failed. Max size 10MB.');
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: documentService.deleteDocument,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 10 * 1024 * 1024) {
        setErrorMessage('File size exceeds 10MB limit.');
        return;
      }
      setSelectedFile(file);
      setErrorMessage(null);
    }
  };

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile || !selectedEntityType) {
      setErrorMessage('Please select a file and entity category.');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('entityType', selectedEntityType);
    if (entityIdInput) {
      formData.append('entityId', entityIdInput);
    }

    uploadMutation.mutate(formData);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith('image/')) return <ImageIcon className="h-5 w-5 text-purple-400" />;
    if (mimeType === 'application/pdf') return <FileText className="h-5 w-5 text-rose-400" />;
    return <File className="h-5 w-5 text-blue-400" />;
  };

  if (!user) return null;

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <Sidebar />

      <div className="flex-1 space-y-6">
        {/* Header */}
        <div className="glass-panel p-6 rounded-3xl border border-purple-500/20 bg-gradient-to-r from-purple-950/40 via-gray-900/60 to-indigo-950/40">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <Badge variant="purple" className="mb-2 gap-1.5 font-mono">
                <Lock className="h-3.5 w-3.5 text-purple-400" /> Phase 19 Secure Document Vault
              </Badge>
              <h2 className="text-2xl font-extrabold text-white">Document Management Repository</h2>
              <p className="text-xs text-gray-400 mt-1">
                Encrypted & role-restricted document storage for Students, Parents, Admissions, Assignments, and Leave Requests.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs text-emerald-400 font-semibold font-mono">Private Stream Provider Active</span>
            </div>
          </div>
        </div>

        {/* Upload Form Card */}
        <Card className="border-gray-800 bg-gray-900/50">
          <CardHeader>
            <CardTitle className="text-sm font-bold text-white flex items-center gap-2">
              <Upload className="h-4 w-4 text-purple-400" /> Secure Document Upload
            </CardTitle>
            <CardDescription className="text-xs text-gray-400">
              Upload documents (PDF, JPG, PNG, WEBP, DOCX). Maximum file size: 10MB.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUploadSubmit} className="space-y-4">
              {errorMessage && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-rose-400 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-[11px] font-medium text-gray-400 mb-1 block">Entity Category *</label>
                  <select
                    value={selectedEntityType}
                    onChange={(e) => setSelectedEntityType(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-xl bg-gray-950 border border-gray-800 text-xs text-white"
                  >
                    <option value="">Select Category...</option>
                    <option value="STUDENT">Student Record</option>
                    <option value="PARENT">Parent Verification</option>
                    <option value="ADMISSION">Admission File</option>
                    <option value="ASSIGNMENT">Assignment Attachments</option>
                    <option value="LEAVE_REQUEST">Leave Support Document</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-medium text-gray-400 mb-1 block">Associated Entity ID (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. STU-2026-001"
                    value={entityIdInput}
                    onChange={(e) => setEntityIdInput(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-gray-950 border border-gray-800 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-medium text-gray-400 mb-1 block">Select File *</label>
                  <input
                    type="file"
                    onChange={handleFileChange}
                    accept=".pdf,.jpg,.jpeg,.png,.webp,.doc,.docx"
                    required
                    className="w-full px-3 py-1.5 rounded-xl bg-gray-950 border border-gray-800 text-xs text-gray-300 file:mr-2 file:py-1 file:px-2 file:rounded-lg file:border-0 file:text-xs file:bg-purple-600 file:text-white hover:file:bg-purple-500"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={uploadMutation.isPending}
                  className="gap-2 text-xs bg-purple-600 hover:bg-purple-500"
                >
                  <Upload className="h-4 w-4" />
                  {uploadMutation.isPending ? 'Uploading...' : 'Upload Document'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Document Repository Table */}
        <Card className="border-gray-800 bg-gray-900/50">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <CardTitle className="text-sm font-bold text-white flex items-center gap-2">
                <Paperclip className="h-4 w-4 text-emerald-400" /> Stored Vault Documents
              </CardTitle>
              <CardDescription className="text-xs text-gray-400">
                {documents.length} document(s) uploaded in secure storage provider.
              </CardDescription>
            </div>

            {/* Category Filter */}
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <select
                value={filterEntityType}
                onChange={(e) => setFilterEntityType(e.target.value)}
                className="px-3 py-1.5 rounded-xl bg-gray-950 border border-gray-800 text-xs text-white"
              >
                <option value="">All Categories</option>
                <option value="STUDENT">Student</option>
                <option value="PARENT">Parent</option>
                <option value="ADMISSION">Admission</option>
                <option value="ASSIGNMENT">Assignment</option>
                <option value="LEAVE_REQUEST">Leave Request</option>
              </select>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            {isLoading ? (
              <p className="p-6 text-center text-xs text-gray-500">Loading documents...</p>
            ) : documents.length === 0 ? (
              <p className="p-6 text-center text-xs text-gray-500">No documents found matching category.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-950/80 text-gray-400 border-y border-gray-800 uppercase font-mono text-[10px]">
                    <tr>
                      <th className="p-3.5">File Details</th>
                      <th className="p-3.5">Category</th>
                      <th className="p-3.5">Size</th>
                      <th className="p-3.5">Uploaded By</th>
                      <th className="p-3.5">Date</th>
                      <th className="p-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800">
                    {documents.map((doc: any) => (
                      <tr key={doc.id} className="hover:bg-gray-800/30 transition-all">
                        <td className="p-3.5">
                          <div className="flex items-center gap-2.5">
                            {getFileIcon(doc.mimeType)}
                            <div>
                              <p className="font-bold text-white max-w-[200px] truncate">{doc.originalName}</p>
                              <p className="text-[10px] text-gray-400 font-mono">{doc.mimeType}</p>
                            </div>
                          </div>
                        </td>

                        <td className="p-3.5">
                          <Badge variant="purple" className="text-[10px] font-mono">
                            {doc.entityType}
                          </Badge>
                        </td>

                        <td className="p-3.5 font-mono text-gray-300">
                          {formatFileSize(doc.size)}
                        </td>

                        <td className="p-3.5 text-gray-300">
                          {doc.uploadedBy ? `${doc.uploadedBy.firstName} ${doc.uploadedBy.lastName}` : 'System'}
                        </td>

                        <td className="p-3.5 text-gray-400 font-mono">
                          {new Date(doc.createdAt).toLocaleDateString()}
                        </td>

                        <td className="p-3.5 text-right space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => documentService.downloadDocument(doc.id, doc.originalName)}
                            className="text-[11px] gap-1 h-7 bg-emerald-950/30 hover:bg-emerald-900/50 border-emerald-500/30 text-emerald-300"
                          >
                            <Download className="h-3 w-3" /> Stream Download
                          </Button>

                          {(user.role === 'SUPER_ADMIN' || doc.uploadedById === user.id) && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => deleteMutation.mutate(doc.id)}
                              disabled={deleteMutation.isPending}
                              className="text-[11px] gap-1 h-7 bg-rose-950/30 hover:bg-rose-900/50 border-rose-500/30 text-rose-300"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
