import React from 'react';
import { Plus, MessageSquare, Trash2, X, Sparkles, Flower, Eye, HelpCircle, Sun, Moon, Download, Smartphone } from 'lucide-react';
import { ChatSession } from '../types';

interface SidebarProps {
  sessions: ChatSession[];
  activeSessionId: string | null;
  onSelectSession: (id: string) => void;
  onDeleteSession: (id: string) => void;
  onNewChat: () => void;
  currentModel: string;
  onChangeModel: (model: string) => void;
  themePreset: 'rose' | 'tulip' | 'dandelion';
  onChangeThemePreset: (preset: 'rose' | 'tulip' | 'dandelion') => void;
  themeMode: 'light' | 'dark';
  onToggleThemeMode: () => void;
  isOpen: boolean;
  onClose: () => void;
  viewMode: 'chat' | 'install' | 'landing';
  onViewModeChange: (mode: 'chat' | 'install' | 'landing') => void;
  isStandalone?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  sessions,
  activeSessionId,
  onSelectSession,
  onDeleteSession,
  onNewChat,
  currentModel,
  onChangeModel,
  themePreset,
  onChangeThemePreset,
  themeMode,
  onToggleThemeMode,
  isOpen,
  onClose,
  viewMode,
  onViewModeChange,
  isStandalone = false,
}) => {
  return (
    <>
      {/* Mobile Drawer Overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          id="mobile-sidebar-overlay"
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 lg:hidden transition-opacity duration-350"
        />
      )}

      {/* Main Sidebar Panel */}
      <aside
        id="app-sidebar"
        className={`fixed inset-y-0 left-0 z-50 flex flex-col w-72 bg-white/60 backdrop-blur-md border-r border-sky-100/90 transition-transform duration-300 ease-out lg:static lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-sky-50">
          <div className="flex items-center gap-3">
            <div className={`p-1.5 rounded-full flex items-center justify-center shadow-md ${
              themePreset === 'rose' ? 'bg-rose-50 text-rose-500 shadow-rose-100' :
              themePreset === 'tulip' ? 'bg-amber-50 text-amber-500 shadow-amber-100' :
              'bg-sky-400 text-white shadow-sky-100'
            }`}>
              <Flower className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold font-serif italic tracking-tight text-sky-900 flex items-center gap-1">
                Barsha
                <span className="text-[10px] font-sans font-bold px-1.5 py-0.5 rounded-full bg-sky-100 text-sky-700 tracking-normal not-italic ml-1 scale-90">
                  AI
                </span>
              </h1>
              <p className="text-[10px] text-sky-400 font-bold uppercase tracking-wider">Universal Repos</p>
            </div>
          </div>
          <button
            onClick={onClose}
            id="close-sidebar-mobile-btn"
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-50 lg:hidden active:scale-95 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Button: Start New Chat */}
        <div className="px-4 pt-4 pb-2 space-y-2">
          <button
            onClick={() => {
              onNewChat();
              onViewModeChange('chat');
              onClose();
            }}
            id="start-new-chat-btn"
            className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold text-white bg-sky-500 hover:bg-sky-600 rounded-xl shadow-xs transition-all active:scale-98 cursor-pointer duration-150"
          >
            <Plus className="w-4 h-4" />
            <span>New Conversation</span>
          </button>

          {/* Action Button: Download/Install PWA Hub */}
          {!isStandalone && (
            <div className="space-y-2 w-full">
              <button
                onClick={() => {
                  onViewModeChange(viewMode === 'install' ? 'chat' : 'install');
                  onClose();
                }}
                id="download-app-hub-btn"
                className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl transition-all active:scale-98 cursor-pointer duration-150 ${
                  viewMode === 'install'
                    ? 'bg-purple-600 hover:bg-purple-700 text-white shadow-md'
                    : 'bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200/40 dark:border-purple-800/30 hover:bg-purple-100 dark:hover:bg-purple-900/40'
                }`}
              >
                <Smartphone className="w-4 h-4" />
                <span>{viewMode === 'install' ? 'Back to Workspace' : 'Download / Install App'}</span>
              </button>

              <button
                onClick={() => {
                  onViewModeChange('landing');
                  onClose();
                }}
                id="view-landing-page-btn"
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200/40 dark:border-slate-800/40 transition-all active:scale-98 cursor-pointer duration-150"
              >
                <Sparkles className="w-4 h-4 text-purple-500 animate-pulse" />
                <span>View Official Webpage</span>
              </button>
            </div>
          )}
        </div>

        {/* Model Selection Block */}
        <div className="px-4 py-2 border-b border-slate-100/70">
          <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5 pl-1">
            Engine Model
          </label>
          <div className="relative">
            <select
              value={currentModel}
              onChange={(e) => onChangeModel(e.target.value)}
              id="model-selector-select"
              className="w-full appearance-none bg-slate-50 border border-slate-200 hover:border-slate-300 text-xs text-slate-700 py-2.5 px-3 pr-8 rounded-lg focus:outline-none focus:ring-1 focus:ring-sky-400/80 focus:border-sky-400/80 cursor-pointer transition-all font-medium"
            >
              <option value="gemini-3.5-flash">⚡ Barsha Speed-Optimized Core</option>
              <option value="gemini-3.1-pro-preview">💎 Barsha Pro Deep-Reasoning Core</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-slate-500">
              <Sparkles className="w-3.5 h-3.5 text-sky-400" />
            </div>
          </div>
        </div>

        {/* Chat History Section */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-1">
          <span className="block text-[10px] font-bold text-sky-400 uppercase tracking-widest mb-3 pl-2 select-none">
            Recent Workspaces
          </span>
          {sessions.length === 0 ? (
            <div className="text-center py-8 px-4">
              <MessageSquare className="w-8 h-8 text-slate-200 mx-auto mb-2" />
              <p className="text-xs text-slate-400 leading-normal">No past sessions saved</p>
              <p className="text-[10px] text-slate-400 mt-1">Your work persists locally!</p>
            </div>
          ) : (
            sessions.map((session) => {
              const isActive = session.id === activeSessionId;
              return (
                <div
                  key={session.id}
                  className={`group relative flex items-center justify-between rounded-lg px-3 py-2 transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-sky-50/80 text-sky-700 border border-sky-100 font-medium'
                      : 'text-slate-600 hover:bg-sky-50/50 border border-transparent'
                  }`}
                  onClick={() => {
                    onSelectSession(session.id);
                    onViewModeChange('chat');
                    onClose();
                  }}
                >
                  <div className="flex items-center gap-2.5 min-w-0 pr-6">
                    <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-sky-400' : 'bg-transparent border border-sky-200'}`} />
                    <span className="text-xs truncate">{session.title}</span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteSession(session.id);
                    }}
                    id={`delete-session-${session.id}`}
                    className="absolute right-2 opacity-0 group-hover:opacity-100 hover:bg-slate-200/50 p-1 rounded text-slate-400 hover:text-red-500 transition-all duration-150 active:scale-90"
                    title="Delete workspace"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Astro Theme Display Card (Celestial Stardust) */}
        <div className="p-4 border-t border-purple-950/20 bg-gradient-to-br from-indigo-950/40 via-purple-950/25 to-slate-950/50 space-y-3.5 mx-1 mb-2 rounded-2xl border border-purple-500/10">
          <div className="flex items-center gap-2.5">
            <div className="relative flex items-center justify-center w-7 h-7 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-purple-200 shadow-lg shadow-purple-500/20">
              <Sparkles className="w-4 h-4 animate-spin" style={{ animationDuration: '6s' }} />
            </div>
            <div>
              <span className="block text-[10px] font-bold text-purple-400 uppercase tracking-widest leading-none">Active Theme</span>
              <span className="block text-xs font-semibold text-slate-200 mt-1">Celestial Astrocolors</span>
            </div>
          </div>
          <p className="text-[10px] text-slate-400/80 leading-relaxed pl-0.5">
            Locked in high-fidelity **Stardust Cosmic Mode** with premium rendering and gold-violet sparkle accents.
          </p>
        </div>

        {/* Sidebar Footer */}
        <div className="px-5 py-4 border-t border-purple-950/15 text-center select-none bg-slate-950/30">
          <p className="text-[10px] text-purple-300/60 leading-relaxed font-semibold tracking-wide">
            Barsha Celestial Ecosystem
          </p>
          <div className="flex items-center justify-center gap-1.5 mt-1 text-[9px] text-indigo-400 font-bold uppercase tracking-wider">
            <span>Stardust Interface</span>
            <span className="w-1 h-1 bg-purple-500 rounded-full animate-ping" />
            <span>Responsive Engine</span>
          </div>
        </div>
      </aside>
    </>
  );
};
