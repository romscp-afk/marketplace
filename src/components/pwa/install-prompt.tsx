"use client";

import { useEffect, useState, useCallback } from "react";
import { X, Download, Share } from "lucide-react";
import { Button } from "@/components/ui/button";
import { analytics } from "@/lib/analytics";

const DISMISS_KEY = "pwa_install_dismissed";
const ENGAGEMENT_KEY = "pwa_engagement_count";
const ENGAGEMENT_THRESHOLD = 3;

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

function getInitialPwaState() {
  if (typeof window === "undefined") {
    return { isInstalled: false, showPrompt: false, isIOS: false };
  }

  const dismissed = localStorage.getItem(DISMISS_KEY);
  const installed =
    window.matchMedia("(display-mode: standalone)").matches ||
    ("standalone" in navigator && (navigator as { standalone?: boolean }).standalone);
  const isIOSDevice =
    /iPad|iPhone|iPod/.test(navigator.userAgent) && !("MSStream" in window);
  const engagement = parseInt(localStorage.getItem(ENGAGEMENT_KEY) ?? "0", 10);

  return {
    isInstalled: Boolean(installed),
    showPrompt: !dismissed && !installed && engagement >= ENGAGEMENT_THRESHOLD,
    isIOS: isIOSDevice,
  };
}

export function PwaInstallPrompt() {
  const [initial] = useState(getInitialPwaState);
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(initial.showPrompt);
  const [isInstalled, setIsInstalled] = useState(initial.isInstalled);
  const [isIOS] = useState(initial.isIOS);

  useEffect(() => {
    if (showPrompt) {
      analytics.pwaInstallOffered();
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, [showPrompt]);

  const handleInstall = useCallback(async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        analytics.pwaInstallAccepted();
        setIsInstalled(true);
      } else {
        analytics.pwaInstallDismissed();
      }
      setDeferredPrompt(null);
      setShowPrompt(false);
    }
  }, [deferredPrompt]);

  const handleDismiss = useCallback(() => {
    localStorage.setItem(DISMISS_KEY, "true");
    analytics.pwaInstallDismissed();
    setShowPrompt(false);
  }, []);

  if (isInstalled || !showPrompt) return null;

  return (
    <div
      className="bg-surface fixed right-4 bottom-20 left-4 z-50 rounded-xl border border-border p-4 shadow-lg md:bottom-6 md:left-auto md:max-w-sm"
      role="dialog"
      aria-label="Install app"
    >
      <div className="flex items-start gap-3">
        <div className="bg-primary/10 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg">
          <Download className="text-primary h-5 w-5" aria-hidden="true" />
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-semibold">Install our app</h3>
          <p className="text-muted mt-1 text-xs">
            {isIOS
              ? "Tap Share, then Add to Home Screen for quick access."
              : "Add to your home screen for a faster shopping experience."}
          </p>
          <div className="mt-3 flex gap-2">
            {!isIOS && deferredPrompt ? (
              <Button size="sm" onClick={handleInstall}>
                Install
              </Button>
            ) : isIOS ? (
              <div className="text-muted flex items-center gap-1 text-xs">
                <Share className="h-3.5 w-3.5" aria-hidden="true" />
                Share → Add to Home Screen
              </div>
            ) : null}
            <Button size="sm" variant="ghost" onClick={handleDismiss}>
              Not now
            </Button>
          </div>
        </div>
        <button
          type="button"
          onClick={handleDismiss}
          className="text-muted hover:text-foreground shrink-0"
          aria-label="Dismiss"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

export function trackPwaEngagement() {
  const count = parseInt(localStorage.getItem(ENGAGEMENT_KEY) ?? "0", 10);
  localStorage.setItem(ENGAGEMENT_KEY, String(count + 1));
}
