import { Injectable, signal, WritableSignal } from '@angular/core';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

@Injectable({
  providedIn: 'root',
})
export class InstallPromptService {
  private readonly _installPromptEvent: WritableSignal<BeforeInstallPromptEvent | null> =
    signal(null);
  private readonly _isInstallable: WritableSignal<boolean> = signal(false);
  private readonly _isInstalled: WritableSignal<boolean> = signal(false);

  public readonly installPromptEvent = this._installPromptEvent.asReadonly();
  public readonly isInstallable = this._isInstallable.asReadonly();
  public readonly isInstalled = this._isInstalled.asReadonly();

  constructor() {
    this.initializeInstallPrompt();
    this.checkIfInstalled();
  }

  private initializeInstallPrompt(): void {
    window.addEventListener('beforeinstallprompt', (event: Event) => {
      // Prevent the mini-infobar from appearing on mobile
      event.preventDefault();

      const beforeInstallPromptEvent = event as BeforeInstallPromptEvent;
      this._installPromptEvent.set(beforeInstallPromptEvent);
      this._isInstallable.set(true);
    });

    window.addEventListener('appinstalled', () => {
      this._isInstalled.set(true);
      this._isInstallable.set(false);
      this._installPromptEvent.set(null);
    });
  }

  private checkIfInstalled(): void {
    // Check if app is running in standalone mode
    const isStandalone = window.matchMedia(
      '(display-mode: standalone)',
    ).matches;

    // Check if app is installed via navigator (iOS Safari)
    const isInstalledViaNavigator =
      (window.navigator as unknown as { standalone?: boolean }).standalone ===
      true;

    // Check if PWA is installed
    const isPWAInstalled = isStandalone || isInstalledViaNavigator;

    this._isInstalled.set(isPWAInstalled);
  }

  public async showInstallPrompt(): Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  } | null> {
    const promptEvent = this._installPromptEvent();

    if (!promptEvent) {
      return null;
    }

    try {
      // Show the install prompt
      await promptEvent.prompt();

      // Wait for the user to respond to the prompt
      const choiceResult = await promptEvent.userChoice;

      if (choiceResult.outcome === 'accepted') {
        // User accepted the install prompt
        this._isInstallable.set(false);
        this._installPromptEvent.set(null);
      }

      return choiceResult;
    } catch (error) {
      console.error('Error showing install prompt:', error);
      return null;
    }
  }

  public canShowInstallPrompt(): boolean {
    return (
      this.isInstallable() &&
      !this.isInstalled &&
      this._installPromptEvent() !== null
    );
  }

  public getInstallPlatforms(): string[] {
    const promptEvent = this._installPromptEvent();
    return promptEvent?.platforms || [];
  }
}
