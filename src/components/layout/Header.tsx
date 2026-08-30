import React from 'react';
import { School, Database, Server, Activity } from 'lucide-react';
import { Badge } from '../ui/badge';
import { UserNav } from './UserNav';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

interface HeaderProps {
  isDbConnected?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ isDbConnected }) => {
  const { isAuthenticated } = useAuth();

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-gray-800/80 px-6 py-3.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to={isAuthenticated ? '/dashboard' : '/'} className="flex items-center gap-3 group">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-purple-500/20 group-hover:scale-105 transition-transform">
            <School className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              School Management System
              <span className="text-xs px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-mono">v1.0.0</span>
            </h1>
            <p className="text-xs text-gray-400">Enterprise Role-Based Management System</p>
          </div>
        </Link>

        <div className="flex items-center gap-4">
          <div className="hidden lg:flex items-center gap-3">
            <Link to="/status" className="hover:opacity-80 transition-opacity">
              <Badge variant="purple" className="gap-1.5">
                <Activity className="h-3.5 w-3.5" /> API Probe
              </Badge>
            </Link>
            <Badge variant="info" className="gap-1.5">
              <Server className="h-3.5 w-3.5" /> Express + TS
            </Badge>
            <Badge variant={isDbConnected ? 'success' : 'warning'} className="gap-1.5">
              <Database className="h-3.5 w-3.5" />
              {isDbConnected ? 'PostgreSQL Active' : 'DB Standby'}
            </Badge>
          </div>

          {isAuthenticated && <UserNav />}
        </div>
      </div>
    </header>
  );
};
