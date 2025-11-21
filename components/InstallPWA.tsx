import React, { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

/**
 * InstallPWA Component
 * Displays a banner to prompt users to install the app on their device
 * Only shows on supported browsers and devices
 */
export const InstallPWA: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    // Check if user dismissed the banner previously
    const dismissed = localStorage.getItem('pwa-install-dismissed');
    if (dismissed) {
      const dismissedDate = new Date(dismissed);
      const now = new Date();
      const daysDiff = Math.floor((now.getTime() - dismissedDate.getTime()) / (1000 * 60 * 60 * 24));

      // Show again after 7 days
      if (daysDiff < 7) {
        return;
      }
    }

    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowBanner(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Listen for app installed event
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowBanner(false);
      setDeferredPrompt(null);
      console.log('[PWA] App installed successfully');
    };

    window.addEventListener('appinstalled', handleAppInstalled);

    // Cleanup
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    // Show the install prompt
    await deferredPrompt.prompt();

    // Wait for user response
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      console.log('[PWA] User accepted the install prompt');
    } else {
      console.log('[PWA] User dismissed the install prompt');
    }

    // Clear the deferred prompt
    setDeferredPrompt(null);
    setShowBanner(false);
  };

  const handleDismiss = () => {
    setShowBanner(false);
    localStorage.setItem('pwa-install-dismissed', new Date().toISOString());
  };

  // Don't render if already installed or no prompt available
  if (isInstalled || !showBanner) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 animate-in slide-in-from-bottom-4 duration-300">
      <div className="max-w-lg mx-auto bg-chef-black text-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="p-4 flex items-center gap-4">
          {/* App Icon */}
          <div className="flex-shrink-0 w-14 h-14 bg-chef-orange rounded-xl flex items-center justify-center">
            <span className="text-2xl">🍴</span>
          </div>

          {/* Text Content */}
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-white text-sm">Installer Chef★</h3>
            <p className="text-stone-400 text-xs mt-0.5">
              Accédez rapidement à vos commandes depuis votre écran d'accueil
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={handleDismiss}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              aria-label="Fermer"
            >
              <X className="w-5 h-5 text-stone-400" />
            </button>
            <button
              onClick={handleInstallClick}
              className="flex items-center gap-2 px-4 py-2 bg-chef-orange hover:bg-orange-600 text-white rounded-xl font-medium text-sm transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Installer</span>
            </button>
          </div>
        </div>

        {/* Progress bar decoration */}
        <div className="h-1 bg-gradient-to-r from-chef-orange via-chef-gold to-chef-orange" />
      </div>
    </div>
  );
};

export default InstallPWA;
