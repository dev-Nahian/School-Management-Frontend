import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  UserPlus,
  BookOpen,
  CalendarCheck,
  Award,
  DollarSign,
  Activity,
  Settings,
  ShieldCheck,
  Lock,
  School,
  Menu,
  X,
  FileText,
  Calendar,
  Megaphone,
  Library,
  CalendarOff,
} from 'lucide-react';
import { Badge } from '../ui/badge';
import type { UserRole } from '../../types';

interface NavItem {
  title: string;
  href: string;
  icon: React.ElementType;
  roles: UserRole[];
}

const navItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
    roles: ['SUPER_ADMIN', 'ADMISSION_ADMIN', 'TEACHER', 'FINANCE', 'STUDENT', 'PARENT'],
  },
  {
    title: 'School Structure',
    href: '/structure',
    icon: School,
    roles: ['SUPER_ADMIN', 'ADMISSION_ADMIN', 'TEACHER', 'FINANCE'],
  },
  {
    title: 'Admissions Engine',
    href: '/admissions',
    icon: UserPlus,
    roles: ['SUPER_ADMIN', 'ADMISSION_ADMIN'],
  },
  {
    title: 'Student Directory',
    href: '/students',
    icon: GraduationCap,
    roles: ['SUPER_ADMIN', 'ADMISSION_ADMIN', 'TEACHER', 'FINANCE'],
  },
  {
    title: 'Teacher Roster',
    href: '/teachers',
    icon: Users,
    roles: ['SUPER_ADMIN', 'ADMISSION_ADMIN', 'FINANCE'],
  },
  {
    title: 'Attendance Desk',
    href: '/attendance',
    icon: CalendarCheck,
    roles: ['SUPER_ADMIN', 'TEACHER', 'STUDENT', 'PARENT', 'FINANCE'],
  },
  {
    title: 'Academic Results',
    href: '/results',
    icon: Award,
    roles: ['SUPER_ADMIN', 'TEACHER', 'STUDENT', 'PARENT', 'FINANCE'],
  },
  {
    title: 'Finance & Invoicing',
    href: '/finance',
    icon: DollarSign,
    roles: ['SUPER_ADMIN', 'FINANCE', 'PARENT'],
  },
  {
    title: 'Assignments',
    href: '/assignments',
    icon: BookOpen,
    roles: ['SUPER_ADMIN', 'TEACHER', 'STUDENT'],
  },
  {
    title: 'Timetable Schedule',
    href: '/timetable',
    icon: Calendar,
    roles: ['SUPER_ADMIN', 'ADMISSION_ADMIN', 'TEACHER', 'STUDENT', 'PARENT', 'FINANCE'],
  },
  {
    title: 'Announcements',
    href: '/announcements',
    icon: Megaphone,
    roles: ['SUPER_ADMIN', 'ADMISSION_ADMIN', 'TEACHER', 'FINANCE', 'STUDENT', 'PARENT'],
  },
  {
    title: 'Library Desk',
    href: '/library',
    icon: Library,
    roles: ['SUPER_ADMIN', 'ADMISSION_ADMIN', 'TEACHER', 'STUDENT', 'PARENT', 'FINANCE'],
  },
  {
    title: 'Leave Management',
    href: '/leave',
    icon: CalendarOff,
    roles: ['SUPER_ADMIN', 'ADMISSION_ADMIN', 'TEACHER', 'STUDENT', 'PARENT', 'FINANCE'],
  },
  {
    title: 'Reports Center',
    href: '/reports',
    icon: FileText,
    roles: ['SUPER_ADMIN', 'ADMISSION_ADMIN', 'TEACHER', 'FINANCE'],
  },
  {
    title: 'Document Vault',
    href: '/documents',
    icon: ShieldCheck,
    roles: ['SUPER_ADMIN', 'ADMISSION_ADMIN', 'TEACHER', 'FINANCE', 'STUDENT', 'PARENT'],
  },
  {
    title: 'System Audit Logs',
    href: '/audit-logs',
    icon: Activity,
    roles: ['SUPER_ADMIN'],
  },
  {
    title: 'System Settings',
    href: '/settings',
    icon: Settings,
    roles: ['SUPER_ADMIN'],
  },
];

export const Sidebar: React.FC = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  if (!user) return null;

  const allowedNav = navItems.filter((item) => item.roles.includes(user.role));

  const renderNavContent = () => (
    <div className="flex flex-col justify-between h-full space-y-6">
      <div className="space-y-6">
        {/* Role Scope Header */}
        <div className="p-3.5 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-purple-400" />
            <span className="text-xs font-bold text-purple-200 tracking-wider">ROLE SCOPE</span>
          </div>
          <Badge variant="purple" className="text-[10px] font-mono uppercase px-2 py-0.5">
            {user.role}
          </Badge>
        </div>

        {/* Navigation Links */}
        <div className="space-y-1">
          <p className="px-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">
            Authorized Modules
          </p>
          {allowedNav.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.href}
                to={item.href}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-600/20'
                      : 'text-gray-300 hover:bg-gray-800/60 hover:text-white'
                  }`
                }
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span>{item.title}</span>
              </NavLink>
            );
          })}
        </div>
      </div>

      {/* Security Note Footer */}
      <div className="p-3 rounded-2xl bg-gray-900/60 border border-gray-800 text-[11px] text-gray-400 flex items-start gap-2">
        <Lock className="h-3.5 w-3.5 text-purple-400 shrink-0 mt-0.5" />
        <span>JWT Bearer Sessions active. Unpermitted module routes are strictly blocked.</span>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Drawer Trigger Button */}
      <div className="lg:hidden flex items-center justify-between p-4 glass-panel rounded-2xl border border-gray-800 mb-4">
        <div className="flex items-center gap-2">
          <Badge variant="purple" className="text-[10px]">
            {user.role}
          </Badge>
          <span className="text-xs font-bold text-white">Platform Navigation</span>
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 text-gray-300 hover:text-white bg-gray-800/60 rounded-xl"
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Overlay Drawer */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/80 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="glass-panel w-full max-w-xs h-full p-4 rounded-3xl border border-gray-800 bg-gray-900 overflow-y-auto">
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-800">
              <span className="text-sm font-bold text-white">Menu Navigation</span>
              <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>
            {renderNavContent()}
          </div>
        </div>
      )}

      {/* Desktop Sidebar (hidden on mobile/tablet) */}
      <aside className="hidden lg:flex w-64 glass-panel rounded-3xl p-4 flex-col justify-between min-h-[calc(100vh-140px)] border border-gray-800 shrink-0">
        {renderNavContent()}
      </aside>
    </>
  );
};
