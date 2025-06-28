import { DOCUMENT } from '@angular/common';
import { inject, Injectable, signal, WritableSignal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly document = inject(DOCUMENT);
  private readonly _isDarkTheme: WritableSignal<boolean> = signal(false);
  public isDarkTheme = this._isDarkTheme.asReadonly();

  constructor() {
    // Initialize theme based on system preference or localStorage
    this.initializeTheme();
  }

  private initializeTheme(): void {
    const savedTheme = localStorage.getItem('darkTheme');
    if (savedTheme !== null) {
      // Use saved preference
      this.setDarkTheme(JSON.parse(savedTheme));
    } else {
      // Use system preference
      const prefersDark = window.matchMedia(
        '(prefers-color-scheme: dark)',
      ).matches;
      this.setDarkTheme(prefersDark);
    }
  }

  public toggleTheme(): void {
    this.setDarkTheme(!this._isDarkTheme());
  }

  public setDarkTheme(isDark: boolean): void {
    this._isDarkTheme.set(isDark);

    // Toggle the CSS class on body element (Angular Material v20 approach)
    if (isDark) {
      this.document.body.classList.add('dark-mode');
    } else {
      this.document.body.classList.remove('dark-mode');
    }

    // Save preference
    localStorage.setItem('darkTheme', JSON.stringify(isDark));
  }
}
