import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { StatusPage } from '../pages/StatusPage';
import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '../pages/DashboardPage';
import { SchoolStructurePage } from '../pages/SchoolStructurePage';
import { StudentListPage } from '../pages/StudentListPage';
import { StudentProfilePage } from '../pages/StudentProfilePage';
import { AdmissionDashboardPage } from '../pages/AdmissionDashboardPage';
import { TeacherDashboardPage } from '../pages/TeacherDashboardPage';
import { AttendancePage } from '../pages/AttendancePage';
import { FinancePage } from '../pages/FinancePage';
import { ExamManagementPage } from '../pages/ExamManagementPage';
import { UnauthorizedPage } from '../pages/UnauthorizedPage';
import { ChangePasswordPage } from '../pages/ChangePasswordPage';
import { AssignmentPage } from '../pages/AssignmentPage';
import { TimetablePage } from '../pages/TimetablePage';
import { AnnouncementPage } from '../pages/AnnouncementPage';
import { ProtectedRoute } from '../components/common/ProtectedRoute';
import { RoleGuard } from '../components/common/RoleGuard';

export const AppRoutes: React.FC = () => {
  return (
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
            <RoleGuard allowedRoles={['SUPER_ADMIN', 'ADMISSION_ADMIN', 'TEACHER']}>
              <SchoolStructurePage />
            </RoleGuard>
          </ProtectedRoute>
        }
      />

      {/* Student Directory (SUPER_ADMIN, ADMISSION_ADMIN, TEACHER, STUDENT, PARENT) */}
      <Route
        path="/students"
        element={
          <ProtectedRoute>
            <RoleGuard allowedRoles={['SUPER_ADMIN', 'ADMISSION_ADMIN', 'TEACHER']}>
              <StudentListPage />
            </RoleGuard>
          </ProtectedRoute>
        }
      />

      {/* Student Profile (All authorized roles with self/child restrictions) */}
      <Route
        path="/students/:id"
        element={
          <ProtectedRoute>
            <StudentProfilePage />
          </ProtectedRoute>
        }
      />

      {/* Admissions Module (SUPER_ADMIN & ADMISSION_ADMIN) */}
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

      {/* Teachers Portal & Roster */}
      <Route
        path="/teachers"
        element={
          <ProtectedRoute>
            <RoleGuard allowedRoles={['SUPER_ADMIN', 'ADMISSION_ADMIN', 'TEACHER']}>
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
            <RoleGuard allowedRoles={['SUPER_ADMIN', 'TEACHER', 'STUDENT', 'PARENT']}>
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
            <RoleGuard allowedRoles={['SUPER_ADMIN', 'TEACHER', 'STUDENT', 'PARENT']}>
              <ExamManagementPage />
            </RoleGuard>
          </ProtectedRoute>
        }
      />
      <Route
        path="/exams"
        element={
          <ProtectedRoute>
            <RoleGuard allowedRoles={['SUPER_ADMIN', 'TEACHER', 'STUDENT', 'PARENT']}>
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
            <RoleGuard allowedRoles={['SUPER_ADMIN', 'TEACHER', 'STUDENT', 'PARENT']}>
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
            <RoleGuard allowedRoles={['SUPER_ADMIN', 'TEACHER', 'STUDENT', 'PARENT']}>
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

      {/* System Audit Logs (SUPER_ADMIN only) */}
      <Route
        path="/audit-logs"
        element={
          <ProtectedRoute>
            <RoleGuard allowedRoles={['SUPER_ADMIN']}>
              <DashboardPage />
            </RoleGuard>
          </ProtectedRoute>
        }
      />

      {/* System Settings (SUPER_ADMIN only) */}
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <RoleGuard allowedRoles={['SUPER_ADMIN']}>
              <DashboardPage />
            </RoleGuard>
          </ProtectedRoute>
        }
      />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};
