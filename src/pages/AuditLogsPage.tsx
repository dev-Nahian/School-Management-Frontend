import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import { Sidebar } from '../components/layout/Sidebar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { auditLogService } from '../services/auditLog.service';
import {
  ShieldAlert,
  Search,
  Filter,
  Clock,
  ChevronLeft,
  ChevronRight,
  Lock,
  Activity,
} from 'lucide-react';

export const AuditLogsPage: React.FC = () => {
  const { user } = useAuth();
  const [actionQuery, setActionQuery] = useState<string>('');
  const [entityFilter, setEntityFilter] = useState<string>('');
  const [page, setPage] = useState<number>(1);

  const { data, isLoading } = useQuery({
    queryKey: ['audit-logs', actionQuery, entityFilter, page],
    queryFn: () =>
      auditLogService.listAuditLogs({
        action: actionQuery || undefined,
        entity: entityFilter || undefined,
        page,
        limit: 15,
      }),
  });

  const logs = data?.logs || [];
  const pagination = data?.pagination || { total: 0, page: 1, limit: 15, totalPages: 1 };

  const getActionBadgeVariant = (action: string) => {
    if (action.includes('CREATE') || action.includes('COMPLETED')) return 'success';
    if (action.includes('DELETE') || action.includes('REJECT')) return 'error';
    if (action.includes('UPDATE') || action.includes('MODIFY')) return 'warning';
    return 'purple';
  };

  if (!user) return null;

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <Sidebar />

      <div className="flex-1 space-y-6">
        {/* Header Banner */}
        <div className="glass-panel p-6 rounded-3xl border border-rose-500/20 bg-gradient-to-r from-rose-950/30 via-gray-900/60 to-purple-950/30">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <Badge variant="error" className="mb-2 gap-1.5 font-mono">
                <ShieldAlert className="h-3.5 w-3.5 text-rose-400" /> Super Admin Read-Only Audit Ledger
              </Badge>
              <h2 className="text-2xl font-extrabold text-white">Security & Audit Activity Logs</h2>
              <p className="text-xs text-gray-400 mt-1">
                Immutable, tamper-evident transaction logs capturing creation, modifications, permissions, and status updates across the platform.
              </p>
            </div>
            <div className="flex items-center gap-2 bg-rose-500/10 px-3 py-1.5 rounded-2xl border border-rose-500/20">
              <Lock className="h-4 w-4 text-rose-400" />
              <span className="text-xs text-rose-300 font-mono font-bold">Uneditable Audit Standard</span>
            </div>
          </div>
        </div>

        {/* Filter Controls */}
        <Card className="border-gray-800 bg-gray-900/50">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                <input
                  type="text"
                  placeholder="Filter by Action (e.g. STUDENT_CREATED, PAYMENT_RECORDED)..."
                  value={actionQuery}
                  onChange={(e) => {
                    setActionQuery(e.target.value);
                    setPage(1);
                  }}
                  className="w-full pl-9 pr-4 py-2 rounded-xl bg-gray-950 border border-gray-800 text-xs text-white placeholder-gray-500"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Filter className="h-4 w-4 text-gray-400 shrink-0" />
                <select
                  value={entityFilter}
                  onChange={(e) => {
                    setEntityFilter(e.target.value);
                    setPage(1);
                  }}
                  className="px-3 py-2 rounded-xl bg-gray-950 border border-gray-800 text-xs text-white w-full sm:w-auto"
                >
                  <option value="">All Entities</option>
                  <option value="Student">Student</option>
                  <option value="Admission">Admission</option>
                  <option value="User">User Account</option>
                  <option value="AttendanceRecord">Attendance</option>
                  <option value="PaymentRecord">Payment</option>
                  <option value="Invoice">Invoice</option>
                  <option value="MarkEntry">Mark Entry</option>
                  <option value="Document">Document</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Audit Log Table */}
        <Card className="border-gray-800 bg-gray-900/50">
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-sm font-bold text-white flex items-center gap-2">
                <Activity className="h-4 w-4 text-rose-400" /> Recorded Audit Transactions
              </CardTitle>
              <CardDescription className="text-xs text-gray-400">
                Total records: {pagination.total} entries found.
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            {isLoading ? (
              <p className="p-6 text-center text-xs text-gray-500">Loading audit records...</p>
            ) : logs.length === 0 ? (
              <p className="p-6 text-center text-xs text-gray-500">No audit log entries found matching criteria.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-950/80 text-gray-400 border-y border-gray-800 uppercase font-mono text-[10px]">
                    <tr>
                      <th className="p-3.5">Timestamp</th>
                      <th className="p-3.5">Actor</th>
                      <th className="p-3.5">Action</th>
                      <th className="p-3.5">Target Entity</th>
                      <th className="p-3.5">Entity ID</th>
                      <th className="p-3.5">Metadata Payload</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800">
                    {logs.map((log) => (
                      <tr key={log.id} className="hover:bg-gray-800/30 transition-all font-mono">
                        <td className="p-3.5 text-gray-400 text-[11px] whitespace-nowrap">
                          <div className="flex items-center gap-1.5">
                            <Clock className="h-3.5 w-3.5 text-purple-400 shrink-0" />
                            <span>{new Date(log.createdAt).toLocaleString()}</span>
                          </div>
                        </td>

                        <td className="p-3.5">
                          {log.user ? (
                            <div>
                              <p className="font-bold text-white font-sans">
                                {log.user.firstName} {log.user.lastName}
                              </p>
                              <span className="text-[10px] text-purple-400">{log.user.role}</span>
                            </div>
                          ) : (
                            <span className="text-gray-500 font-sans">System / Automated</span>
                          )}
                        </td>

                        <td className="p-3.5">
                          <Badge variant={getActionBadgeVariant(log.action)} className="text-[10px]">
                            {log.action}
                          </Badge>
                        </td>

                        <td className="p-3.5 text-gray-300 font-bold">{log.entity}</td>

                        <td className="p-3.5 text-gray-400 text-[11px]">
                          {log.entityId ? (
                            <span className="bg-gray-950 px-2 py-1 rounded border border-gray-800">
                              {log.entityId}
                            </span>
                          ) : (
                            'N/A'
                          )}
                        </td>

                        <td className="p-3.5">
                          {log.details ? (
                            <div className="max-w-xs truncate bg-gray-950 p-1.5 rounded border border-gray-800 text-[10px] text-gray-300 font-mono">
                              {JSON.stringify(log.details)}
                            </div>
                          ) : (
                            <span className="text-gray-600">-</span>
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

        {/* Pagination Bar */}
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between p-4 glass-panel rounded-2xl border border-gray-800 text-xs">
            <span className="text-gray-400">
              Page {pagination.page} of {pagination.totalPages}
            </span>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                className="gap-1 text-xs"
              >
                <ChevronLeft className="h-4 w-4" /> Previous
              </Button>
              <Button
                size="sm"
                variant="outline"
                disabled={page >= pagination.totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="gap-1 text-xs"
              >
                Next <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
