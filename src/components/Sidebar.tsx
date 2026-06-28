import React from 'react';
import { Plus, MessageSquare, Trash2, X, Sparkles, Layers, Eye, HelpCircle, Sun, Moon, Download, Smartphone } from 'lucide-react';
import { ChatSession } from '../types';

interface SidebarProps {
  sessions: ChatSession[];
  activeSessionId: string | null;
  onSelectSession: (id: string) => void;
  onDeleteSession: (id: string) => void;
  onClearAllChats?: () => void;
  onNewChat: () => void;
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
  onClearAllChats,
  onNewChat,
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
        className={`fixed inset-y-0 left-0 z-50 flex flex-col w-72 bg-white/60 dark:bg-[#010101]/40 backdrop-blur-md border-r border-slate-200/50 dark:border-slate-800/50 transition-transform duration-300 ease-out lg:static lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between px-5 py-6 border-b border-slate-200/50 dark:border-slate-800/50">
          <div className="flex items-center gap-3">
            <img src="/flower-logo.png" alt="Barsha Logo" className="w-8 h-8 object-contain drop-shadow-[0_0_8px_rgba(255,255,255,0.2)] dark:drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]" onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.nextElementSibling?.classList.remove('hidden') }} />
            <Sparkles className="w-6 h-6 text-slate-800 dark:text-white hidden" />
            <span className="font-bold text-xl text-slate-800 dark:text-white tracking-tight lowercase">
              barsha
            </span>
          </div>
          <button
            onClick={onClose}
            id="close-sidebar-mobile-btn"
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden active:scale-95 transition-all"
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

        {/* Chat History Section */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-1">
          <div className="flex items-center justify-between mb-3 px-2">
            <span className="block text-[10px] font-bold text-sky-400 uppercase tracking-widest select-none">
              Recent Workspaces
            </span>
            {sessions.length > 0 && onClearAllChats && (
              <button
                onClick={onClearAllChats}
                className="text-[10px] text-slate-400 hover:text-red-500 font-semibold uppercase tracking-wider transition-colors"
                title="Delete all chats"
              >
                Clear All
              </button>
            )}
          </div>
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

        {/* System Status Display Card */}
        <div className="p-4 border-t border-slate-200/50 dark:border-slate-800/50 bg-slate-50 dark:bg-slate-900/50 space-y-3 mx-2 mb-2 rounded-xl">
          <div className="flex items-center gap-2.5">
            <div className="relative flex items-center justify-center w-7 h-7 rounded-lg bg-sky-100 text-sky-600 dark:bg-sky-900/50 dark:text-sky-400">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <span className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-none">System Status</span>
              <span className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mt-1">Online & Connected</span>
            </div>
          </div>
        </div>

        {/* Sidebar Footer */}
        <div className="px-5 py-4 border-t border-slate-200/50 dark:border-slate-800/50 text-center select-none bg-slate-50 dark:bg-slate-900/30">
          <p className="text-[10px] text-slate-500 leading-relaxed font-semibold tracking-wide uppercase">
            Barsha AI Engine
          </p>
          <div className="flex items-center justify-center gap-1.5 mt-1 text-[9px] text-sky-500 font-bold uppercase tracking-wider">
            <span>Core Model</span>
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
            <span>Active</span>
          </div>
        </div>
      </aside>
    </>
  );
};
