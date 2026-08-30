import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { ShieldCheck, Lock, Mail, ArrowRight, Sparkles, Key, AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import type { UserRole } from '../types';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export const LoginPage: React.FC = () => {
  const { login, isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const rawFrom = (location.state as any)?.from?.pathname;
  const targetPath = rawFrom && rawFrom !== '/login' ? rawFrom : '/dashboard';

  useEffect(() => {
    if (!isAuthLoading && isAuthenticated) {
      navigate(targetPath, { replace: true });
    }
  }, [isAuthenticated, isAuthLoading, navigate, targetPath]);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: 'superadmin@school.com',
      password: 'Password123!',
    },
  });

  const demoAccounts = [
    { role: 'SUPER_ADMIN' as UserRole, email: 'superadmin@school.com', name: 'Alexander Wright', desc: 'Full System Administrator' },
    { role: 'ADMISSION_ADMIN' as UserRole, email: 'admission@school.com', name: 'Sarah Jenkins', desc: 'Admission Administrator' },
    { role: 'TEACHER' as UserRole, email: 'teacher@school.com', name: 'Marcus Vance', desc: 'Senior Class Educator' },
    { role: 'FINANCE' as UserRole, email: 'finance@school.com', name: 'Rachel Sterling', desc: 'Financial & Invoice Manager' },
    { role: 'STUDENT' as UserRole, email: 'student@school.com', name: 'Lucas Bennett', desc: 'Enrolled Student' },
    { role: 'PARENT' as UserRole, email: 'parent@school.com', name: 'Robert Bennett', desc: 'Guardian / Parent' },
  ];

  const onSubmit = async (values: LoginFormValues) => {
    setError(null);
    setIsSubmitting(true);
    try {
      await login({
        email: values.email || '',
        password: values.password || '',
      });
      navigate(targetPath, { replace: true });
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const fillDemoAccount = (email: string) => {
    setValue('email', email, { shouldValidate: true });
    setValue('password', 'Password123!', { shouldValidate: true });
    setError(null);
  };

  if (isAuthLoading) {
    return (
      <div className="min-h-[calc(100vh-140px)] flex items-center justify-center text-purple-400">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="h-8 w-8 animate-spin" />
          <span className="text-sm font-medium">Checking Session State...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-140px)] flex items-center justify-center py-6">
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Info Column */}
        <div className="lg:col-span-5 space-y-6">
          <div className="space-y-3">
            <Badge variant="purple" className="gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5" /> Security & Access Portal
            </Badge>
            <h2 className="text-3xl font-extrabold text-white tracking-tight">
              School Management System
            </h2>
            <p className="text-sm text-gray-400 leading-relaxed">
              Enterprise Role-Based Access Control (RBAC) supporting exactly 6 user authorization tiers. Log in using your secure credentials or select a test role.
            </p>
          </div>

          {/* Quick Demo Accounts Selection */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between text-xs text-gray-400 font-semibold uppercase tracking-wider">
              <span className="flex items-center gap-1.5 text-purple-300">
                <Sparkles className="h-3.5 w-3.5" /> 1-Click Dev Test Accounts
              </span>
              <span className="font-mono text-[10px] text-gray-400">Password: Password123!</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {demoAccounts.map((acc) => (
                <button
                  key={acc.email}
                  type="button"
                  onClick={() => fillDemoAccount(acc.email)}
                  className="text-left p-3 rounded-2xl glass-panel border border-gray-800 hover:border-purple-500/50 hover:bg-purple-500/10 transition-all group cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white group-hover:text-purple-300 transition-colors">
                      {acc.name}
                    </span>
                    <Badge variant="purple" className="text-[9px] px-1.5 py-0 font-mono">
                      {acc.role}
                    </Badge>
                  </div>
                  <p className="text-[10px] text-gray-400 truncate mt-1">{acc.desc}</p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Form Card */}
        <div className="lg:col-span-7">
          <div className="glass-panel rounded-3xl p-8 border border-purple-500/20 shadow-2xl relative overflow-hidden bg-gradient-to-b from-gray-900/80 to-gray-950/90">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-600/10 rounded-full blur-2xl pointer-events-none" />

            <div className="mb-6 space-y-1">
              <h3 className="text-xl font-bold text-white">Sign In to Your Account</h3>
              <p className="text-xs text-gray-400">Enter your email address and password to access the portal</p>
            </div>

            {error && (
              <div className="mb-6 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-3">
                <AlertCircle className="h-5 w-5 shrink-0 text-rose-400" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Email Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-300 flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5 text-purple-400" /> Email Address
                </label>
                <input
                  type="email"
                  {...register('email')}
                  placeholder="name@school.com"
                  className="w-full px-4 py-3 rounded-xl bg-gray-950/80 border border-gray-800 text-white text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 transition-colors"
                />
                {errors.email && (
                  <p className="text-[11px] text-rose-400">{errors.email.message}</p>
                )}
              </div>

              {/* Password Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-300 flex items-center gap-1.5">
                  <Lock className="h-3.5 w-3.5 text-purple-400" /> Password
                </label>
                <input
                  type="password"
                  {...register('password')}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-xl bg-gray-950/80 border border-gray-800 text-white text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 transition-colors"
                />
                {errors.password && (
                  <p className="text-[11px] text-rose-400">{errors.password.message}</p>
                )}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 text-sm font-bold gap-2 mt-2"
              >
                {isSubmitting ? (
                  <span>Authenticating...</span>
                ) : (
                  <>
                    <span>Authenticate Session</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>

              <div className="p-3 rounded-xl bg-gray-950/50 border border-gray-800 text-[11px] text-gray-400 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Key className="h-3.5 w-3.5 text-purple-400" /> Safe Bcrypt Hashing Active
                </span>
                <span className="font-mono text-purple-300">JWT Token Rotation</span>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
