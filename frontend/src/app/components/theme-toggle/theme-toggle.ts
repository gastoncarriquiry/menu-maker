import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ThemeService } from '../../services/theme';

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatTooltipModule],
  template: `
    <button
      mat-icon-button
      (click)="toggleTheme()"
      [matTooltip]="
        themeService.isDarkTheme()
          ? 'Cambiar a modo claro'
          : 'Cambiar a modo oscuro'
      "
      class="theme-toggle-button"
    >
      <mat-icon>
        {{ themeService.isDarkTheme() ? 'light_mode' : 'dark_mode' }}
      </mat-icon>
    </button>
  `,
  styles: [
    `
      .theme-toggle-button {
        color: var(--mat-sys-on-surface);
        background-color: var(--mat-sys-surface-variant);
        transition: all 0.2s ease;
        position: fixed;
        bottom: 16px;
        left: 16px;
        z-index: 1000;
      }

      .theme-toggle-button:hover {
        background-color: var(--mat-sys-primary-container);
        color: var(--mat-sys-on-primary-container);
      }
    `,
  ],
})
export class ThemeToggleComponent {
  constructor(public themeService: ThemeService) {}

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }
}
