import React, { useState, useEffect } from 'react';
import { Smartphone, Download, Check, Share, ArrowUpToLine, Shield, Info, RefreshCw, Zap, Sparkles } from 'lucide-react';

interface InstallHubProps {
  onBack: () => void;
  sharedUrl: string;
  isStandalone?: boolean;
}

export const InstallHub: React.FC<InstallHubProps> = ({ onBack, sharedUrl, isStandalone = false }) => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [activePlatform, setActivePlatform] = useState<'ios' | 'android' | 'desktop'>('android');
  const [copied, setCopied] = useState(false);
  const [updateChecking, setUpdateChecking] = useState(false);
  const [updateStatus, setUpdateStatus] = useState<'current' | 'checking' | 'updated'>('current');

  useEffect(() => {
    // Detect if app is already running in standalone mode (installed)
    const isStandalone = (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) || (window.navigator as any).standalone;
    if (isStandalone) {
      setIsInstalled(true);
    }

    // Capture the PWA install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Detect user platform to pre-select instructions
    const ua = navigator.userAgent.toLowerCase();
    if (/iphone|ipad|ipod/.test(ua)) {
      setActivePlatform('ios');
    } else if (/android/.test(ua)) {
      setActivePlatform('android');
    } else {
      setActivePlatform('desktop');
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      alert("Installation is fully supported on your mobile device. Follow the manual guide below to install it instantly!");
      return;
    }
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsInstalled(true);
      setDeferredPrompt(null);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(sharedUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCheckUpdates = () => {
    setUpdateChecking(true);
    setUpdateStatus('checking');
    
    // Simulate checking with service worker registration update
    setTimeout(() => {
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.ready.then((registration) => {
          registration.update().then(() => {
            setUpdateChecking(false);
            setUpdateStatus('updated');
            // If there's a waiting service worker, skip waiting will trigger controllerchange and reload
            setTimeout(() => {
              setUpdateStatus('current');
            }, 3000);
          }).catch(() => {
            setUpdateChecking(false);
            setUpdateStatus('current');
          });
        });
      } else {
        setUpdateChecking(false);
        setUpdateStatus('current');
      }
    }, 1500);
  };

  const handleHardUpdate = async () => {
    if (confirm("This will clear the app's cache and re-download all core assets from the server. It will fix any issues with cached icons, lagging pages, or cached files. Proceed?")) {
      setUpdateChecking(true);
      
      // 1. Unregister all service workers
      if ('serviceWorker' in navigator) {
        try {
          const registrations = await navigator.serviceWorker.getRegistrations();
          for (const reg of registrations) {
            await reg.unregister();
          }
        } catch (e) {
          console.error("Failed to unregister SW:", e);
        }
      }

      // 2. Clear all cache storages
      if ('caches' in window) {
        try {
          const keys = await caches.keys();
          for (const key of keys) {
            await caches.delete(key);
          }
        } catch (e) {
          console.error("Failed to delete cache:", e);
        }
      }

      // 3. Clear local storage flag
      localStorage.setItem('barsha_just_updated', 'true');

      // 4. Reload page fully from server
      window.location.reload();
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 md:py-12 select-none">
      {/* Header section with Premium purple identity */}
      <div className="text-center space-y-4 mb-10">
        <div className="inline-flex items-center justify-center relative mb-2">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center shadow-xl shadow-purple-500/30 border border-purple-400/20">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <div className="absolute inset-0 bg-purple-500/10 rounded-3xl blur-lg scale-120 animate-pulse" />
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold font-display tracking-tight text-slate-900 dark:text-white">
          Barsha App Hub
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-lg mx-auto leading-relaxed">
          Get Barsha directly on your mobile device or computer for 100% full-screen operation, completely free and offline-compatible without any App Store accounts.
        </p>
      </div>

      {/* Main Grid: Live installer & Manual setup */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        
        {/* Left column: Direct Action Card */}
        <div className="md:col-span-5 space-y-6">
          <div className="bg-white dark:bg-slate-800/90 rounded-3xl p-6 border border-slate-200/60 dark:border-slate-700/80 shadow-md">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
              <Download className="w-5 h-5 text-purple-500" />
              Direct Download
            </h3>

            {isInstalled ? (
              <div className="bg-emerald-50 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-300 p-4 rounded-2xl border border-emerald-100 dark:border-emerald-900/30 space-y-2 mb-6">
                <div className="flex items-center gap-2 font-bold text-sm">
                  <Check className="w-4 h-4 text-emerald-500" />
                  Barsha is Installed
                </div>
                <p className="text-xs leading-relaxed opacity-90">
                  You are currently running the secure, standalone version of Barsha. You get the 100% premium full-screen interface without any browser borders!
                </p>
              </div>
            ) : (
              <div className="space-y-4 mb-6">
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Install Barsha instantly on your Home Screen. It launches immediately, responds in real-time, and behaves exactly like a native app.
                </p>
                
                {deferredPrompt ? (
                  <button
                    onClick={handleInstallClick}
                    className="w-full flex items-center justify-center gap-2.5 py-3.5 px-4 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-sm shadow-md cursor-pointer transition-all active:scale-97"
                  >
                    <Download className="w-4.5 h-4.5" />
                    Install Now
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      alert(`To install Barsha:\n\n• On iOS: Tap Share 📤 then choose 'Add to Home Screen' ➕\n• On Android/Chrome: Tap the three dots (Menu) then choose 'Install app' or 'Add to Home screen'`);
                    }}
                    className="w-full flex items-center justify-center gap-2.5 py-3.5 px-4 rounded-2xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-bold text-sm cursor-pointer transition-all active:scale-97"
                  >
                    <Smartphone className="w-4.5 h-4.5 text-purple-500" />
                    How to Download
                  </button>
                )}
              </div>
            )}

            {/* Android APK Download Option (Capacitor) */}
            {!isStandalone && (
              <div className="space-y-4 mb-6">
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                  Looking for the official Android package? You can download the compiled APK file (built via Capacitor) to side-load the full native experience before it hits the Play Store. Live Updates (OTA) are fully supported.
                </p>
                <a
                  href="/Barsha_App_Release.apk"
                  download
                  className="w-full flex items-center justify-center gap-2.5 py-3.5 px-4 rounded-2xl bg-slate-800 hover:bg-slate-900 dark:bg-slate-700 dark:hover:bg-slate-600 text-white font-bold text-sm shadow-md transition-all active:scale-97 text-center"
                >
                  <Download className="w-4.5 h-4.5" />
                  Download Android APK
                </a>
              </div>
            )}

            {/* Shared URL Copy Field */}
            <div className="space-y-2 border-t border-slate-100 dark:border-slate-700/50 pt-5">
              <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider pl-1">
                Your Direct Webpage URL
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  readOnly
                  value={sharedUrl}
                  className="flex-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-400 py-2 px-3 rounded-xl focus:outline-none truncate font-mono"
                />
                <button
                  onClick={handleCopyLink}
                  className={`px-4 py-2 text-xs font-bold rounded-xl cursor-pointer transition-all active:scale-95 flex items-center justify-center ${
                    copied 
                      ? 'bg-emerald-500 text-white' 
                      : 'bg-purple-100 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200/40 dark:border-purple-800/30'
                  }`}
                >
                  {copied ? <Check className="w-4 h-4" /> : 'Copy'}
                </button>
              </div>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 pl-1">
                Share this link with your friends so they can download and use Barsha too!
              </p>
            </div>
          </div>

          {/* Secure App updates card */}
          <div className="bg-slate-50 dark:bg-slate-900/40 rounded-3xl p-6 border border-slate-200/50 dark:border-slate-800/80 shadow-3xs space-y-4">
            <h4 className="text-sm font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <Shield className="w-4.5 h-4.5 text-purple-500" />
              Instant Cloud Updates
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Whenever you open Barsha on your home screen, it automatically checks the cloud for new updates. If an update is found, it will apply it quietly in the background. You can also force a manual search.
            </p>
            <button
              onClick={handleCheckUpdates}
              disabled={updateChecking}
              className={`w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                updateStatus === 'updated'
                  ? 'bg-emerald-500 border-transparent text-white'
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700'
              }`}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${updateChecking ? 'animate-spin' : ''}`} />
              {updateStatus === 'checking' && 'Checking Server...'}
              {updateStatus === 'updated' && 'System Fully Updated!'}
              {updateStatus === 'current' && 'Force Check Updates'}
            </button>
            <button
              onClick={handleHardUpdate}
              disabled={updateChecking}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold transition-all border border-purple-500/15 bg-purple-50/50 hover:bg-purple-100/60 dark:bg-purple-950/25 dark:hover:bg-purple-900/35 text-purple-700 dark:text-purple-300 cursor-pointer"
            >
              <Shield className="w-3.5 h-3.5" />
              Force Refresh App (Clear Cache)
            </button>
          </div>
        </div>

        {/* Right column: Interactive Install Guides */}
        <div className="md:col-span-7 bg-white dark:bg-slate-800/90 rounded-3xl p-6 md:p-8 border border-slate-200/60 dark:border-slate-700/80 shadow-md space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700/50 pb-4">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <Smartphone className="w-5 h-5 text-purple-500" />
              Easy Step-by-Step Guides
            </h3>
            
            {/* Platform Selector Pill */}
            <div className="flex bg-slate-100 dark:bg-slate-700 p-0.5 rounded-xl text-[10px] font-bold">
              <button
                onClick={() => setActivePlatform('android')}
                className={`px-3 py-1.5 rounded-lg cursor-pointer transition-all ${
                  activePlatform === 'android' ? 'bg-white dark:bg-slate-600 text-purple-600 dark:text-purple-300 shadow-3xs' : 'text-slate-500'
                }`}
              >
                Android
              </button>
              <button
                onClick={() => setActivePlatform('ios')}
                className={`px-3 py-1.5 rounded-lg cursor-pointer transition-all ${
                  activePlatform === 'ios' ? 'bg-white dark:bg-slate-600 text-purple-600 dark:text-purple-300 shadow-3xs' : 'text-slate-500'
                }`}
              >
                iOS / iPhone
              </button>
            </div>
          </div>

          {activePlatform === 'android' ? (
            <div className="space-y-6">
              <div className="flex gap-4 items-start">
                <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400 font-bold text-xs flex items-center justify-center flex-shrink-0">1</div>
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-slate-800 dark:text-white">Open the Link</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    Open your web browser (Chrome, Samsung Internet, or Firefox) and visit your shared webpage URL: <strong className="font-mono text-[11px] text-purple-600 dark:text-purple-400">{sharedUrl}</strong>.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400 font-bold text-xs flex items-center justify-center flex-shrink-0">2</div>
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-slate-800 dark:text-white">Tap the Install Button</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    Look for a prompt at the bottom of your screen that says <span className="font-semibold text-slate-700 dark:text-slate-300">"Add Barsha to Home Screen"</span>, or click the <span className="font-semibold text-slate-700 dark:text-slate-300">"Install Now"</span> button in the direct download card above.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400 font-bold text-xs flex items-center justify-center flex-shrink-0">3</div>
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-slate-800 dark:text-white">Verify from Menu (Optional)</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    If you don't see the popup, simply tap the browser menu (three dots icon in the top-right corner) and select <span className="font-semibold text-slate-700 dark:text-slate-300">"Install app"</span> or <span className="font-semibold text-slate-700 dark:text-slate-300">"Add to Home screen"</span>.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start pt-2 border-t border-slate-100 dark:border-slate-700/50">
                <Zap className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  <strong>That's it!</strong> An icon named <strong>Barsha</strong> with your elegant purple sparkle logo will appear on your normal mobile screen. Clicking it opens the app instantly in full-screen standalone mode.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex gap-4 items-start">
                <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400 font-bold text-xs flex items-center justify-center flex-shrink-0">1</div>
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-slate-800 dark:text-white">Open in Safari Browser</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    Make sure you open your unique webpage URL inside the default Apple <strong className="font-semibold text-slate-700 dark:text-slate-300">Safari</strong> browser on your iPhone or iPad. Other third-party browsers like Chrome on iOS do not support desktop home-screen triggers yet.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400 font-bold text-xs flex items-center justify-center flex-shrink-0">2</div>
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-slate-800 dark:text-white">Tap the Share Button</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    Look at the bottom of your Safari browser and tap the <strong className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1 inline-flex">Share Icon <Share className="w-3.5 h-3.5 text-purple-500" /></strong> (the box with an upward-pointing arrow).
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400 font-bold text-xs flex items-center justify-center flex-shrink-0">3</div>
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-slate-800 dark:text-white">Choose 'Add to Home Screen'</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    Scroll down the share options menu and tap <strong className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1 inline-flex">Add to Home Screen <ArrowUpToLine className="w-3.5 h-3.5 text-purple-500" /></strong>. Then click "Add" in the top-right corner.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start pt-2 border-t border-slate-100 dark:border-slate-700/50">
                <Zap className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  <strong>Done!</strong> The app logo is successfully added to your screen. When you tap it, it launches without standard Safari navigation bars, giving you a beautiful 100% fullscreen mobile experience.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Back to Workspace button */}
      <div className="flex justify-center mt-10">
        <button
          onClick={onBack}
          className="flex items-center gap-2 py-3 px-8 rounded-2xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 font-bold text-sm shadow-md cursor-pointer transition-all active:scale-97"
        >
          Open Barsha Study Workspace
        </button>
      </div>
    </div>
  );
};
