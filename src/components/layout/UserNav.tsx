import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { LogOut, KeyRound, Shield } from 'lucide-react';
import { Badge } from '../ui/badge';
import { useNavigate } from 'react-router-dom';

export const UserNav: React.FC = () => {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  if (!user || !user.firstName) return null;

  const initialFirst = user.firstName ? user.firstName.charAt(0) : 'U';
  const initialLast = user.lastName ? user.lastName.charAt(0) : '';

  const getRoleVariant = (role: string) => {
    switch (role) {
      case 'SUPER_ADMIN':
        return 'purple';
      case 'ADMISSION_ADMIN':
        return 'info';
      case 'TEACHER':
        return 'success';
      case 'FINANCE':
        return 'warning';
      default:
        return 'info';
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 p-1.5 pr-3 rounded-2xl glass-panel border border-gray-800 hover:border-purple-500/40 transition-all focus:outline-none"
      >
        <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center font-bold text-white shadow-md">
          {initialFirst}
          {initialLast}
        </div>
        <div className="text-left hidden sm:block">
          <div className="text-xs font-semibold text-white flex items-center gap-1.5">
            {user.firstName} {user.lastName || ''}
          </div>
          <div className="text-[10px] text-gray-400 font-mono">{user.email}</div>
        </div>
        <Badge variant={getRoleVariant(user.role || 'STUDENT')} className="ml-1 text-[10px] uppercase font-mono">
          {user.role}
        </Badge>
      </button>

      {isOpen && (
        <div
          className="absolute right-0 mt-2 w-64 glass-panel rounded-2xl border border-gray-800 shadow-2xl p-2 z-50 animate-fadeIn"
          onMouseLeave={() => setIsOpen(false)}
        >
          <div className="p-3 border-b border-gray-800/80">
            <p className="text-xs font-bold text-white">
              {user.firstName} {user.lastName || ''}
            </p>
            <p className="text-[11px] text-gray-400 font-mono mt-0.5">{user.email}</p>
            <div className="flex items-center gap-1 mt-2 text-[11px] text-purple-300">
              <Shield className="h-3.5 w-3.5" />
              <span>Permission Level: {user.role}</span>
            </div>
          </div>

          <div className="py-1">
            <button
              onClick={() => {
                setIsOpen(false);
                navigate('/change-password');
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-gray-300 hover:text-white hover:bg-gray-800/60 rounded-xl transition-colors"
            >
              <KeyRound className="h-4 w-4 text-purple-400" />
              <span>Change Security Password</span>
            </button>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors font-medium mt-1"
            >
              <LogOut className="h-4 w-4 text-rose-400" />
              <span>Logout of Session</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
