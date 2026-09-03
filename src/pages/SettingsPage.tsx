import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Sidebar } from '../components/layout/Sidebar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';
import {
  Settings,
  ShieldCheck,
  Server,
  Lock,
  Bell,
  Database,
  RefreshCw,
  Save,
  CheckCircle,
  AlertTriangle,
  Globe,
  Sliders,
  Radio,
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { user } = useAuth();
  const toast = useToast();
  const [activeTab, setActiveTab] = useState<'general' | 'security' | 'notifications' | 'maintenance'>('general');

  // Form State
  const [generalConfig, setGeneralConfig] = useState({
    schoolName: 'Horizon International Academy',
    schoolCode: 'HIA-2026',
    timezone: 'UTC+06:00 (Asia/Dhaka)',
    currency: 'USD ($)',
    academicYearDefault: '2025-2026 Academic Session',
    supportEmail: 'admin@school.com',
  });

  const [securityConfig, setSecurityConfig] = useState({
    sessionTimeoutMinutes: 60,
    maxLoginAttempts: 5,
    requireMFAForAdmins: true,
    jwtExpiryHours: 24,
    auditRetentionDays: 365,
    allowPublicRegistration: false,
  });

  const [notificationConfig, setNotificationConfig] = useState({
    emailAlertsEnabled: true,
    smsAlertsEnabled: false,
    systemAnnouncements: true,
    parentWeeklyDigest: true,
    feeOverdueReminders: true,
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleSaveSettings = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast.success('System Settings Saved', 'Global platform parameters updated successfully.');
    }, 600);
  };

  const handleTriggerBackup = () => {
    toast.success('System Backup Initiated', 'Encrypted database snapshot generation queued.');
  };

  const handleClearCache = () => {
    toast.success('Cache Flushed', 'Redis and application query cache cleared successfully.');
  };

  if (!user || user.role !== 'SUPER_ADMIN') return null;

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <Sidebar />

      <div className="flex-1 space-y-6">
        <Breadcrumbs />

        {/* Header Banner */}
        <div className="glass-panel p-6 rounded-3xl border border-purple-500/20 bg-gradient-to-r from-purple-950/40 via-gray-900/60 to-indigo-950/40">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <Badge variant="purple" className="mb-2 gap-1.5 font-mono">
                <Settings className="h-3.5 w-3.5 text-purple-400" /> Super Admin Control Panel
              </Badge>
              <h2 className="text-2xl font-extrabold text-white">System Settings & Infrastructure</h2>
              <p className="text-xs text-gray-400 mt-1">
                Configure global SaaS preferences, security policies, authentication parameters, and database operations.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button size="sm" onClick={handleSaveSettings} disabled={isSaving} className="gap-1.5 text-xs bg-purple-600 hover:bg-purple-500">
                {isSaving ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                Save Changes
              </Button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-gray-800 pb-3 overflow-x-auto">
          <button
            onClick={() => setActiveTab('general')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'general'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
            }`}
          >
            <Globe className="h-4 w-4" /> General School Info
          </button>

          <button
            onClick={() => setActiveTab('security')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'security'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
            }`}
          >
            <Lock className="h-4 w-4" /> Security & Auth
          </button>

          <button
            onClick={() => setActiveTab('notifications')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'notifications'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
            }`}
          >
            <Bell className="h-4 w-4" /> Notification Gateways
          </button>

          <button
            onClick={() => setActiveTab('maintenance')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'maintenance'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
            }`}
          >
            <Database className="h-4 w-4" /> Operations & Database
          </button>
        </div>

        {/* TAB 1: General Info */}
        {activeTab === 'general' && (
          <Card className="border-gray-800 bg-gray-900/50">
            <CardHeader>
              <CardTitle className="text-base text-white flex items-center gap-2">
                <Globe className="h-4 w-4 text-purple-400" /> Institutional & Regional Defaults
              </CardTitle>
              <CardDescription className="text-xs">Primary identification parameters for reporting and user notifications.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-gray-300 font-semibold block mb-1">Institution Legal Name</label>
                  <input
                    type="text"
                    value={generalConfig.schoolName}
                    onChange={(e) => setGeneralConfig({ ...generalConfig, schoolName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-gray-950 border border-gray-800 text-white text-xs"
                  />
                </div>
                <div>
                  <label className="text-gray-300 font-semibold block mb-1">School Code / Identification</label>
                  <input
                    type="text"
                    value={generalConfig.schoolCode}
                    onChange={(e) => setGeneralConfig({ ...generalConfig, schoolCode: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-gray-950 border border-gray-800 text-white text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="text-gray-300 font-semibold block mb-1">System Timezone</label>
                  <input
                    type="text"
                    value={generalConfig.timezone}
                    onChange={(e) => setGeneralConfig({ ...generalConfig, timezone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-gray-950 border border-gray-800 text-white text-xs"
                  />
                </div>
                <div>
                  <label className="text-gray-300 font-semibold block mb-1">Billing Currency Code</label>
                  <input
                    type="text"
                    value={generalConfig.currency}
                    onChange={(e) => setGeneralConfig({ ...generalConfig, currency: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-gray-950 border border-gray-800 text-white text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="text-gray-300 font-semibold block mb-1">Default Active Session</label>
                  <input
                    type="text"
                    value={generalConfig.academicYearDefault}
                    onChange={(e) => setGeneralConfig({ ...generalConfig, academicYearDefault: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-gray-950 border border-gray-800 text-white text-xs"
                  />
                </div>
                <div>
                  <label className="text-gray-300 font-semibold block mb-1">System Support Contact Email</label>
                  <input
                    type="email"
                    value={generalConfig.supportEmail}
                    onChange={(e) => setGeneralConfig({ ...generalConfig, supportEmail: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-gray-950 border border-gray-800 text-white text-xs font-mono"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* TAB 2: Security & Auth */}
        {activeTab === 'security' && (
          <Card className="border-gray-800 bg-gray-900/50">
            <CardHeader>
              <CardTitle className="text-base text-white flex items-center gap-2">
                <Lock className="h-4 w-4 text-purple-400" /> Security Controls & RBAC Enforcement
              </CardTitle>
              <CardDescription className="text-xs">Configure session thresholds, token life, and audit retention policies.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-gray-300 font-semibold block mb-1">Session Inactivity Timeout (Minutes)</label>
                  <input
                    type="number"
                    value={securityConfig.sessionTimeoutMinutes}
                    onChange={(e) => setSecurityConfig({ ...securityConfig, sessionTimeoutMinutes: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-gray-950 border border-gray-800 text-white text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="text-gray-300 font-semibold block mb-1">JWT Bearer Expiry (Hours)</label>
                  <input
                    type="number"
                    value={securityConfig.jwtExpiryHours}
                    onChange={(e) => setSecurityConfig({ ...securityConfig, jwtExpiryHours: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-gray-950 border border-gray-800 text-white text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="text-gray-300 font-semibold block mb-1">Max Failed Login Attempts</label>
                  <input
                    type="number"
                    value={securityConfig.maxLoginAttempts}
                    onChange={(e) => setSecurityConfig({ ...securityConfig, maxLoginAttempts: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-gray-950 border border-gray-800 text-white text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="text-gray-300 font-semibold block mb-1">Audit Ledger Retention (Days)</label>
                  <input
                    type="number"
                    value={securityConfig.auditRetentionDays}
                    onChange={(e) => setSecurityConfig({ ...securityConfig, auditRetentionDays: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-gray-950 border border-gray-800 text-white text-xs font-mono"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-gray-800 space-y-3">
                <div className="flex items-center justify-between p-3 rounded-2xl bg-gray-950 border border-gray-800">
                  <div>
                    <span className="font-bold text-white block">Multi-Factor Authentication (MFA) for Admins</span>
                    <span className="text-gray-400 text-[11px]">Require TOTP app verification for SUPER_ADMIN role logins.</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={securityConfig.requireMFAForAdmins}
                    onChange={(e) => setSecurityConfig({ ...securityConfig, requireMFAForAdmins: e.target.checked })}
                    className="h-4 w-4 rounded accent-purple-600"
                  />
                </div>

                <div className="flex items-center justify-between p-3 rounded-2xl bg-gray-950 border border-gray-800">
                  <div>
                    <span className="font-bold text-white block">Allow Self-Service Public Registration</span>
                    <span className="text-gray-400 text-[11px]">Permit open account registration without prior invitation.</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={securityConfig.allowPublicRegistration}
                    onChange={(e) => setSecurityConfig({ ...securityConfig, allowPublicRegistration: e.target.checked })}
                    className="h-4 w-4 rounded accent-purple-600"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* TAB 3: Notifications */}
        {activeTab === 'notifications' && (
          <Card className="border-gray-800 bg-gray-900/50">
            <CardHeader>
              <CardTitle className="text-base text-white flex items-center gap-2">
                <Bell className="h-4 w-4 text-purple-400" /> Automated Broadcast & Alert Triggers
              </CardTitle>
              <CardDescription className="text-xs">Configure outbound notification services for parents, students, and faculty.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-gray-950 border border-gray-800">
                <div>
                  <span className="font-bold text-white block">Transactional Email Delivery</span>
                  <span className="text-gray-400 text-[11px]">Send fee receipts, report cards, and password reset tokens via SMTP.</span>
                </div>
                <Badge variant={notificationConfig.emailAlertsEnabled ? 'success' : 'error'}>
                  {notificationConfig.emailAlertsEnabled ? 'ACTIVE' : 'DISABLED'}
                </Badge>
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-gray-950 border border-gray-800">
                <div>
                  <span className="font-bold text-white block">SMS Gateway Integrations</span>
                  <span className="text-gray-400 text-[11px]">Send emergency notices and attendance absence alerts via Twilio/SMS.</span>
                </div>
                <Badge variant={notificationConfig.smsAlertsEnabled ? 'success' : 'error'}>
                  {notificationConfig.smsAlertsEnabled ? 'ACTIVE' : 'DISABLED'}
                </Badge>
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-gray-950 border border-gray-800">
                <div>
                  <span className="font-bold text-white block">Automated Overdue Fee Reminders</span>
                  <span className="text-gray-400 text-[11px]">Dispatch automated billing reminders to linked parent accounts 3 days prior to due date.</span>
                </div>
                <input
                  type="checkbox"
                  checked={notificationConfig.feeOverdueReminders}
                  onChange={(e) => setNotificationConfig({ ...notificationConfig, feeOverdueReminders: e.target.checked })}
                  className="h-4 w-4 rounded accent-purple-600"
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* TAB 4: Operations & Database */}
        {activeTab === 'maintenance' && (
          <Card className="border-gray-800 bg-gray-900/50">
            <CardHeader>
              <CardTitle className="text-base text-white flex items-center gap-2">
                <Database className="h-4 w-4 text-purple-400" /> Database & Maintenance Operations
              </CardTitle>
              <CardDescription className="text-xs">Database health checks, backup snapshots, and cache management.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-gray-950 border border-gray-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Database Engine</span>
                    <Badge variant="purple" className="font-mono text-[9px]">PostgreSQL 16</Badge>
                  </div>
                  <p className="text-lg font-bold text-white">Healthy</p>
                  <p className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                    <CheckCircle className="h-3 w-3" /> Connection pool active (Prisma ORM)
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-gray-950 border border-gray-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Storage Provider</span>
                    <Badge variant="purple" className="font-mono text-[9px]">Local Vault</Badge>
                  </div>
                  <p className="text-lg font-bold text-white">4.2 GB / 50 GB</p>
                  <p className="text-[10px] text-gray-400 font-mono">Document uploads active</p>
                </div>

                <div className="p-4 rounded-2xl bg-gray-950 border border-gray-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">System Uptime</span>
                    <Badge variant="success" className="font-mono text-[9px]">99.98%</Badge>
                  </div>
                  <p className="text-lg font-bold text-white">14 Days, 6 Hours</p>
                  <p className="text-[10px] text-emerald-400 font-mono">Zero unhandled crash events</p>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-800 flex flex-wrap gap-3">
                <Button size="sm" onClick={handleTriggerBackup} className="gap-1.5 text-xs bg-purple-600 hover:bg-purple-500">
                  <Database className="h-4 w-4" /> Trigger Encrypted Snapshot Backup
                </Button>
                <Button size="sm" variant="outline" onClick={handleClearCache} className="gap-1.5 text-xs">
                  <RefreshCw className="h-4 w-4 text-purple-400" /> Flush Application Cache
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
