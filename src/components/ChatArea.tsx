import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  GraduationCap, 
  BookOpen, 
  Code, 
  Globe, 
  FileText, 
  Image as ImageIcon, 
  Download, 
  Flower, 
  Sparkles,
  ArrowDown,
  Compass,
  AlertCircle,
  Smile
} from 'lucide-react';
import { ChatSession, Message, Attachment } from '../types';
import { MarkdownRenderer } from './MarkdownRenderer';
import { DandelionSeeds } from './DandelionSeeds';
import { ChatInput } from './ChatInput';

interface ChatAreaProps {
  session: ChatSession | null;
  isGenerating: boolean;
  onSendPreset: (prompt: string) => void;
  onSendMessage: (content: string, attachments: Attachment[]) => void;
  themePreset: 'rose' | 'tulip' | 'dandelion';
  appMode: 'study' | 'search' | 'sarcasm';
  onAppModeChange: (mode: 'study' | 'search' | 'sarcasm') => void;
}

const PRESET_PROMPTS = [
  {
    id: 'pyq',
    label: 'Solve Worldwide PYQ',
    prompt: 'Provide a rigorous, step-by-step solution to the following university past-year question on differential equations, explaining the underlying mathematical intuition:\n\n"Find the general solution of the second-order linear differential equation: y\'\' - 5y\' + 6y = 3e^(2x)"',
    icon: GraduationCap,
    subject: 'STEM / Academic PYQ',
    desc: 'Step-by-step reasoning',
    color: 'border-sky-200 hover:border-sky-400 bg-sky-50/20'
  },
  {
    id: 'lit',
    label: 'World Literature Critique',
    prompt: 'Compare the narrative innovations of Virginia Woolf in "Mrs. Dalloway" with James Joyce\'s "Ulysses". Contrast their uses of "stream of consciousness" and evaluate their global literary legacy.',
    icon: BookOpen,
    subject: 'Worldwide Literature',
    desc: 'Detailed narrative analysis',
    color: 'border-rose-200 hover:border-rose-400 bg-rose-50/10'
  },
  {
    id: 'cs',
    label: 'Computer Science Code',
    prompt: 'Write an optimized JavaScript algorithm to solve the Longest Common Subsequence (LCS) problem using dynamic programming. Provide a full explanation of the DP table state-transitions and complexity analysis.',
    icon: Code,
    subject: 'Computer Science',
    desc: 'Clean code with logic proofs',
    color: 'border-emerald-200 hover:border-emerald-400 bg-emerald-50/10'
  },
  {
    id: 'gk',
    label: 'GK & Current Affairs',
    prompt: 'Analyze the recent major developments in global superconductor fabrication and fabrication factories. What are the key geopolitical supply-chain bottlenecks and logical forecasts for the upcoming five years?',
    icon: Globe,
    subject: 'Current Affairs / Geopolitics',
    desc: 'Analytical global forecasts',
    color: 'border-amber-200 hover:border-amber-400 bg-amber-50/10'
  }
];

const LOADING_QUOTES = [
  "Sifting through universal subject databases...",
  "Consulting world literature and exam structures...",
  "Applying mathematical rigor and step-by-step analysis...",
  "Verifying historical context and facts...",
  "Analyzing visual/document attachment vectors...",
  "Barsha is formulating a deep, logical solution...",
  "Writing clean code and proofing edge cases..."
];

export const ChatArea: React.FC<ChatAreaProps> = ({
  session,
  isGenerating,
  onSendPreset,
  onSendMessage,
  themePreset,
  appMode,
  onAppModeChange,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const [loadingQuote, setLoadingQuote] = useState(LOADING_QUOTES[0]);

  // Handle auto-scroll on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [session?.messages?.length, isGenerating]);

  // Monitor loading quote cycle during generation
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isGenerating) {
      let index = 0;
      interval = setInterval(() => {
        index = (index + 1) % LOADING_QUOTES.length;
        setLoadingQuote(LOADING_QUOTES[index]);
      }, 3500);
    }
    return () => clearInterval(interval);
  }, [isGenerating]);

  // Monitor scroll height to show "scroll to bottom" button
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const isNearBottom = target.scrollHeight - target.scrollTop - target.clientHeight < 300;
    setShowScrollBtn(!isNearBottom);
  };

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  };

  const hasMessages = session && session.messages.length > 0;

  return (
    <div className="relative flex-1 flex flex-col min-w-0 min-h-0 bg-white/45 dark:bg-transparent select-text">
      {/* Scrollable Container */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto overscroll-none px-4 py-6 md:px-8 space-y-6"
      >
        {!hasMessages ? (
          // HOME / WELCOME SCREEN (When no messages are staged)
          <div className="relative max-w-2xl mx-auto pt-12 pb-12 z-10">
            {/* Elegant Floating Seeds Background (Only on Home Screen) */}
            {themePreset === 'dandelion' && <DandelionSeeds />}

            {/* Glowing Floral Backdrop Rings */}
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full blur-3xl opacity-20 pointer-events-none bg-purple-400" />

            {/* Main Branding Card */}
            <div className="text-center space-y-4 mb-8">
              <div className="inline-flex items-center justify-center relative">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-500/20 relative z-10 transition-all duration-300 border border-purple-400/20 dark:from-slate-800 dark:to-slate-700">
                  <img src="/flower-logo.png" alt="Barsha Logo" className="w-12 h-12 object-contain drop-shadow-[0_0_12px_rgba(255,255,255,0.8)]" onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.nextElementSibling?.classList.remove('hidden') }} />
                  <Sparkles className="w-8 h-8 text-white hidden" />
                </div>
                <div className="absolute inset-0 bg-purple-500/10 rounded-2xl blur-md scale-115 animate-pulse" />
              </div>

              <div className="space-y-2">
                <h2 className="text-3xl md:text-4.5xl font-extrabold font-display tracking-tight text-slate-800 dark:text-white lowercase">
                  barsha
                </h2>
                <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto font-medium">
                  {appMode === 'study' 
                    ? 'Study Mode Active — detailed academic answers & syllabus tracking'
                    : appMode === 'search'
                      ? 'Search Mode Active — concise, direct & rapid answers'
                      : 'Sarcasm Mode Active — sassy & sassy replies'
                  }
                </p>
              </div>
            </div>

            {/* Dynamic Mode Switcher Pill */}
            <div className="flex justify-center mb-8">
              <div className="inline-flex bg-slate-100 dark:bg-slate-800/80 p-1 rounded-2xl border border-slate-200/50 dark:border-slate-700/50 shadow-sm flex-wrap justify-center">
                <button
                  onClick={() => onAppModeChange('study')}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    appMode === 'study'
                      ? 'bg-white dark:bg-slate-700 text-purple-600 dark:text-purple-300 shadow-sm'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  <GraduationCap className="w-4.5 h-4.5" />
                  Study Mode
                </button>
                <button
                  onClick={() => onAppModeChange('search')}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    appMode === 'search'
                      ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-sm'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  <Sparkles className="w-4 h-4" />
                  Search Mode
                </button>
                <button
                  onClick={() => onAppModeChange('sarcasm')}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    appMode === 'sarcasm'
                      ? 'bg-white dark:bg-slate-700 text-pink-600 dark:text-pink-300 shadow-sm'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  <Smile className="w-4 h-4" />
                  Sarcasm Mode
                </button>
              </div>
            </div>

            {/* Quick try options (Elegant Rounded Text Pills) */}
            <div className="flex flex-wrap justify-center gap-2 max-w-xl mx-auto px-4 mt-8">
              <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider self-center mr-1">
                Try asking:
              </span>
              {PRESET_PROMPTS.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => onSendPreset(preset.prompt)}
                  id={`preset-prompt-${preset.id}`}
                  className="text-xs bg-white dark:bg-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/80 py-1.5 px-3 rounded-full transition-all cursor-pointer active:scale-95 shadow-3xs"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>
        ) : (
          // CONVERSATION FLOW (When messages exist)
          <div className="max-w-3xl mx-auto space-y-6">
            {/* Print-only academic header banner */}
            <div className="hidden print:block print-only-header">
              <h1>Barsha Study Intelligence Report</h1>
              <p>Academic Research & Universal Syllabus Solver</p>
              <div className="text-[10pt] text-slate-500 mt-2">
                Date: {new Date().toLocaleDateString()} &bull; Session Workspace: {session.title}
              </div>
            </div>

            <AnimatePresence initial={false}>
              {session.messages.map((message) => {
                const isUser = message.role === 'user';

                return (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className={`flex gap-3 md:gap-4 ${isUser ? 'justify-end' : 'justify-start'} message-print-block`}
                  >
                  {/* Message Container */}
                  <div className={`max-w-[85%] flex flex-col space-y-1.5 ${isUser ? 'items-end' : 'items-start'} w-full`}>
                    {/* Academic Print Labels */}
                    <div className="hidden print:block mb-1 font-serif">
                      {isUser ? (
                        <span className="message-print-role-student">Student Inquiry:</span>
                      ) : (
                        <span className="message-print-role-barsha">Barsha Expert Analytics:</span>
                      )}
                    </div>

                    {/* Attachments (rendered above text for cleanliness) */}
                    {message.attachments && message.attachments.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-1">
                        {message.attachments.map((file) => (
                          <div
                            key={file.id}
                            className="flex items-center gap-2 bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl py-1.5 px-3 shadow-4xs select-none max-w-xs"
                          >
                            {file.type === 'image' ? (
                              <div className="relative w-8 h-8 rounded-lg overflow-hidden border border-slate-200/50 dark:border-slate-700 flex-shrink-0 bg-slate-200 dark:bg-slate-800">
                                <img
                                  src={file.data}
                                  alt={file.name}
                                  referrerPolicy="no-referrer"
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            ) : (
                              <div className="w-8 h-8 rounded-lg bg-sky-50 dark:bg-sky-900/30 border border-sky-100 dark:border-sky-800/50 flex items-center justify-center text-sky-500 dark:text-sky-400 flex-shrink-0">
                                <FileText className="w-4.5 h-4.5" />
                              </div>
                            )}
                            <div className="min-w-0 pr-1">
                              <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 truncate max-w-[120px]">{file.name}</p>
                              <p className="text-[9px] text-slate-400 font-medium">
                                {file.type.toUpperCase()}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Speech / Text Bubble */}
                    <div className={`leading-relaxed w-full ${
                      isUser
                        ? 'rounded-2xl px-4 py-3 md:py-3.5 shadow-4xs bg-sky-500 text-white rounded-br-none font-medium text-sm md:text-base border border-sky-400/20 dark:bg-sky-600/80'
                        : 'text-slate-800 dark:text-slate-200 text-sm md:text-base'
                    }`}>
                      {isUser ? (
                        <p className="whitespace-pre-wrap break-words">{message.content}</p>
                      ) : (
                        <MarkdownRenderer content={message.content} />
                      )}
                    </div>

                    {/* Interactive suggestions underneath Barsha responses */}
                    {!isUser && message.suggestions && message.suggestions.length > 0 && (
                      <div className="pt-2 flex flex-col gap-1.5 w-full">
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider pl-1 flex items-center gap-1 mt-1">
                          <Compass className="w-3 h-3 text-sky-400" /> Suggested Exploration:
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {message.suggestions.map((suggestion, idx) => (
                            <button
                              key={idx}
                              onClick={() => onSendPreset(suggestion)}
                              id={`insight-suggestion-${idx}`}
                              className="text-left text-xs bg-sky-50/50 dark:bg-sky-900/30 hover:bg-sky-100/85 dark:hover:bg-sky-800/80 text-sky-700 dark:text-sky-300 border border-sky-100/80 dark:border-sky-800/50 py-2 px-3 rounded-xl transition-all cursor-pointer hover:border-sky-300 dark:hover:border-sky-600 active:scale-98"
                            >
                              {suggestion}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
            </AnimatePresence>

            {/* Inline Loading / Generation Indicator */}
            {isGenerating && (
              <div className="flex gap-3 md:gap-4 justify-start">
                <div className="w-8 h-8 rounded-xl flex-shrink-0 flex items-center justify-center bg-gradient-to-tr from-purple-600 to-indigo-600 text-white border border-purple-500/20 shadow-3xs">
                  <Sparkles className="w-4 h-4 animate-spin" />
                </div>

                <div className="flex flex-col space-y-1.5 max-w-[85%]">
                  <div className="bg-white border border-slate-200/65 rounded-2xl rounded-bl-none px-4 py-3.5 shadow-4xs">
                    <div className="flex items-center gap-3">
                      <div className="flex space-x-1.5">
                        <div className="w-2 h-2 bg-sky-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <div className="w-2 h-2 bg-sky-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <div className="w-2 h-2 bg-sky-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                      <p className="text-xs text-slate-500 font-medium animate-pulse">
                        {loadingQuote}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Floating Scroll to Bottom button */}
      {showScrollBtn && (
        <button
          onClick={scrollToBottom}
          id="scroll-to-bottom-btn"
          className="absolute bottom-4 right-6 bg-white/90 hover:bg-white text-slate-600 border border-slate-200/80 p-2.5 rounded-full shadow-md z-30 transition-all hover:shadow-lg active:scale-90"
          title="Scroll to bottom"
        >
          <ArrowDown className="w-4 h-4 animate-bounce" />
        </button>
      )}

      {/* Strict Safety warning banner in footer */}
      <div className="px-4 py-1.5 bg-slate-50 border-t border-slate-100 select-none text-[10px] text-slate-400 flex items-center justify-center gap-1 text-center">
        <AlertCircle className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
        <span>Educational integrity enabled. Secure sandbox prohibits harmful morphed graphic outputs.</span>
      </div>
    </div>
  );
};
