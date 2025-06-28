import { Component, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PwaService } from '../../services/pwa';

@Component({
  selector: 'app-offline-indicator',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="offline-banner"
      [class.visible]="!pwaService.isOnline()"
      role="alert"
      aria-live="polite"
    >
      <div class="offline-content">
        <span class="offline-icon">⚠️</span>
        <span class="offline-text"
          >You're currently offline. Some features may not be available.</span
        >
      </div>
    </div>
  `,
  styles: [
    `
      .offline-banner {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        background: linear-gradient(135deg, #ff6b6b, #ee5a24);
        color: white;
        padding: 12px;
        text-align: center;
        z-index: 1000;
        transform: translateY(-100%);
        transition: transform 0.3s ease-in-out;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
      }

      .offline-banner.visible {
        transform: translateY(0);
      }

      .offline-content {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        font-weight: 500;
      }

      .offline-icon {
        font-size: 18px;
      }

      .offline-text {
        font-size: 14px;
      }

      @media (max-width: 768px) {
        .offline-banner {
          padding: 10px;
        }

        .offline-text {
          font-size: 13px;
        }
      }
    `,
  ],
})
export class OfflineIndicatorComponent {
  public readonly pwaService = inject(PwaService);
  private readonly snackBar = inject(MatSnackBar);

  constructor() {
    // Show snackbar when coming back online using effect on the signal
    effect(() => {
      const isOnline = this.pwaService.isOnline();
      if (isOnline && !this.isFirstLoad()) {
        this.snackBar.open("You're back online!", 'Close', {
          duration: 3000,
          panelClass: ['success-snackbar'],
        });
      }
    });
  }

  private isFirstLoad(): boolean {
    const firstLoad = sessionStorage.getItem('firstLoad');
    if (!firstLoad) {
      sessionStorage.setItem('firstLoad', 'false');
      return true;
    }
    return false;
  }
}
