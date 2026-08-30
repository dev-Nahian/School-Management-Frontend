import React from 'react';
import { ShieldAlert } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-gray-800/60 py-6 px-6 glass-panel mt-12">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between text-xs text-gray-400 gap-4">
        <div className="flex items-center gap-2">
          <ShieldAlert className="h-4 w-4 text-purple-400" />
          <span>School Management System — Modular & Secure Enterprise Architecture</span>
        </div>
        <div className="flex items-center gap-6">
          <span>React + Vite + TypeScript</span>
          <span>•</span>
          <span>Node.js + Express + Prisma</span>
          <span>•</span>
          <span>PostgreSQL DB</span>
        </div>
      </div>
    </footer>
  );
};
