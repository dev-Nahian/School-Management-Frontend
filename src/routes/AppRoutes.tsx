import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from '../components/common/ProtectedRoute';
import { RoleGuard } from '../components/common/RoleGuard';
import { Skeleton } from '../components/ui/Skeleton';

// Route-level Code Splitting with React.lazy
const StatusPage = lazy(() => import('../pages/StatusPage').then((m) => ({ default: m.StatusPage })));
const LoginPage = lazy(() => import('../pages/LoginPage').then((m) => ({ default: m.LoginPage })));
const DashboardPage = lazy(() => import('../pages/DashboardPage').then((m) => ({ default: m.DashboardPage })));
const SchoolStructurePage = lazy(() => import('../pages/SchoolStructurePage').then((m) => ({ default: m.SchoolStructurePage })));
const StudentListPage = lazy(() => import('../pages/StudentListPage').then((m) => ({ default: m.StudentListPage })));
const StudentProfilePage = lazy(() => import('../pages/StudentProfilePage').then((m) => ({ default: m.StudentProfilePage })));
const AdmissionDashboardPage = lazy(() => import('../pages/AdmissionDashboardPage').then((m) => ({ default: m.AdmissionDashboardPage })));
const TeacherDashboardPage = lazy(() => import('../pages/TeacherDashboardPage').then((m) => ({ default: m.TeacherDashboardPage })));
const AttendancePage = lazy(() => import('../pages/AttendancePage').then((m) => ({ default: m.AttendancePage })));
const FinancePage = lazy(() => import('../pages/FinancePage').then((m) => ({ default: m.FinancePage })));
const ExamManagementPage = lazy(() => import('../pages/ExamManagementPage').then((m) => ({ default: m.ExamManagementPage })));
const UnauthorizedPage = lazy(() => import('../pages/UnauthorizedPage').then((m) => ({ default: m.UnauthorizedPage })));
const ChangePasswordPage = lazy(() => import('../pages/ChangePasswordPage').then((m) => ({ default: m.ChangePasswordPage })));
const AssignmentPage = lazy(() => import('../pages/AssignmentPage').then((m) => ({ default: m.AssignmentPage })));
const TimetablePage = lazy(() => import('../pages/TimetablePage').then((m) => ({ default: m.TimetablePage })));
const AnnouncementPage = lazy(() => import('../pages/AnnouncementPage').then((m) => ({ default: m.AnnouncementPage })));
const LibraryPage = lazy(() => import('../pages/LibraryPage').then((m) => ({ default: m.LibraryPage })));
const LeaveManagementPage = lazy(() => import('../pages/LeaveManagementPage').then((m) => ({ default: m.LeaveManagementPage })));
const ReportsPage = lazy(() => import('../pages/ReportsPage').then((m) => ({ default: m.ReportsPage })));
const DocumentsPage = lazy(() => import('../pages/DocumentsPage').then((m) => ({ default: m.DocumentsPage })));
const AuditLogsPage = lazy(() => import('../pages/AuditLogsPage').then((m) => ({ default: m.AuditLogsPage })));
const SettingsPage = lazy(() => import('../pages/SettingsPage').then((m) => ({ default: m.SettingsPage })));

const RouteLoadingFallback: React.FC = () => (
  <div className="p-6 max-w-7xl mx-auto space-y-6 animate-fade-in">
    <div className="flex justify-between items-center">
      <Skeleton className="h-8 w-48 rounded-lg" />
      <Skeleton className="h-10 w-32 rounded-lg" />
    </div>
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Skeleton className="h-28 rounded-xl" />
      <Skeleton className="h-28 rounded-xl" />
      <Skeleton className="h-28 rounded-xl" />
      <Skeleton className="h-28 rounded-xl" />
    </div>
    <Skeleton className="h-96 rounded-xl" />
  </div>
);

export const AppRoutes: React.FC = () => {
  return (
    <Suspense fallback={<RouteLoadingFallback />}>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/status" element={<StatusPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />

        {/* Protected Main Dashboard */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />

        {/* School Structure Module */}
        <Route
          path="/structure"
          element={
            <ProtectedRoute>
              <RoleGuard allowedRoles={['SUPER_ADMIN', 'ADMISSION_ADMIN', 'TEACHER', 'FINANCE']}>
                <SchoolStructurePage />
              </RoleGuard>
            </ProtectedRoute>
          }
        />

        {/* Student Directory */}
        <Route
          path="/students"
          element={
            <ProtectedRoute>
              <RoleGuard allowedRoles={['SUPER_ADMIN', 'ADMISSION_ADMIN', 'TEACHER', 'FINANCE']}>
                <StudentListPage />
              </RoleGuard>
            </ProtectedRoute>
          }
        />

        {/* Student Profile */}
        <Route
          path="/students/:id"
          element={
            <ProtectedRoute>
              <StudentProfilePage />
            </ProtectedRoute>
          }
        />

        {/* Admissions Module */}
        <Route
          path="/admissions"
          element={
            <ProtectedRoute>
              <RoleGuard allowedRoles={['SUPER_ADMIN', 'ADMISSION_ADMIN']}>
                <AdmissionDashboardPage />
              </RoleGuard>
            </ProtectedRoute>
          }
        />

        {/* Teachers Portal */}
        <Route
          path="/teachers"
          element={
            <ProtectedRoute>
              <RoleGuard allowedRoles={['SUPER_ADMIN', 'ADMISSION_ADMIN', 'TEACHER', 'FINANCE']}>
                <TeacherDashboardPage />
              </RoleGuard>
            </ProtectedRoute>
          }
        />

        {/* Security Settings */}
        <Route
          path="/change-password"
          element={
            <ProtectedRoute>
              <ChangePasswordPage />
            </ProtectedRoute>
          }
        />

        {/* Attendance Desk */}
        <Route
          path="/attendance"
          element={
            <ProtectedRoute>
              <RoleGuard allowedRoles={['SUPER_ADMIN', 'ADMISSION_ADMIN', 'TEACHER', 'FINANCE', 'STUDENT', 'PARENT']}>
                <AttendancePage />
              </RoleGuard>
            </ProtectedRoute>
          }
        />

        {/* Academic Results & Exams */}
        <Route
          path="/results"
          element={
            <ProtectedRoute>
              <RoleGuard allowedRoles={['SUPER_ADMIN', 'ADMISSION_ADMIN', 'TEACHER', 'FINANCE', 'STUDENT', 'PARENT']}>
                <ExamManagementPage />
              </RoleGuard>
            </ProtectedRoute>
          }
        />
        <Route
          path="/exams"
          element={
            <ProtectedRoute>
              <RoleGuard allowedRoles={['SUPER_ADMIN', 'ADMISSION_ADMIN', 'TEACHER', 'FINANCE', 'STUDENT', 'PARENT']}>
                <ExamManagementPage />
              </RoleGuard>
            </ProtectedRoute>
          }
        />

        {/* Finance & Invoicing */}
        <Route
          path="/finance"
          element={
            <ProtectedRoute>
              <RoleGuard allowedRoles={['SUPER_ADMIN', 'FINANCE', 'PARENT', 'STUDENT']}>
                <FinancePage />
              </RoleGuard>
            </ProtectedRoute>
          }
        />

        {/* Homework & Assignments */}
        <Route
          path="/assignments"
          element={
            <ProtectedRoute>
              <RoleGuard allowedRoles={['SUPER_ADMIN', 'TEACHER', 'STUDENT', 'PARENT', 'FINANCE']}>
                <AssignmentPage />
              </RoleGuard>
            </ProtectedRoute>
          }
        />

        {/* Timetable Management */}
        <Route
          path="/timetable"
          element={
            <ProtectedRoute>
              <RoleGuard allowedRoles={['SUPER_ADMIN', 'ADMISSION_ADMIN', 'TEACHER', 'STUDENT', 'PARENT', 'FINANCE']}>
                <TimetablePage />
              </RoleGuard>
            </ProtectedRoute>
          }
        />

        {/* Broadcast Announcements */}
        <Route
          path="/announcements"
          element={
            <ProtectedRoute>
              <RoleGuard allowedRoles={['SUPER_ADMIN', 'ADMISSION_ADMIN', 'TEACHER', 'FINANCE', 'STUDENT', 'PARENT']}>
                <AnnouncementPage />
              </RoleGuard>
            </ProtectedRoute>
          }
        />

        {/* Library & Borrowing Management */}
        <Route
          path="/library"
          element={
            <ProtectedRoute>
              <RoleGuard allowedRoles={['SUPER_ADMIN', 'ADMISSION_ADMIN', 'TEACHER', 'STUDENT', 'PARENT', 'FINANCE']}>
                <LibraryPage />
              </RoleGuard>
            </ProtectedRoute>
          }
        />

        {/* Student Leave Management */}
        <Route
          path="/leave"
          element={
            <ProtectedRoute>
              <RoleGuard allowedRoles={['SUPER_ADMIN', 'TEACHER', 'STUDENT', 'PARENT', 'FINANCE']}>
                <LeaveManagementPage />
              </RoleGuard>
            </ProtectedRoute>
          }
        />

        {/* Centralized Reports Center */}
        <Route
          path="/reports"
          element={
            <ProtectedRoute>
              <RoleGuard allowedRoles={['SUPER_ADMIN', 'ADMISSION_ADMIN', 'TEACHER', 'FINANCE']}>
                <ReportsPage />
              </RoleGuard>
            </ProtectedRoute>
          }
        />

        {/* Document Vault */}
        <Route
          path="/documents"
          element={
            <ProtectedRoute>
              <RoleGuard allowedRoles={['SUPER_ADMIN', 'ADMISSION_ADMIN', 'TEACHER', 'FINANCE', 'STUDENT', 'PARENT']}>
                <DocumentsPage />
              </RoleGuard>
            </ProtectedRoute>
          }
        />

        {/* System Audit Logs */}
        <Route
          path="/audit-logs"
          element={
            <ProtectedRoute>
              <RoleGuard allowedRoles={['SUPER_ADMIN']}>
                <AuditLogsPage />
              </RoleGuard>
            </ProtectedRoute>
          }
        />

        {/* System Settings */}
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <RoleGuard allowedRoles={['SUPER_ADMIN']}>
                <SettingsPage />
              </RoleGuard>
            </ProtectedRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Suspense>
  );
};
