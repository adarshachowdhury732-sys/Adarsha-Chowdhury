import React from 'react';
import { Home, MessageSquare, History, Smartphone } from 'lucide-react';

interface BottomNavProps {
  viewMode: 'landing' | 'chat' | 'install' | 'history';
  onViewModeChange: (mode: 'landing' | 'chat' | 'install' | 'history') => void;
  themeMode: 'light' | 'dark';
}

export const BottomNav: React.FC<BottomNavProps> = ({ viewMode, onViewModeChange, themeMode }) => {
  return (
    <div className={`md:hidden flex items-center justify-around w-full h-[68px] border-t pb-safe z-50 transition-colors duration-300 ${
      themeMode === 'dark' ? 'bg-[#0a0a0a]/90 border-slate-800/80 backdrop-blur-xl' : 'bg-white/90 border-slate-200/80 backdrop-blur-xl'
    }`}>
      <button 
        onClick={() => onViewModeChange('landing')}
        className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${viewMode === 'landing' ? (themeMode === 'dark' ? 'text-white' : 'text-sky-600') : 'text-slate-500'}`}
      >
        <Home className={`w-6 h-6 ${viewMode === 'landing' ? 'fill-current' : ''}`} strokeWidth={viewMode === 'landing' ? 2 : 1.5} />
        <span className="text-[10px] font-medium tracking-wide">Home</span>
      </button>

      <button 
        onClick={() => onViewModeChange('chat')}
        className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${viewMode === 'chat' ? (themeMode === 'dark' ? 'text-white' : 'text-sky-600') : 'text-slate-500'}`}
      >
        <MessageSquare className={`w-6 h-6 ${viewMode === 'chat' ? 'fill-current' : ''}`} strokeWidth={viewMode === 'chat' ? 2 : 1.5} />
        <span className="text-[10px] font-medium tracking-wide">Chat</span>
      </button>

      <button 
        onClick={() => onViewModeChange('history')}
        className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${viewMode === 'history' ? (themeMode === 'dark' ? 'text-white' : 'text-sky-600') : 'text-slate-500'}`}
      >
        <History className={`w-6 h-6 ${viewMode === 'history' ? 'fill-current' : ''}`} strokeWidth={viewMode === 'history' ? 2 : 1.5} />
        <span className="text-[10px] font-medium tracking-wide">History</span>
      </button>

      <button 
        onClick={() => onViewModeChange('install')}
        className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${viewMode === 'install' ? (themeMode === 'dark' ? 'text-white' : 'text-sky-600') : 'text-slate-500'}`}
      >
        <Smartphone className={`w-6 h-6 ${viewMode === 'install' ? 'fill-current' : ''}`} strokeWidth={viewMode === 'install' ? 2 : 1.5} />
        <span className="text-[10px] font-medium tracking-wide">App</span>
      </button>
    </div>
  );
};
