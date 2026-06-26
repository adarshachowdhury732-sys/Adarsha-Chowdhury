import { useState, useEffect } from 'react';
import { Menu, Plus, Trash2, Flower, Sparkles, RefreshCw, AlertCircle, Download, CheckCircle, Smartphone } from 'lucide-react';
import { Sidebar } from './components/Sidebar';
import { ChatArea } from './components/ChatArea';
import { ChatInput } from './components/ChatInput';
import { InstallHub } from './components/InstallHub';
import { OfficialLanding } from './components/OfficialLanding';
import { ChatSession, Message, Attachment } from './types';
import { parseBarshaResponse } from './utils';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  // --- Splash Screen state ---
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    // Beautiful, premium timing to showcase the initial branding
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2200);
    return () => clearTimeout(timer);
  }, []);

  // --- Persistent State hooks ---
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentModel, setCurrentModel] = useState<string>('gemini-3.5-flash');
  const [themePreset, setThemePreset] = useState<'rose' | 'tulip' | 'dandelion'>('dandelion');
  const [themeMode, setThemeMode] = useState<'light' | 'dark'>('dark');
  const [appMode, setAppMode] = useState<'study' | 'search'>('study');
  const [isStandalone, setIsStandalone] = useState(false);
  
  // --- View modes & update states ---
  const [viewMode, setViewMode] = useState<'chat' | 'install' | 'landing'>('landing');
  const [swUpdateAvailable, setSwUpdateAvailable] = useState(false);
  const [swRegistration, setSwRegistration] = useState<ServiceWorkerRegistration | null>(null);
  const [showUpdateSuccess, setShowUpdateSuccess] = useState(false);

  // Check standalone mode on load
  useEffect(() => {
    const checkStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone;
    const isMobileApp = !!checkStandalone;
    setIsStandalone(isMobileApp);
    if (isMobileApp) {
      setViewMode('chat');
    } else {
      setViewMode('landing');
    }
  }, []);

  const getCleanSharedUrl = () => {
    let origin = window.location.origin;
    if (origin.includes('-dev-')) {
      origin = origin.replace('-dev-', '-pre-');
    }
    return origin;
  };

  // --- Mobile visual toggle ---
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Service Worker and update listeners
  useEffect(() => {
    let updateInterval: NodeJS.Timeout;

    if ('serviceWorker' in navigator) {
      // Register/get registration and trigger an update check
      navigator.serviceWorker.register('/sw.js').then((reg) => {
        setSwRegistration(reg);
        
        // Immediately check for server updates on launch
        reg.update().catch(err => console.debug('SW startup update check failed:', err));
        
        // If there's already a waiting worker, show the update banner
        if (reg.waiting) {
          setSwUpdateAvailable(true);
        }

        // Listen for new service worker updates installing
        reg.addEventListener('updatefound', () => {
          const newWorker = reg.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                setSwUpdateAvailable(true);
              }
            });
          }
        });

        // Periodic background update check (every 2 minutes)
        updateInterval = setInterval(() => {
          reg.update().catch(err => console.debug('Periodic SW update check failed:', err));
        }, 120000);
      });

      // Handle reload when new service worker takes over
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        localStorage.setItem('barsha_just_updated', 'true');
        window.location.reload();
      });
    }

    return () => {
      if (updateInterval) clearInterval(updateInterval);
    };

    // Check if we just updated to show a delightful success notification toast
    try {
      const justUpdated = localStorage.getItem('barsha_just_updated');
      if (justUpdated === 'true') {
        setShowUpdateSuccess(true);
        localStorage.removeItem('barsha_just_updated');
        const timer = setTimeout(() => {
          setShowUpdateSuccess(false);
        }, 5000);
        return () => clearTimeout(timer);
      }
    } catch (e) {
      console.error(e);
    }

    // Generate a high-quality PNG icon on-the-fly for iOS Safari / Apple Touch Icon support
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = '/icon.svg';
    img.onload = () => {
      try {
        const size = 192;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, size, size);
          const pngDataUrl = canvas.toDataURL('image/png');
          
          // Update apple touch icon dynamically
          let appleTouch = document.querySelector('link[rel="apple-touch-icon"]');
          if (!appleTouch) {
            appleTouch = document.createElement('link');
            appleTouch.setAttribute('rel', 'apple-touch-icon');
            document.head.appendChild(appleTouch);
          }
          appleTouch.setAttribute('href', pngDataUrl);
          
          // Also update standard favicon if it's an SVG-unfriendly browser
          let favicon = document.querySelector('link[rel="icon"]');
          if (favicon) {
            favicon.setAttribute('href', pngDataUrl);
            favicon.setAttribute('type', 'image/png');
          }
        }
      } catch (err) {
        console.error('Error generating dynamic PNG icon:', err);
      }
    };
  }, []);

  // Load configuration and workspaces on initialization
  useEffect(() => {
    try {
      const savedSessions = localStorage.getItem('barsha_chat_sessions');
      if (savedSessions) {
        const parsed = JSON.parse(savedSessions);
        if (Array.isArray(parsed)) {
          setSessions(parsed);
          // Auto-select latest active workspace if present
          if (parsed.length > 0) {
            setActiveSessionId(parsed[0].id);
          }
        }
      }

      const savedTheme = localStorage.getItem('barsha_theme_preset');
      if (savedTheme && ['rose', 'tulip', 'dandelion'].includes(savedTheme)) {
        setThemePreset(savedTheme as any);
      }

      const savedModel = localStorage.getItem('barsha_model_engine');
      if (savedModel) {
        setCurrentModel(savedModel);
      }

      const savedMode = localStorage.getItem('barsha_theme_mode');
      if (savedMode === 'dark' || savedMode === 'light') {
        setThemeMode(savedMode);
      } else {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setThemeMode(prefersDark ? 'dark' : 'light');
      }

      const savedAppMode = localStorage.getItem('barsha_app_mode');
      if (savedAppMode === 'study' || savedAppMode === 'search') {
        setAppMode(savedAppMode as 'study' | 'search');
      }
    } catch (e) {
      console.error("Error reading from localstorage", e);
    }
  }, []);

  // Monitor themeMode side-effects to toggle Document classes
  useEffect(() => {
    if (themeMode === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('barsha_theme_mode', themeMode);
  }, [themeMode]);

  const handleToggleThemeMode = () => {
    setThemeMode((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  // Sync workspaces to localStorage whenever they are updated
  const syncSessionsToStorage = (updatedSessions: ChatSession[]) => {
    localStorage.setItem('barsha_chat_sessions', JSON.stringify(updatedSessions));
  };

  // Change theme preset
  const handleThemeChange = (preset: 'rose' | 'tulip' | 'dandelion') => {
    setThemePreset(preset);
    localStorage.setItem('barsha_theme_preset', preset);
  };

  // Change model engine
  const handleModelChange = (model: string) => {
    setCurrentModel(model);
    localStorage.setItem('barsha_model_engine', model);
  };

  // Change app mode (study vs normal search)
  const handleAppModeChange = (mode: 'study' | 'search') => {
    setAppMode(mode);
    localStorage.setItem('barsha_app_mode', mode);
  };

  const handleApplyUpdate = () => {
    if (swRegistration && swRegistration.waiting) {
      swRegistration.waiting.postMessage({ type: 'SKIP_WAITING' });
    } else {
      window.location.reload();
    }
  };

  // Select a past session
  const handleSelectSession = (id: string) => {
    setActiveSessionId(id);
  };

  // Delete a session
  const handleDeleteSession = (id: string) => {
    const updated = sessions.filter((s) => s.id !== id);
    setSessions(updated);
    syncSessionsToStorage(updated);

    if (activeSessionId === id) {
      setActiveSessionId(updated.length > 0 ? updated[0].id : null);
    }
  };

  // Reset / Start a fresh workspace
  const handleNewChat = () => {
    setActiveSessionId(null);
  };

  // Clear current active conversation history entirely
  const handleClearCurrentSession = () => {
    if (!activeSessionId) return;
    const updated = sessions.map((s) => {
      if (s.id === activeSessionId) {
        return { ...s, messages: [] };
      }
      return s;
    });
    setSessions(updated);
    syncSessionsToStorage(updated);
  };

  // CORE logic: Sending prompts and streaming responses
  const handleSendMessage = async (text: string, attachments: Attachment[]) => {
    if (isGenerating) return;

    let targetSessionId = activeSessionId;
    let currentSessions = [...sessions];
    let activeSession = currentSessions.find((s) => s.id === targetSessionId);

    const userMessage: Message = {
      id: Math.random().toString(36).substring(2, 9),
      role: 'user',
      content: text,
      timestamp: Date.now(),
      attachments: attachments.length > 0 ? attachments : undefined,
    };

    // If there is no active session, bootstrap a new session dynamically
    if (!targetSessionId || !activeSession) {
      const newSessionId = Math.random().toString(36).substring(2, 9);
      const newSession: ChatSession = {
        id: newSessionId,
        title: text ? (text.length > 25 ? text.substring(0, 25) + '...' : text) : 'New Chat',
        messages: [userMessage],
        createdAt: Date.now(),
      };

      currentSessions = [newSession, ...currentSessions];
      setSessions(currentSessions);
      setActiveSessionId(newSessionId);
      syncSessionsToStorage(currentSessions);

      targetSessionId = newSessionId;
      activeSession = newSession;

      // Asynchronously suggest a highly elegant, short 3-4 word title for this thread
      if (text) {
        try {
          const titleRes = await fetch('/api/suggest-title', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ messageText: text }),
          });
          const titleData = await titleRes.json();
          if (titleData.title) {
            setSessions((prev) => {
              const updated = prev.map((s) => {
                if (s.id === newSessionId) {
                  return { ...s, title: titleData.title };
                }
                return s;
              });
              syncSessionsToStorage(updated);
              return updated;
            });
          }
        } catch (e) {
          console.error("Failed to fetch suggested title", e);
        }
      }
    } else {
      // Append user message to existing session
      activeSession.messages = [...activeSession.messages, userMessage];
      setSessions(currentSessions);
      syncSessionsToStorage(currentSessions);
    }

    // Set generation status
    setIsGenerating(true);

    // Create a provisional, empty assistant message in state to receive streamed chunks
    const assistantMessageId = Math.random().toString(36).substring(2, 9);
    const initialAssistantMessage: Message = {
      id: assistantMessageId,
      role: 'assistant',
      content: '',
      timestamp: Date.now(),
    };

    setSessions((prev) =>
      prev.map((s) => {
        if (s.id === targetSessionId) {
          return { ...s, messages: [...s.messages, initialAssistantMessage] };
        }
        return s;
      })
    );

    try {
      // Send conversational messages history to the API endpoint
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: activeSession.messages,
          model: currentModel,
          mode: appMode,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Server responded with status code ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error("Response body is not readable.");
      }

      const decoder = new TextDecoder();
      let rawAccumulatedText = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const decodedChunk = decoder.decode(value, { stream: true });
        const lines = decodedChunk.split('\n');

        for (const line of lines) {
          const trimmedLine = line.trim();
          if (trimmedLine.startsWith('data: ')) {
            const jsonStr = trimmedLine.slice(6).trim();
            if (jsonStr === '[DONE]') {
              break;
            }
            try {
              const parsed = JSON.parse(jsonStr);
              if (parsed.text) {
                rawAccumulatedText += parsed.text;

                // Dynamically separate standard markdown text from custom footer suggestions
                const { cleanContent, suggestions } = parseBarshaResponse(rawAccumulatedText);

                setSessions((prev) =>
                  prev.map((s) => {
                    if (s.id === targetSessionId) {
                      const updatedMessages = s.messages.map((m) => {
                        if (m.id === assistantMessageId) {
                          return {
                            ...m,
                            content: cleanContent,
                            suggestions: suggestions.length > 0 ? suggestions : undefined,
                          };
                        }
                        return m;
                      });
                      return { ...s, messages: updatedMessages };
                    }
                    return s;
                  })
                );
              } else if (parsed.error) {
                throw new Error(parsed.error);
              }
            } catch (err) {
              // Ignore JSON parse errors for fragmented SSE chunks
            }
          }
        }
      }
    } catch (error: any) {
      console.error("Error generating chat response:", error);
      // Update provisional assistant message in UI to reflect error
      setSessions((prev) =>
        prev.map((s) => {
          if (s.id === targetSessionId) {
            const updatedMessages = s.messages.map((m) => {
              if (m.id === assistantMessageId) {
                return {
                  ...m,
                  content: `⚠️ **System Integration Error:** ${error.message || "Failed to stream educational content from Barsha engine. Please check your credentials or configuration."}`,
                };
              }
              return m;
            });
            return { ...s, messages: updatedMessages };
          }
          return s;
        })
      );
    } finally {
      setIsGenerating(false);
      // Sync completed session with storage
      setSessions((prev) => {
        syncSessionsToStorage(prev);
        return prev;
      });
    }
  };

  // Helper trigger to send preset prompt cards
  const handleSendPreset = (prompt: string) => {
    handleSendMessage(prompt, []);
  };

  const currentActiveSession = sessions.find((s) => s.id === activeSessionId) || null;

  return (
    <AnimatePresence mode="wait">
      {showSplash ? (
        <motion.div
          key="splash-screen"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.65, ease: [0.34, 1.56, 0.64, 1] }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#070514] overflow-hidden select-none"
        >
          {/* Ambient Cosmic Background Glows */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-gradient-to-r from-purple-500/10 to-indigo-500/10 blur-[120px] pointer-events-none" />
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full bg-gradient-to-r from-purple-500/5 to-indigo-500/5 blur-[80px] pointer-events-none animate-pulse" style={{ animationDuration: '4s' }} />

          {/* Logo / Symbol Animation */}
          <div className="relative mb-8 flex flex-col items-center justify-center">
            {/* Spinning/pulsing circular outline */}
            <motion.div
              initial={{ rotate: 0, scale: 0.8, opacity: 0 }}
              animate={{ rotate: 360, scale: 1, opacity: 1 }}
              transition={{
                rotate: { duration: 25, ease: "linear", repeat: Infinity },
                scale: { duration: 1.2, ease: "easeOut" },
                opacity: { duration: 1 }
              }}
              className="absolute w-24 h-24 rounded-full border border-dashed border-purple-500/30"
            />
            
            {/* Outer solid rings */}
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: [0.85, 1.15, 0.85], opacity: [0.3, 0.8, 0.3] }}
              transition={{
                duration: 3,
                ease: "easeInOut",
                repeat: Infinity,
              }}
              className="absolute w-20 h-20 rounded-full border border-purple-400/20"
            />

            {/* Core Icon Container */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                type: "spring",
                stiffness: 120,
                damping: 15,
                delay: 0.2
              }}
              className="relative z-10 w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center shadow-2xl shadow-purple-500/20 border border-purple-400/20"
            >
              <Sparkles className="w-8 h-8 text-white" />
            </motion.div>
          </div>

          {/* Brand/App Title Text with staggered letter animations */}
          <div className="text-center z-10 flex flex-col items-center">
            <motion.h1
              initial={{ letterSpacing: "0.1em", opacity: 0, y: 15 }}
              animate={{ letterSpacing: "0.3em", opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
              className="text-2xl font-black font-display text-white tracking-widest uppercase flex items-center justify-center gap-1.5"
            >
              BARSHA
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
            </motion.h1>

            {/* Glowing Tagline */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 0.8, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.8 }}
              className="text-xs text-purple-200/60 font-mono tracking-wider mt-2.5 max-w-[280px]"
            >
              YOUR INTELLIGENT ACADEMIC COMPANION
            </motion.p>

            {/* Elegant loading bar */}
            <div className="w-40 h-[2px] bg-slate-900 rounded-full overflow-hidden mt-8 relative">
              <motion.div
                initial={{ left: "-100%" }}
                animate={{ left: "100%" }}
                transition={{
                  duration: 2.0,
                  ease: "easeInOut",
                  repeat: 0,
                }}
                className="absolute top-0 bottom-0 w-1/2 bg-gradient-to-r from-purple-500 to-indigo-400 rounded-full shadow-[0_0_8px_rgba(147,51,234,0.5)]"
              />
            </div>
          </div>
        </motion.div>
      ) : viewMode === 'landing' ? (
        <OfficialLanding
          onOpenWorkspace={() => setViewMode('chat')}
          sharedUrl={getCleanSharedUrl()}
        />
      ) : (
        <motion.div
          key="main-app"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className={`flex h-screen w-screen overflow-hidden transition-colors duration-300 ${themeMode === 'dark' ? 'dark bg-[#070214] text-slate-100' : 'bg-[#fafcff] text-slate-800'}`}
        >
          {/* 1. Left Sidebar Navigation */}
          <Sidebar
            sessions={sessions}
            activeSessionId={activeSessionId}
            onSelectSession={handleSelectSession}
            onDeleteSession={handleDeleteSession}
            onNewChat={handleNewChat}
            currentModel={currentModel}
            onChangeModel={handleModelChange}
            themePreset={themePreset}
            onChangeThemePreset={handleThemeChange}
            themeMode={themeMode}
            onToggleThemeMode={handleToggleThemeMode}
            isOpen={mobileSidebarOpen}
            onClose={() => setMobileSidebarOpen(false)}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            isStandalone={isStandalone}
          />

          {/* 2. Main Interface Panel */}
          <div className="flex-1 flex flex-col min-w-0 h-full relative">
            {/* Dynamic header navigation */}
            <header className={`flex items-center justify-between px-4 py-3.5 backdrop-blur-md border-b z-20 select-none transition-colors duration-300 ${
              themeMode === 'dark' ? 'bg-[#0d041e]/80 border-purple-950/20' : 'bg-white/70 border-slate-200/80'
            }`}>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setMobileSidebarOpen(true)}
                  id="mobile-menu-hamburger-btn"
                  className="p-2 rounded-xl hover:bg-slate-50 text-slate-500 hover:text-slate-700 active:scale-95 transition-all lg:hidden cursor-pointer"
                  title="Open menu"
                >
                  <Menu className="w-5 h-5" />
                </button>
                <div className="flex items-center gap-2">
                  <div className={`p-1.5 rounded-lg flex items-center justify-center ${
                    themePreset === 'rose' ? 'bg-rose-50 text-rose-500' :
                    themePreset === 'tulip' ? 'bg-amber-50 text-amber-500' :
                    'bg-sky-50 text-sky-500'
                  }`}>
                    <Flower className="w-4 h-4 text-sky-400" />
                  </div>
                  <h1 className="text-base font-bold font-display tracking-tight">
                    {viewMode === 'install' ? "App Download & Update Hub" : (currentActiveSession ? currentActiveSession.title : "Barsha")}
                  </h1>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {viewMode !== 'install' && (
                  <>
                    {/* Model Badge */}
                    <div className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-full border border-sky-100 bg-sky-50/50 text-[10px] font-bold text-sky-700">
                      <Sparkles className="w-3 h-3 text-sky-400" />
                      <span className="capitalize">{currentModel.replace(/-/g, ' ')}</span>
                    </div>

                    {/* Export as Study PDF */}
                    {currentActiveSession && currentActiveSession.messages.length > 0 && (
                      <button
                        onClick={() => window.print()}
                        id="header-export-pdf-btn"
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-sky-200 bg-sky-50/50 hover:bg-sky-100/50 text-sky-700 text-xs font-semibold active:scale-95 transition-all cursor-pointer shadow-xs"
                        title="Export workspace as academic study PDF"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span className="hidden xs:inline">Export PDF</span>
                      </button>
                    )}

                    {/* Clear conversation button */}
                    {currentActiveSession && currentActiveSession.messages.length > 0 && (
                      <button
                        onClick={handleClearCurrentSession}
                        id="header-clear-chat-btn"
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 hover:border-red-200 hover:bg-red-50 hover:text-red-600 text-slate-500 text-xs font-semibold active:scale-95 transition-all cursor-pointer"
                        title="Clear messages in workspace"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span className="hidden xs:inline">Clear Chat</span>
                      </button>
                    )}
                  </>
                )}
              </div>
            </header>

            {/* Conditionally Render Chat vs PWA Download Hub */}
            {viewMode === 'install' ? (
              <div className="flex-1 overflow-y-auto bg-[#fafcff] dark:bg-[#0c1220] transition-colors duration-300">
                <InstallHub onBack={() => setViewMode('chat')} sharedUrl={getCleanSharedUrl()} />
              </div>
            ) : (
              <>
                {/* 3. Central Chat Messaging Area */}
                <ChatArea
                  session={currentActiveSession}
                  isGenerating={isGenerating}
                  onSendPreset={handleSendPreset}
                  onSendMessage={handleSendMessage}
                  themePreset={themePreset}
                  appMode={appMode}
                  onAppModeChange={handleAppModeChange}
                />

                {/* 4. Bottom Input Capsule */}
                {currentActiveSession && currentActiveSession.messages.length > 0 && (
                  <ChatInput
                    onSendMessage={handleSendMessage}
                    isGenerating={isGenerating}
                    themePreset={themePreset}
                  />
                )}
              </>
            )}
          </div>

          {/* Service Worker Update Prompt Banner */}
          <AnimatePresence>
            {swUpdateAvailable && (
              <motion.div
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.95 }}
                className="fixed bottom-6 left-6 right-6 md:left-auto md:right-6 md:w-96 bg-gradient-to-r from-purple-900 to-indigo-900 text-white rounded-2xl p-4 shadow-2xl border border-purple-500/30 z-[100] flex flex-col gap-3"
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-purple-500/20 text-purple-300">
                    <RefreshCw className="w-5 h-5 animate-spin" style={{ animationDuration: '3s' }} />
                  </div>
                  <div className="space-y-0.5">
                    <h4 className="text-sm font-bold tracking-tight">Update Available!</h4>
                    <p className="text-xs text-purple-200/80 leading-relaxed">
                      A brand new, faster version of Barsha is ready. Apply now to get the latest academic features and optimization updates.
                    </p>
                  </div>
                </div>
                <div className="flex gap-2.5 justify-end">
                  <button
                    onClick={() => setSwUpdateAvailable(false)}
                    className="px-3.5 py-1.5 rounded-xl text-xs font-semibold hover:bg-white/10 text-purple-200 hover:text-white transition-all cursor-pointer"
                  >
                    Later
                  </button>
                  <button
                    onClick={handleApplyUpdate}
                    className="px-4 py-1.5 rounded-xl bg-white text-purple-950 text-xs font-bold hover:bg-purple-100 transition-all cursor-pointer shadow-sm"
                  >
                    Update Now
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Update Success Notification Toast */}
          <AnimatePresence>
            {showUpdateSuccess && (
              <motion.div
                initial={{ opacity: 0, y: -50, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                className="fixed top-20 left-1/2 -translate-x-1/2 bg-emerald-500 text-white px-5 py-3 rounded-full shadow-lg border border-emerald-400 flex items-center gap-2.5 z-[100]"
              >
                <CheckCircle className="w-5 h-5 text-white" />
                <span className="text-xs font-bold tracking-wide uppercase">App Updated Successfully!</span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
