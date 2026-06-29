import React from 'react';
import { MessageSquare, Trash2, Plus } from 'lucide-react';
import { ChatSession } from '../types';

interface HistoryViewProps {
  sessions: ChatSession[];
  activeSessionId: string | null;
  onSelectSession: (id: string) => void;
  onDeleteSession: (id: string) => void;
  onClearAllChats?: () => void;
  onNewChat: () => void;
  themeMode: 'light' | 'dark';
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  sessions,
  activeSessionId,
  onSelectSession,
  onDeleteSession,
  onClearAllChats,
  onNewChat,
  themeMode
}) => {
  return (
    <div className={`flex flex-col h-full w-full p-4 overflow-y-auto ${themeMode === 'dark' ? 'bg-[#010101] text-white' : 'bg-[#fafcff] text-slate-800'}`}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold tracking-tight">Recent Workspaces</h2>
        {sessions.length > 0 && onClearAllChats && (
          <button
            onClick={onClearAllChats}
            className="text-xs text-red-500 hover:text-red-600 font-semibold uppercase tracking-wider transition-colors"
          >
            Clear All
          </button>
        )}
      </div>

      <button
        onClick={onNewChat}
        className="w-full flex items-center justify-center gap-2 px-4 py-3.5 mb-6 text-sm font-semibold text-white bg-sky-500 hover:bg-sky-600 rounded-2xl shadow-sm transition-all active:scale-95"
      >
        <Plus className="w-5 h-5" />
        <span>New Conversation</span>
      </button>

      <div className="space-y-3 flex-1">
        {sessions.length === 0 ? (
          <div className="text-center py-12 px-4">
            <MessageSquare className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">No past sessions saved</p>
          </div>
        ) : (
          sessions.map((session) => {
            const isActive = session.id === activeSessionId;
            return (
              <div
                key={session.id}
                className={`group relative flex items-center justify-between rounded-2xl p-4 transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-sky-50 dark:bg-sky-900/20 text-sky-700 dark:text-sky-300 border border-sky-100 dark:border-sky-800/50'
                    : 'bg-white dark:bg-[#0a0a0a] border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900/50'
                }`}
                onClick={() => onSelectSession(session.id)}
              >
                <div className="flex items-center gap-3 min-w-0 pr-6">
                  <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${isActive ? 'bg-sky-500' : 'bg-slate-200 dark:bg-slate-700'}`} />
                  <span className="text-sm font-medium truncate">{session.title}</span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteSession(session.id);
                  }}
                  className="p-2 -mr-2 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all active:scale-90"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
