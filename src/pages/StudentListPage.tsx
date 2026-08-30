import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Sidebar } from '../components/layout/Sidebar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { useAuth } from '../context/AuthContext';
import { studentService } from '../services/student.service';
import { structureService } from '../services/structure.service';
import {
  GraduationCap,
  Search,
  Printer,
  Plus,
  Eye,
  Trash2,
  ChevronLeft,
  ChevronRight,
  X,
  FileSpreadsheet,
} from 'lucide-react';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import type { StudentStatus, CreateStudentInput } from '../types/student';

export const StudentListPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Search, Filter, Sort & Pagination State
  const [search, setSearch] = useState('');
  const [classFilter, setClassFilter] = useState('');
  const [sectionFilter, setSectionFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<StudentStatus | ''>('');
  const [sortBy, setSortBy] = useState<'name' | 'rollNumber' | 'admissionDate'>('rollNumber');
  const [sortOrder] = useState<'asc' | 'desc'>('asc');
  const [page, setPage] = useState(1);

  // Modal & Confirm Dialog State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const [newStudent, setNewStudent] = useState<CreateStudentInput>({
    firstName: '',
    lastName: '',
    gender: 'Male',
    email: '',
    phone: '',
    classId: '',
    sectionId: '',
    rollNumber: '',
    status: 'ACTIVE',
  });

  const canManage = user?.role === 'SUPER_ADMIN' || user?.role === 'ADMISSION_ADMIN';

  // React Queries
  const { data: studentData } = useQuery({
    queryKey: ['students', search, classFilter, sectionFilter, statusFilter, sortBy, sortOrder, page],
    queryFn: () =>
      studentService.getStudents({
        search: search || undefined,
        classId: classFilter || undefined,
        sectionId: sectionFilter || undefined,
        status: statusFilter || undefined,
        sortBy,
        sortOrder,
        page,
        limit: 8,
      }),
  });

  const { data: classes = [] } = useQuery({
    queryKey: ['classes'],
    queryFn: structureService.getClasses,
  });

  const { data: sections = [] } = useQuery({
    queryKey: ['sections'],
    queryFn: structureService.getSections,
  });

  // Mutations
  const createStudentMutation = useMutation({
    mutationFn: studentService.createStudent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      setIsAddModalOpen(false);
      setNewStudent({
        firstName: '',
        lastName: '',
        gender: 'Male',
        email: '',
        phone: '',
        classId: '',
        sectionId: '',
        rollNumber: '',
        status: 'ACTIVE',
      });
    },
  });

  const deleteStudentMutation = useMutation({
    mutationFn: studentService.deleteStudent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      setDeleteTargetId(null);
    },
  });

  const handleExportCSV = async () => {
    try {
      const blob = await studentService.exportStudentsCSV({
        search: search || undefined,
        classId: classFilter || undefined,
        sectionId: sectionFilter || undefined,
        status: statusFilter || undefined,
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'student_directory_export.csv';
      a.click();
    } catch {
      alert('Failed to export CSV file.');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const students = studentData?.data || [];
  const pagination = studentData?.pagination || { total: 0, page: 1, limit: 8, totalPages: 1 };

  const getStatusBadge = (status: StudentStatus) => {
    switch (status) {
      case 'ACTIVE':
        return <Badge variant="success" className="text-[10px]">ACTIVE</Badge>;
      case 'INACTIVE':
        return <Badge variant="warning" className="text-[10px]">INACTIVE</Badge>;
      case 'GRADUATED':
        return <Badge variant="purple" className="text-[10px]">GRADUATED</Badge>;
      case 'TRANSFERRED':
        return <Badge variant="info" className="text-[10px]">TRANSFERRED</Badge>;
      case 'SUSPENDED':
        return <Badge variant="error" className="text-[10px]">SUSPENDED</Badge>;
      default:
        return <Badge variant="info" className="text-[10px]">{status}</Badge>;
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <Sidebar />

      <div className="flex-1 space-y-6">
        <Breadcrumbs />

        {/* Header Banner */}
        <div className="glass-panel p-6 rounded-3xl border border-purple-500/20 bg-gradient-to-r from-purple-900/30 via-gray-900/40 to-indigo-900/20 print:hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <Badge variant="purple" className="mb-2 gap-1.5 font-mono">
                <GraduationCap className="h-3.5 w-3.5" /> Phase 4 Student Directory
              </Badge>
              <h2 className="text-2xl font-extrabold text-white">
                Student Roster & Enrollment Registry
              </h2>
              <p className="text-xs text-gray-400 mt-1">
                Manage student profiles, class allocations, status records, and parent linkages.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button size="sm" variant="outline" onClick={handleExportCSV} className="gap-1.5 text-xs">
                <FileSpreadsheet className="h-4 w-4 text-emerald-400" /> Export CSV
              </Button>

              <Button size="sm" variant="outline" onClick={handlePrint} className="gap-1.5 text-xs">
                <Printer className="h-4 w-4 text-sky-400" /> Print List
              </Button>

              {canManage && (
                <Button size="sm" onClick={() => setIsAddModalOpen(true)} className="gap-1.5 text-xs">
                  <Plus className="h-4 w-4" /> Admit Student
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Filter & Toolbar Control Bar */}
        <Card className="border-gray-800 print:hidden">
          <CardContent className="p-4 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
              {/* Search Field */}
              <div className="relative md:col-span-2">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search name, ID, roll number..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-gray-950 border border-gray-800 text-white text-xs placeholder:text-gray-500 focus:border-purple-500 focus:outline-none"
                />
              </div>

              {/* Class Filter */}
              <div>
                <select
                  value={classFilter}
                  onChange={(e) => {
                    setClassFilter(e.target.value);
                    setPage(1);
                  }}
                  className="w-full px-3 py-2 rounded-xl bg-gray-950 border border-gray-800 text-white text-xs focus:border-purple-500 focus:outline-none"
                >
                  <option value="">All Classes</option>
                  {classes.map((cls) => (
                    <option key={cls.id} value={cls.id}>
                      {cls.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Section Filter */}
              <div>
                <select
                  value={sectionFilter}
                  onChange={(e) => {
                    setSectionFilter(e.target.value);
                    setPage(1);
                  }}
                  className="w-full px-3 py-2 rounded-xl bg-gray-950 border border-gray-800 text-white text-xs focus:border-purple-500 focus:outline-none"
                >
                  <option value="">All Sections</option>
                  {sections.map((sec) => (
                    <option key={sec.id} value={sec.id}>
                      {sec.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Status Filter */}
              <div>
                <select
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value as StudentStatus);
                    setPage(1);
                  }}
                  className="w-full px-3 py-2 rounded-xl bg-gray-950 border border-gray-800 text-white text-xs focus:border-purple-500 focus:outline-none"
                >
                  <option value="">All Statuses</option>
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="INACTIVE">INACTIVE</option>
                  <option value="GRADUATED">GRADUATED</option>
                  <option value="TRANSFERRED">TRANSFERRED</option>
                  <option value="SUSPENDED">SUSPENDED</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Student Table View */}
        <Card className="border-gray-800">
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg">Registered Students ({pagination.total})</CardTitle>
              <CardDescription className="text-xs">
                Showing page {pagination.page} of {pagination.totalPages}
              </CardDescription>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-gray-400">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-gray-950 border border-gray-800 text-white text-xs px-2 py-1 rounded-lg"
              >
                <option value="rollNumber">Roll Number</option>
                <option value="name">Student Name</option>
                <option value="admissionDate">Admission Date</option>
              </select>
            </div>
          </CardHeader>

          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-950/70 text-gray-400 font-semibold border-b border-gray-800">
                  <tr>
                    <th className="p-3">Student Details</th>
                    <th className="p-3">Student ID</th>
                    <th className="p-3">Class & Section</th>
                    <th className="p-3">Roll No.</th>
                    <th className="p-3">Primary Guardian</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right print:hidden">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/60">
                  {students.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-6 text-center text-gray-400 italic">
                        No student records match the specified search or filter criteria.
                      </td>
                    </tr>
                  ) : (
                    students.map((st) => (
                      <tr key={st.id} className="hover:bg-gray-800/30 transition-colors">
                        <td className="p-3 font-bold text-white flex items-center gap-3">
                          <img
                            src={
                              st.photoUrl ||
                              `https://api.dicebear.com/7.x/bottts/svg?seed=${st.firstName}`
                            }
                            alt={st.firstName}
                            className="h-8 w-8 rounded-full object-cover border border-purple-500/30"
                          />
                          <div>
                            <span className="block">{st.firstName} {st.lastName}</span>
                            <span className="text-[10px] font-normal text-gray-400">{st.email || 'No email registered'}</span>
                          </div>
                        </td>
                        <td className="p-3 font-mono text-purple-300 font-semibold">{st.studentId}</td>
                        <td className="p-3 text-gray-300">
                          {st.class?.name || 'Grade 8'} - {st.section?.name || 'Section A'}
                        </td>
                        <td className="p-3 font-mono text-gray-300 font-bold">{st.rollNumber}</td>
                        <td className="p-3 text-gray-300">
                          {st.parents && st.parents.length > 0
                            ? `${st.parents[0].parent?.firstName} ${st.parents[0].parent?.lastName} (${st.parents[0].relationship})`
                            : 'Unassigned'}
                        </td>
                        <td className="p-3">{getStatusBadge(st.status)}</td>
                        <td className="p-3 text-right print:hidden">
                          <div className="flex items-center justify-end gap-1.5">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => navigate(`/students/${st.id}`)}
                              className="h-7 px-2 text-[10px] gap-1"
                            >
                              <Eye className="h-3 w-3 text-purple-400" /> View Profile
                            </Button>

                            {canManage && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setDeleteTargetId(st.id)}
                                className="h-7 px-2 text-[10px] text-red-400 hover:text-red-300"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-800/80 text-xs print:hidden">
              <span className="text-gray-400">
                Page {pagination.page} of {pagination.totalPages} ({pagination.total} records)
              </span>

              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  disabled={pagination.page <= 1}
                  onClick={() => setPage((p) => Math.max(p - 1, 1))}
                  className="h-7 px-2.5 gap-1 text-xs"
                >
                  <ChevronLeft className="h-3.5 w-3.5" /> Previous
                </Button>

                <Button
                  size="sm"
                  variant="outline"
                  disabled={pagination.page >= pagination.totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="h-7 px-2.5 gap-1 text-xs"
                >
                  Next <ChevronRight className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ADMIT STUDENT MODAL DIALOG */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 print:hidden">
          <div className="w-full max-w-lg glass-panel p-6 rounded-3xl border border-purple-500/30 space-y-4 bg-gray-900">
            <div className="flex items-center justify-between border-b border-gray-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-purple-400" /> Student Admission Form
              </h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-gray-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] text-gray-300 font-medium block">First Name</label>
                <input
                  type="text"
                  value={newStudent.firstName}
                  onChange={(e) => setNewStudent({ ...newStudent, firstName: e.target.value })}
                  placeholder="Julian"
                  className="w-full mt-1 px-3 py-2 rounded-xl bg-gray-950 border border-gray-800 text-white text-xs"
                />
              </div>

              <div>
                <label className="text-[11px] text-gray-300 font-medium block">Last Name</label>
                <input
                  type="text"
                  value={newStudent.lastName}
                  onChange={(e) => setNewStudent({ ...newStudent, lastName: e.target.value })}
                  placeholder="Vance"
                  className="w-full mt-1 px-3 py-2 rounded-xl bg-gray-950 border border-gray-800 text-white text-xs"
                />
              </div>

              <div>
                <label className="text-[11px] text-gray-300 font-medium block">Class Allocation</label>
                <select
                  value={newStudent.classId}
                  onChange={(e) => setNewStudent({ ...newStudent, classId: e.target.value })}
                  className="w-full mt-1 px-3 py-2 rounded-xl bg-gray-950 border border-gray-800 text-white text-xs"
                >
                  <option value="">Select Class</option>
                  {classes.map((cls) => (
                    <option key={cls.id} value={cls.id}>
                      {cls.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11px] text-gray-300 font-medium block">Section Allocation</label>
                <select
                  value={newStudent.sectionId}
                  onChange={(e) => setNewStudent({ ...newStudent, sectionId: e.target.value })}
                  className="w-full mt-1 px-3 py-2 rounded-xl bg-gray-950 border border-gray-800 text-white text-xs"
                >
                  <option value="">Select Section</option>
                  {sections.map((sec) => (
                    <option key={sec.id} value={sec.id}>
                      {sec.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11px] text-gray-300 font-medium block">Roll Number</label>
                <input
                  type="text"
                  value={newStudent.rollNumber}
                  onChange={(e) => setNewStudent({ ...newStudent, rollNumber: e.target.value })}
                  placeholder="01"
                  className="w-full mt-1 px-3 py-2 rounded-xl bg-gray-950 border border-gray-800 text-white text-xs font-mono"
                />
              </div>

              <div>
                <label className="text-[11px] text-gray-300 font-medium block">Student Status</label>
                <select
                  value={newStudent.status}
                  onChange={(e) => setNewStudent({ ...newStudent, status: e.target.value as StudentStatus })}
                  className="w-full mt-1 px-3 py-2 rounded-xl bg-gray-950 border border-gray-800 text-white text-xs"
                >
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="INACTIVE">INACTIVE</option>
                  <option value="GRADUATED">GRADUATED</option>
                  <option value="TRANSFERRED">TRANSFERRED</option>
                  <option value="SUSPENDED">SUSPENDED</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-gray-800">
              <Button variant="outline" size="sm" onClick={() => setIsAddModalOpen(false)}>
                Cancel
              </Button>
              <Button
                size="sm"
                disabled={!newStudent.firstName || !newStudent.lastName || !newStudent.classId || !newStudent.sectionId || !newStudent.rollNumber}
                onClick={() => createStudentMutation.mutate(newStudent)}
              >
                Submit Admission
              </Button>
            </div>
          </div>
        </div>
      )}
      {/* CONFIRMATION DIALOG FOR DESTRUCTIVE DELETE */}
      <ConfirmDialog
        isOpen={!!deleteTargetId}
        title="Delete Student Record?"
        message="Are you sure you want to permanently delete this student record? All related attendance and result associations will be removed."
        confirmLabel="Yes, Delete Student"
        cancelLabel="Cancel"
        variant="danger"
        isLoading={deleteStudentMutation.isPending}
        onConfirm={() => deleteTargetId && deleteStudentMutation.mutate(deleteTargetId)}
        onCancel={() => setDeleteTargetId(null)}
      />
    </div>
  );
};
