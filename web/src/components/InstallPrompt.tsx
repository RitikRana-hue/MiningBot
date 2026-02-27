'use client';

import { useEffect, useState } from 'react';
import { Download, X } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function InstallPrompt() {
    const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
    const [showPrompt, setShowPrompt] = useState(false);
    const [isInstalled, setIsInstalled] = useState(false);

    useEffect(() => {
        // Check if already installed
        if (window.matchMedia('(display-mode: standalone)').matches) {
            setIsInstalled(true);
            return;
        }

        const handler = (e: Event) => {
            e.preventDefault();
            setDeferredPrompt(e as BeforeInstallPromptEvent);

            // Show prompt after 30 seconds or on user interaction
            setTimeout(() => setShowPrompt(true), 30000);
        };

        window.addEventListener('beforeinstallprompt', handler);

        return () => window.removeEventListener('beforeinstallprompt', handler);
    }, []);

    const handleInstall = async () => {
        if (!deferredPrompt) return;

        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;

        if (outcome === 'accepted') {
            setDeferredPrompt(null);
            setShowPrompt(false);
        }
    };

    const handleDismiss = () => {
        setShowPrompt(false);
        // Show again after 24 hours
        localStorage.setItem('installPromptDismissed', Date.now().toString());
    };

    if (isInstalled || !showPrompt || !deferredPrompt) return null;

    return (
        <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-sm z-50 animate-slide-up">
            <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg shadow-2xl p-4 text-white">
                <button
                    onClick={handleDismiss}
                    className="absolute top-2 right-2 p-1 hover:bg-white/20 rounded-full transition-colors"
                    aria-label="Dismiss"
                >
                    <X size={16} />
                </button>

                <div className="flex items-start gap-3 pr-6">
                    <div className="bg-white/20 p-2 rounded-lg">
                        <Download size={24} />
                    </div>

                    <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-1">Install Mining Bot</h3>
                        <p className="text-sm text-white/90 mb-3">
                            Install our app for quick access and offline support
                        </p>

                        <button
                            onClick={handleInstall}
                            className="bg-white text-emerald-600 px-4 py-2 rounded-lg font-medium hover:bg-white/90 transition-colors w-full"
                        >
                            Install Now
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
