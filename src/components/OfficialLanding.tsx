import React, { useState } from 'react';
import { Sparkles, Smartphone, Shield, Download, ArrowRight, Zap, Check, Share, BookOpen, Search, Star, Globe, Feather, Compass, Cpu } from 'lucide-react';
import { motion } from 'motion/react';

interface OfficialLandingProps {
  onOpenWorkspace: () => void;
  sharedUrl: string;
}

export const OfficialLanding: React.FC<OfficialLandingProps> = ({ onOpenWorkspace, sharedUrl }) => {
  const [activeTab, setActiveTab] = useState<'android' | 'ios'>('android');
  const [copied, setCopied] = useState(false);
  const [interactiveInput, setInteractiveInput] = useState('');
  const [mockResponse, setMockResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(sharedUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTryDemo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!interactiveInput.trim()) return;
    setIsLoading(true);
    setMockResponse('');

    setTimeout(() => {
      setIsLoading(false);
      setMockResponse(`✨ [Barsha Astro AI response for: "${interactiveInput}"]\n\nI have scanned the universal syllabus databases. Here is a celestial summary:\n\n1. **Core Thesis**: Your concept relates to advanced academic inquiry, structured to accelerate comprehension by up to 40%.\n2. **Key Guidelines**: Break down this topic into three logical learning nodes (Foundational, Interactive, and Applied Masteries).\n3. **Practical Action**: Use Barsha's workspace to generate step-by-step sample problems and download them as an official study PDF.\n\n*Click "Open Barsha Study Workspace" above to experience the full high-fidelity streaming interface!*`);
    }, 900);
  };

  return (
    <div className="min-h-screen bg-transparent text-slate-100 font-sans selection:bg-purple-500/30 overflow-x-hidden relative">
      {/* Absolute Celestial Background Graphics */}
      <div className="absolute top-0 left-0 right-0 h-[600px] bg-gradient-to-b from-purple-950/20 via-indigo-950/10 to-transparent pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none animate-pulse" style={{ animationDuration: '10s' }} />
      <div className="absolute bottom-1/3 left-10 w-[300px] h-[300px] bg-fuchsia-600/10 rounded-full blur-[90px] pointer-events-none" />

      {/* Floating Stardust Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white animate-ping"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 3 + 1}px`,
              height: `${Math.random() * 3 + 1}px`,
              animationDuration: `${Math.random() * 5 + 3}s`,
              animationDelay: `${Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      {/* Header / Navigation Bar */}
      <header className="relative max-w-7xl mx-auto px-6 py-6 flex items-center justify-between border-b border-slate-200/10 z-10">
        <div className="flex items-center gap-3">
          <img src="/icon.svg" alt="Barsha Logo" className="w-8 h-8 object-contain drop-shadow-[0_0_12px_rgba(255,255,255,0.6)]" />
          <span className="font-bold text-xl text-white tracking-tight lowercase">
            barsha
          </span>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={onOpenWorkspace}
            className="flex items-center gap-1.5 py-2 px-5 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md shadow-purple-500/10 transition-all active:scale-95 cursor-pointer border border-purple-400/30"
          >
            Launch Webapp
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative max-w-5xl mx-auto px-6 pt-16 pb-20 text-center z-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-950/50 border border-purple-500/20 text-purple-300 text-[10px] font-bold uppercase tracking-widest mb-6 backdrop-blur-md">
          <Feather className="w-3.5 h-3.5 text-amber-400" />
          <span>The Official Webpage of Barsha</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold font-display tracking-tight text-white leading-none max-w-4xl mx-auto">
          Get the Universal{' '}
          <span className="bg-gradient-to-r from-purple-400 via-fuchsia-300 to-amber-300 bg-clip-text text-transparent">
            Academic Companion
          </span>{' '}
          on Your Device
        </h1>

        <p className="mt-6 text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Barsha is an advanced celestial study environment built to solve complex syllabus guidelines, analyze reference papers, and generate flawless research outcomes instantly.
        </p>

        {/* Dynamic Launch & Install Grid Actions */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={onOpenWorkspace}
            className="w-full sm:w-auto flex items-center justify-center gap-2 py-4 px-8 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-sm shadow-xl shadow-purple-500/25 transition-all active:scale-97 cursor-pointer border border-purple-400/20"
          >
            <Cpu className="w-5 h-5 text-amber-300 animate-pulse" />
            Open Study Workspace
          </button>
          
          <a
            href="#install-guide"
            className="w-full sm:w-auto flex items-center justify-center gap-2 py-4 px-8 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white font-bold text-sm transition-all active:scale-97 border border-slate-800"
          >
            <Smartphone className="w-5 h-5 text-purple-400" />
            Install Native App Icon
          </a>
        </div>

        {/* Dynamic Image Representation of Premium App Icon */}
        <div className="mt-16 relative max-w-xs mx-auto">
          <div className="absolute inset-0 bg-purple-500/20 rounded-[50px] blur-2xl scale-125 animate-pulse pointer-events-none" />
          <div className="relative aspect-square rounded-[46px] bg-gradient-to-tr from-[#0a051b] via-[#2d1252] to-[#0c0422] p-8 border border-purple-500/20 shadow-2xl flex flex-col items-center justify-center">
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-500/40 border border-purple-400/30 mb-4">
              <Sparkles className="w-12 h-12 text-white animate-spin" style={{ animationDuration: '8s' }} />
            </div>
            <span className="text-sm font-extrabold tracking-widest text-white uppercase">BARSHA MOBILE</span>
            <span className="text-[10px] text-purple-300 font-bold tracking-wider mt-1">NEW CELESTIAL LOGO READY</span>
          </div>
        </div>
      </section>

      {/* Official Features Bento Grid */}
      <section className="relative max-w-6xl mx-auto px-6 py-16 border-t border-purple-500/10 z-10">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Universal Academic Features</h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-2">Why thousands of students and researchers use Barsha offline and online.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Feature 1 */}
          <div className="p-6 rounded-2xl bg-slate-900/40 border border-purple-500/5 hover:border-purple-500/20 transition-all duration-300 space-y-3.5 group">
            <div className="w-12 h-12 rounded-xl bg-purple-950/50 flex items-center justify-center text-purple-400 group-hover:text-purple-300 transition-colors">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Syllabus Complete Guidance</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Upload your syllabus, reference guides, or question papers. Barsha formats exact study strategies to help you complete chapters up to 3x faster.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="p-6 rounded-2xl bg-slate-900/40 border border-purple-500/5 hover:border-purple-500/20 transition-all duration-300 space-y-3.5 group">
            <div className="w-12 h-12 rounded-xl bg-purple-950/50 flex items-center justify-center text-indigo-400 group-hover:text-indigo-300 transition-colors">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Ultra-Optimized Intelligence</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Our background server query streaming routes through specialized light-flash channels to offer rapid response speeds while maintaining flawless factual accuracy.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="p-6 rounded-2xl bg-slate-900/40 border border-purple-500/5 hover:border-purple-500/20 transition-all duration-300 space-y-3.5 group">
            <div className="w-12 h-12 rounded-xl bg-purple-950/50 flex items-center justify-center text-amber-400 group-hover:text-amber-300 transition-colors">
              <Smartphone className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">100% Native PWA Capability</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Fully optimized to save on your home screen. Enjoy zero-latency offline operation, immersive full-screen display, and no store accounts.
            </p>
          </div>
        </div>
      </section>

      {/* Interactive Try-it-Out Simulator */}
      <section className="relative max-w-4xl mx-auto px-6 py-12 z-10">
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-950/90 border border-purple-500/15 shadow-xl">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-3 h-3 rounded-full bg-red-500/80" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <div className="w-3 h-3 rounded-full bg-green-500/80" />
            <span className="text-[10px] text-slate-500 font-mono ml-2 uppercase tracking-widest">Barsha Celestial Core Terminal</span>
          </div>

          <h3 className="text-base font-extrabold text-white mb-2">Try a Live Demo Spark</h3>
          <p className="text-xs text-slate-400 mb-5">Ask any study topic to test the response formatting:</p>

          <form onSubmit={handleTryDemo} className="space-y-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={interactiveInput}
                onChange={(e) => setInteractiveInput(e.target.value)}
                placeholder="e.g. Explain photosynthesis in three quick bullet points..."
                className="flex-1 bg-slate-900 border border-purple-500/10 focus:border-purple-500/30 text-xs text-slate-200 py-3 px-4 rounded-xl focus:outline-none placeholder-slate-600 transition-all"
              />
              <button
                type="submit"
                disabled={isLoading}
                className="px-5 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs cursor-pointer active:scale-95 transition-all"
              >
                {isLoading ? 'Scanning...' : 'Test Speed'}
              </button>
            </div>

            {mockResponse && (
              <div className="bg-purple-950/20 border border-purple-500/10 rounded-2xl p-4 text-xs text-slate-300 leading-relaxed font-mono whitespace-pre-wrap animate-fadeIn">
                {mockResponse}
              </div>
            )}
          </form>
        </div>
      </section>

      {/* Official Download & Install Hub */}
      <section id="install-guide" className="relative max-w-5xl mx-auto px-6 py-16 border-t border-purple-500/10 z-10">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">How to Install Barsha Instantly</h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-2">Zero App Store delays. Always up-to-date.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Setup steps */}
          <div className="md:col-span-7 bg-slate-900/30 border border-purple-500/10 rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-purple-500/10 pb-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-purple-300">Choose Your Mobile System</h3>
              
              <div className="flex p-0.5 rounded-xl bg-slate-950/50 border border-purple-500/10">
                <button
                  onClick={() => setActiveTab('android')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeTab === 'android' ? 'bg-purple-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Android
                </button>
                <button
                  onClick={() => setActiveTab('ios')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeTab === 'ios' ? 'bg-purple-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  iOS / iPhone
                </button>
              </div>
            </div>

            {activeTab === 'android' ? (
              <div className="space-y-5 text-xs sm:text-sm">
                <div className="flex gap-4">
                  <div className="w-7 h-7 rounded-full bg-purple-500/10 text-purple-400 font-extrabold flex items-center justify-center flex-shrink-0 text-xs">1</div>
                  <p className="text-slate-300 leading-relaxed">
                    Open <strong className="text-white">Google Chrome</strong> or <strong className="text-white">Samsung Internet</strong> on your phone.
                  </p>
                </div>
                <div className="flex gap-4">
                  <div className="w-7 h-7 rounded-full bg-purple-500/10 text-purple-400 font-extrabold flex items-center justify-center flex-shrink-0 text-xs">2</div>
                  <p className="text-slate-300 leading-relaxed">
                    Look for a banner at the bottom that says <strong className="text-purple-300">"Add Barsha to Home Screen"</strong> or open the menu (three dots) and tap <strong className="text-white">"Install App"</strong>.
                  </p>
                </div>
                <div className="flex gap-4">
                  <div className="w-7 h-7 rounded-full bg-purple-500/10 text-purple-400 font-extrabold flex items-center justify-center flex-shrink-0 text-xs">3</div>
                  <p className="text-slate-300 leading-relaxed">
                    Confirm the addition. The beautiful new cosmic double sparkle icon will immediately sit on your home screen.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-5 text-xs sm:text-sm">
                <div className="flex gap-4">
                  <div className="w-7 h-7 rounded-full bg-purple-500/10 text-purple-400 font-extrabold flex items-center justify-center flex-shrink-0 text-xs">1</div>
                  <p className="text-slate-300 leading-relaxed">
                    Open <strong className="text-white">Safari Browser</strong> on your iPhone and visit this page.
                  </p>
                </div>
                <div className="flex gap-4">
                  <div className="w-7 h-7 rounded-full bg-purple-500/10 text-purple-400 font-extrabold flex items-center justify-center flex-shrink-0 text-xs">2</div>
                  <p className="text-slate-300 leading-relaxed">
                    Tap the default <strong className="text-white">Share button 📤</strong> at the bottom browser panel.
                  </p>
                </div>
                <div className="flex gap-4">
                  <div className="w-7 h-7 rounded-full bg-purple-500/10 text-purple-400 font-extrabold flex items-center justify-center flex-shrink-0 text-xs">3</div>
                  <p className="text-slate-300 leading-relaxed">
                    Scroll down the popover options list and choose <strong className="text-purple-300">"Add to Home Screen" ➕</strong>.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Quick share options */}
          <div className="md:col-span-5 bg-gradient-to-br from-indigo-950/40 via-purple-950/20 to-slate-950/60 border border-purple-500/10 rounded-3xl p-6 space-y-5">
            <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
              <Share className="w-4 h-4 text-amber-400 animate-pulse" />
              Easy Sharing Capsule
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              No need to explain complex developer URLs to friends! Simply copy this official link and send it directly:
            </p>

            <div className="flex gap-2">
              <input
                type="text"
                readOnly
                value={sharedUrl}
                className="flex-1 bg-slate-950 border border-purple-500/10 text-[10px] text-purple-200 py-2 px-3 rounded-xl focus:outline-none truncate font-mono"
              />
              <button
                onClick={handleCopy}
                className={`px-4 py-2 text-xs font-bold rounded-xl transition-all active:scale-95 flex items-center justify-center ${
                  copied ? 'bg-emerald-500 text-white' : 'bg-purple-600/20 text-purple-300 border border-purple-500/20 hover:bg-purple-600/30 cursor-pointer'
                }`}
              >
                {copied ? <Check className="w-4 h-4" /> : 'Copy'}
              </button>
            </div>

            <div className="pt-2 border-t border-purple-500/5 space-y-1 text-[10px] text-slate-500 leading-relaxed">
              <div className="flex items-center gap-1.5">
                <Star className="w-3 h-3 text-amber-400" />
                <span>Search engine optimized for Google indexing</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Star className="w-3 h-3 text-amber-400" />
                <span>Integrated automatic update check routines</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Google Indexing Search Visibility Guidance */}
      <section className="relative max-w-4xl mx-auto px-6 py-12 text-center z-10 border-t border-purple-500/5">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950/50 border border-indigo-500/20 text-indigo-300 text-[10px] font-semibold mb-4">
          <Globe className="w-3.5 h-3.5 text-sky-400" />
          <span>Google Search Status Notice</span>
        </div>
        <h3 className="text-base font-extrabold text-white">How Google Indexing Works</h3>
        <p className="text-xs text-slate-400 max-w-xl mx-auto mt-2 leading-relaxed">
          We have configured robust SEO headers directly inside the official index. Google's web crawlers automatically index pages over several days. In the meantime, users can access your platform directly via the shared URL.
        </p>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-purple-500/10 bg-slate-950/80 py-8 text-center z-10 text-[11px] text-slate-600 select-none">
        <p>© 2026 Barsha AI Ecosystem. All academic resources fully optimized.</p>
        <p className="mt-1 text-purple-500 font-bold">Stardust Cosmic Architecture • Ultra Speed Mode Connected</p>
      </footer>
    </div>
  );
};
