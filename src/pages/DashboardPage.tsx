import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Sidebar } from '../components/layout/Sidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { 
  ShieldCheck, 
  UserCheck, 
  Send, 
  CheckCircle2, 
  XCircle, 
  Lock, 
  Mail, 
  Phone, 
  Sparkles,
  Layers
} from 'lucide-react';
import { authService } from '../services/auth.service';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [testLog, setTestLog] = useState<{ endpoint: string; status: number; message: string; granted: boolean }[]>([]);
  const [isTesting, setIsTesting] = useState(false);

  if (!user) return null;

  const testEndpoints = [
    { label: 'Super Admin Endpoint', endpoint: 'super-admin', requiredRole: 'SUPER_ADMIN' },
    { label: 'Admission Admin Endpoint', endpoint: 'admission', requiredRole: 'SUPER_ADMIN / ADMISSION_ADMIN' },
    { label: 'Teacher Endpoint', endpoint: 'teacher', requiredRole: 'SUPER_ADMIN / TEACHER' },
    { label: 'Finance Endpoint', endpoint: 'finance', requiredRole: 'SUPER_ADMIN / FINANCE' },
  ];

  const handleTestProbe = async (endpointKey: string, label: string) => {
    setIsTesting(true);
    try {
      const res = await authService.testRoleEndpoint(endpointKey);
      setTestLog((prev) => [
        {
          endpoint: label,
          status: 200,
          message: res.message,
          granted: true,
        },
        ...prev,
      ]);
    } catch (err: any) {
      setTestLog((prev) => [
        {
          endpoint: label,
          status: 403,
          message: err.message || 'Access Denied: 403 Forbidden',
          granted: false,
        },
        ...prev,
      ]);
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <Sidebar />

      <div className="flex-1 space-y-6">
        {/* Welcome Header */}
        <div className="glass-panel p-6 rounded-3xl border border-purple-500/20 bg-gradient-to-r from-purple-900/30 via-gray-900/40 to-indigo-900/20">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <Badge variant="purple" className="mb-2 gap-1.5 font-mono">
                <ShieldCheck className="h-3.5 w-3.5" /> Authenticated Tier: {user.role}
              </Badge>
              <h2 className="text-2xl font-extrabold text-white">
                Welcome back, {user.firstName} {user.lastName}!
              </h2>
              <p className="text-xs text-gray-400 mt-1">
                Phase 2 Authorization & JWT Bearer Session active. Explore your role-specific dashboard.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs text-emerald-400 font-semibold">Active JWT Session</span>
            </div>
          </div>
        </div>

        {/* User Identity Details Card */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-4 border-gray-800">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                <UserCheck className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[11px] text-gray-400">Full Name</p>
                <p className="text-sm font-bold text-white">{user.firstName} {user.lastName}</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 border-gray-800">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-2xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
                <Mail className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[11px] text-gray-400">User Email</p>
                <p className="text-xs font-mono text-white truncate max-w-[180px]">{user.email}</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 border-gray-800">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <Phone className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[11px] text-gray-400">Phone Contact</p>
                <p className="text-xs font-mono text-white">{user.phone || '+1 (555) 019-2831'}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Backend REST API RBAC Endpoint Probe Matrix */}
        <Card className="border-purple-500/20">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Lock className="h-5 w-5 text-purple-400" /> Backend RBAC Authorization Probe Matrix
                </CardTitle>
                <CardDescription>
                  Test live REST endpoints to verify backend permission enforcement for your active role <span className="font-mono text-purple-300">[{user.role}]</span>
                </CardDescription>
              </div>
              <Badge variant="purple" className="gap-1 font-mono">
                <Layers className="h-3.5 w-3.5" /> requireRole() Middleware
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {testEndpoints.map((item) => (
                <div key={item.endpoint} className="p-3.5 rounded-2xl bg-gray-950/60 border border-gray-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">{item.label}</span>
                  </div>
                  <p className="text-[10px] text-gray-400">Req: {item.requiredRole}</p>
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={isTesting}
                    onClick={() => handleTestProbe(item.endpoint, item.label)}
                    className="w-full text-xs gap-1.5"
                  >
                    <Send className="h-3 w-3" /> Test Endpoint
                  </Button>
                </div>
              ))}
            </div>

            {/* Test Log Results Table */}
            {testLog.length > 0 && (
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between text-xs text-gray-400 font-semibold uppercase tracking-wider">
                  <span className="flex items-center gap-1.5 text-purple-300">
                    <Sparkles className="h-3.5 w-3.5" /> Real-Time Security Probe Log
                  </span>
                  <button onClick={() => setTestLog([])} className="text-[10px] text-gray-400 hover:text-white underline">
                    Clear Log
                  </button>
                </div>

                <div className="space-y-2 max-h-56 overflow-y-auto">
                  {testLog.map((log, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded-xl border text-xs flex items-center justify-between ${
                        log.granted
                          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                          : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {log.granted ? (
                          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                        ) : (
                          <XCircle className="h-4 w-4 text-rose-400 shrink-0" />
                        )}
                        <div>
                          <span className="font-bold text-white">{log.endpoint}:</span> {log.message}
                        </div>
                      </div>
                      <Badge variant={log.granted ? 'success' : 'error'} className="font-mono text-[10px]">
                        HTTP {log.status} {log.granted ? 'GRANTED' : 'FORBIDDEN'}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
