import React from 'react';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { useHealthStatus } from '../hooks/useHealthStatus';

interface RootLayoutProps {
  children: React.ReactNode;
}

export const RootLayout: React.FC<RootLayoutProps> = ({ children }) => {
  const { data: health } = useHealthStatus();

  return (
    <div className="min-h-screen flex flex-col bg-[#0b0f19] text-gray-100 selection:bg-purple-500/30 selection:text-purple-200">
      {/* Background aesthetic ambient lighting */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -right-40 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl" />
      </div>

      <Header isDbConnected={health?.isDbConnected} />
      
      <main className="flex-1 max-w-[1750px] w-full mx-auto px-4 md:px-8 pt-8 pb-12">
        {children}
      </main>

      <Footer />
    </div>
  );
};
