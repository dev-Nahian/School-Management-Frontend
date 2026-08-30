import React from 'react';
import { ShieldAlert, ArrowLeft, Home } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export const UnauthorizedPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-[calc(100vh-160px)] flex items-center justify-center">
      <div className="max-w-md w-full glass-panel rounded-3xl p-8 border border-rose-500/20 shadow-2xl text-center space-y-6 bg-gradient-to-b from-rose-950/20 via-gray-900/60 to-gray-950/80">
        <div className="h-16 w-16 rounded-3xl bg-rose-500/10 border border-rose-500/30 text-rose-400 mx-auto flex items-center justify-center shadow-lg shadow-rose-500/20">
          <ShieldAlert className="h-9 w-9" />
        </div>

        <div className="space-y-2">
          <Badge variant="error" className="gap-1 font-mono uppercase">
            HTTP 403 FORBIDDEN
          </Badge>
          <h2 className="text-2xl font-extrabold text-white">Access Unauthorized</h2>
          <p className="text-xs text-gray-400 leading-relaxed">
            Your current role tier <span className="font-mono text-purple-300 font-bold">[{user?.role || 'UNAUTHENTICATED'}]</span> does not possess required RBAC permissions to view this system route.
          </p>
        </div>

        <div className="p-3 rounded-2xl bg-gray-950/60 border border-gray-800 text-[11px] text-gray-400 text-left space-y-1">
          <p className="font-semibold text-gray-300">Security Rule Enforced:</p>
          <p>Users must never access data outside their assigned permission scope. This event is logged in security audit telemetry.</p>
        </div>

        <div className="flex items-center justify-center gap-3 pt-2">
          <Button variant="secondary" onClick={() => navigate(-1)} className="gap-2 text-xs">
            <ArrowLeft className="h-4 w-4" /> Go Back
          </Button>
          <Button variant="primary" onClick={() => navigate('/dashboard')} className="gap-2 text-xs">
            <Home className="h-4 w-4" /> Return to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
};
