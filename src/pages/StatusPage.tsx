import React from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  RefreshCw, 
  Database, 
  Server, 
  Globe, 
  ShieldCheck, 
  Layers, 
  Cpu, 
  Clock,
  Code2
} from 'lucide-react';
import { useHealthStatus } from '../hooks/useHealthStatus';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';

export const StatusPage: React.FC = () => {
  const { data: health, isLoading, isError, error, refetch, isFetching } = useHealthStatus();

  const isBackendConnected = !isLoading && !isError && health?.backend === 'Connected';
  const isDbConnected = Boolean(health?.isDbConnected);

  const roles = [
    { name: 'SUPER_ADMIN', desc: 'Full system control, audit logs & system config', color: 'purple' },
    { name: 'ADMISSION_ADMIN', desc: 'Student/Parent registration & class assignment', color: 'info' },
    { name: 'TEACHER', desc: 'Attendance, marks entry, class timetables', color: 'success' },
    { name: 'FINANCE', desc: 'Invoices, fee collection & receipts', color: 'warning' },
    { name: 'STUDENT', desc: 'Profile, assignments, attendance & grades', color: 'info' },
    { name: 'PARENT', desc: 'Multi-student guardian monitoring portal', color: 'purple' },
  ] as const;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-6 rounded-3xl border border-purple-500/20 bg-gradient-to-r from-purple-900/20 via-gray-900/40 to-indigo-900/20">
        <div>
          <Badge variant="purple" className="mb-2 gap-1.5">
            <Layers className="h-3.5 w-3.5" /> Phase 1 — Environment Verification
          </Badge>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">
            System Connectivity & Integration Dashboard
          </h2>
          <p className="text-sm text-gray-400 mt-1">
            Real-time REST API probe verifying communication between Frontend, Backend & PostgreSQL Database.
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => refetch()}
          disabled={isFetching}
          className="self-start md:self-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${isFetching ? 'animate-spin text-purple-400' : ''}`} />
          {isFetching ? 'Probing Network...' : 'Refresh Status'}
        </Button>
      </div>

      {/* 3 Core Connection Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Frontend Status */}
        <Card hoverEffect className="border-emerald-500/20 bg-emerald-950/10">
          <CardHeader>
            <div className="flex items-center justify-between">
              <span className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <Globe className="h-6 w-6" />
              </span>
              <Badge variant="success" className="gap-1">
                <CheckCircle2 className="h-3.5 w-3.5" /> Active
              </Badge>
            </div>
            <CardTitle className="mt-3">Frontend</CardTitle>
            <CardDescription>React 19 + Vite + TypeScript</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between text-sm py-2 border-t border-gray-800">
              <span className="text-gray-400">Connection State:</span>
              <span className="font-semibold text-emerald-400">Connected</span>
            </div>
            <div className="flex items-center justify-between text-xs text-gray-400 pt-1">
              <span>Port:</span>
              <span className="font-mono text-gray-300">3000 (Development)</span>
            </div>
          </CardContent>
        </Card>

        {/* Backend Status */}
        <Card hoverEffect className={isBackendConnected ? 'border-sky-500/20 bg-sky-950/10' : 'border-rose-500/20 bg-rose-950/10'}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <span className={`p-2.5 rounded-xl border ${isBackendConnected ? 'bg-sky-500/10 text-sky-400 border-sky-500/20' : 'bg-rose-500/10 text-rose-400 border-rose-500/20'}`}>
                <Server className="h-6 w-6" />
              </span>
              <Badge variant={isBackendConnected ? 'info' : 'error'} className="gap-1">
                {isBackendConnected ? <CheckCircle2 className="h-3.5 w-3.5" /> : <XCircle className="h-3.5 w-3.5" />}
                {isBackendConnected ? 'Active' : 'Offline'}
              </Badge>
            </div>
            <CardTitle className="mt-3">Backend</CardTitle>
            <CardDescription>Node.js + Express + Zod + Helmet</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between text-sm py-2 border-t border-gray-800">
              <span className="text-gray-400">Connection State:</span>
              <span className={`font-semibold ${isBackendConnected ? 'text-sky-400' : 'text-rose-400'}`}>
                {isBackendConnected ? 'Connected' : 'Disconnected'}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs text-gray-400 pt-1">
              <span>Health Endpoint:</span>
              <span className="font-mono text-gray-300">GET /api/health</span>
            </div>
          </CardContent>
        </Card>

        {/* Database Status */}
        <Card hoverEffect className={isDbConnected ? 'border-purple-500/20 bg-purple-950/10' : 'border-amber-500/20 bg-amber-950/10'}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <span className={`p-2.5 rounded-xl border ${isDbConnected ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'}`}>
                <Database className="h-6 w-6" />
              </span>
              <Badge variant={isDbConnected ? 'purple' : 'warning'} className="gap-1">
                {isDbConnected ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Clock className="h-3.5 w-3.5" />}
                {isDbConnected ? 'Active' : 'Standby / Check DB'}
              </Badge>
            </div>
            <CardTitle className="mt-3">Database</CardTitle>
            <CardDescription>PostgreSQL + Prisma ORM</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between text-sm py-2 border-t border-gray-800">
              <span className="text-gray-400">Connection State:</span>
              <span className={`font-semibold ${isDbConnected ? 'text-purple-400' : 'text-amber-400'}`}>
                {isDbConnected ? 'Connected' : 'Ready for PostgreSQL Service'}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs text-gray-400 pt-1">
              <span>ORM Client:</span>
              <span className="font-mono text-gray-300">Prisma Client v6</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Backend API Payload Response Detail */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Cpu className="h-5 w-5 text-purple-400" /> API Health Telemetry Payload
            </CardTitle>
            {health?.timestamp && (
              <span className="text-xs text-gray-400 font-mono flex items-center gap-1">
                <Clock className="h-3.5 w-3.5 text-purple-400" />
                Updated: {new Date(health.timestamp).toLocaleTimeString()}
              </span>
            )}
          </div>
          <CardDescription>Live JSON response payload fetched via TanStack Query from `/api/health`</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="py-8 text-center text-gray-400 animate-pulse flex items-center justify-center gap-2">
              <RefreshCw className="h-5 w-5 animate-spin text-purple-400" /> Querying REST API endpoint...
            </div>
          ) : isError ? (
            <div className="p-4 rounded-xl bg-rose-950/30 border border-rose-500/30 text-rose-300 text-sm">
              <div className="font-semibold flex items-center gap-2 mb-1">
                <XCircle className="h-4 w-4 text-rose-400" /> Backend Request Failed
              </div>
              <p className="text-xs font-mono">{error?.message || 'Could not connect to http://localhost:5000'}</p>
              <p className="text-xs text-gray-400 mt-2">Ensure backend server is running (`cd backend && npm run dev`)</p>
            </div>
          ) : (
            <div className="bg-gray-950/80 rounded-xl p-4 border border-gray-800/80 font-mono text-xs text-purple-300 overflow-x-auto">
              <pre>{JSON.stringify(health, null, 2)}</pre>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Role Scoping Preview Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-purple-400" /> Role-Based Authorization Blueprint
            </h3>
            <p className="text-xs text-gray-400">Standardized role structure initialized in Phase 1 database schema</p>
          </div>
          <Badge variant="purple">Exact 6 Roles Defined</Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {roles.map((role) => (
            <Card key={role.name} hoverEffect className="p-4 border-gray-800">
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-xs font-bold text-white bg-purple-500/10 px-2 py-1 rounded border border-purple-500/20">
                  {role.name}
                </span>
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <p className="text-xs text-gray-400">{role.desc}</p>
            </Card>
          ))}
        </div>
      </div>

      {/* Phase 1 Verification Checklist */}
      <Card className="bg-gradient-to-br from-gray-900/60 to-gray-950/80">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code2 className="h-5 w-5 text-indigo-400" /> Phase 1 Setup Architecture Checklist
          </CardTitle>
          <CardDescription>Verified foundation components ready for Phase 2 authentication & domain development</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div className="flex items-center gap-2 text-gray-300 p-2.5 rounded-lg bg-gray-900/50 border border-gray-800">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>React 19 + Vite + TypeScript modular folder tree initialized</span>
            </div>
            <div className="flex items-center gap-2 text-gray-300 p-2.5 rounded-lg bg-gray-900/50 border border-gray-800">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>Tailwind CSS 4 glassmorphic styling system configured</span>
            </div>
            <div className="flex items-center gap-2 text-gray-300 p-2.5 rounded-lg bg-gray-900/50 border border-gray-800">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>Express + TypeScript + Helmet + CORS backend initialized</span>
            </div>
            <div className="flex items-center gap-2 text-gray-300 p-2.5 rounded-lg bg-gray-900/50 border border-gray-800">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>Prisma ORM v6 with PostgreSQL schema baseline (`User`, `RefreshToken`, `AuditLog`)</span>
            </div>
            <div className="flex items-center gap-2 text-gray-300 p-2.5 rounded-lg bg-gray-900/50 border border-gray-800">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>Centralized error handling & Zod schema validation middleware</span>
            </div>
            <div className="flex items-center gap-2 text-gray-300 p-2.5 rounded-lg bg-gray-900/50 border border-gray-800">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>TanStack Query auto-refreshing network probe for `/api/health`</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
