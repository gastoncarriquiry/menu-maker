import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

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
  private readonly _installPromptEvent =
    new BehaviorSubject<BeforeInstallPromptEvent | null>(null);
  private readonly _isInstallable = new BehaviorSubject<boolean>(false);
  private readonly _isInstalled = new BehaviorSubject<boolean>(false);

  public readonly installPromptEvent$ = this._installPromptEvent.asObservable();
  public readonly isInstallable$ = this._isInstallable.asObservable();
  public readonly isInstalled$ = this._isInstalled.asObservable();

  constructor() {
    this.initializeInstallPrompt();
    this.checkIfInstalled();
  }

  private initializeInstallPrompt(): void {
    window.addEventListener('beforeinstallprompt', (event: Event) => {
      // Prevent the mini-infobar from appearing on mobile
      event.preventDefault();

      const beforeInstallPromptEvent = event as BeforeInstallPromptEvent;
      this._installPromptEvent.next(beforeInstallPromptEvent);
      this._isInstallable.next(true);
    });

    window.addEventListener('appinstalled', () => {
      this._isInstalled.next(true);
      this._isInstallable.next(false);
      this._installPromptEvent.next(null);
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

    this._isInstalled.next(isPWAInstalled);
  }

  public async showInstallPrompt(): Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  } | null> {
    const promptEvent = this._installPromptEvent.value;

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
        this._isInstallable.next(false);
        this._installPromptEvent.next(null);
      }

      return choiceResult;
    } catch (error) {
      console.error('Error showing install prompt:', error);
      return null;
    }
  }

  public get isInstallable(): boolean {
    return this._isInstallable.value;
  }

  public get isInstalled(): boolean {
    return this._isInstalled.value;
  }

  public canShowInstallPrompt(): boolean {
    return (
      this.isInstallable &&
      !this.isInstalled &&
      this._installPromptEvent.value !== null
    );
  }

  public getInstallPlatforms(): string[] {
    const promptEvent = this._installPromptEvent.value;
    return promptEvent?.platforms || [];
  }
}
