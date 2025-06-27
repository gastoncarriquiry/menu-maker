import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private darkThemeSubject = new BehaviorSubject<boolean>(false);
  public darkTheme$ = this.darkThemeSubject.asObservable();

  constructor(@Inject(DOCUMENT) private document: Document) {
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
    this.setDarkTheme(!this.darkThemeSubject.value);
  }

  public setDarkTheme(isDark: boolean): void {
    this.darkThemeSubject.next(isDark);

    // Toggle the CSS class on body element (Angular Material v20 approach)
    if (isDark) {
      this.document.body.classList.add('dark-mode');
    } else {
      this.document.body.classList.remove('dark-mode');
    }

    // Save preference
    localStorage.setItem('darkTheme', JSON.stringify(isDark));
  }

  public isDarkTheme(): boolean {
    return this.darkThemeSubject.value;
  }
}
