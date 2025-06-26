import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { PwaService } from '../../services/pwa';

@Component({
  selector: 'app-update-notification',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatSnackBarModule],
  template: `
    <div
      class="update-notification"
      [class.visible]="pwaService.updateAvailable$ | async"
      role="alert"
      aria-live="polite"
    >
      <div class="update-content">
        <mat-icon class="update-icon">system_update</mat-icon>
        <div class="update-text">
          <h4>Update Available</h4>
          <p>A new version of Menu Maker is available!</p>
        </div>
        <div class="update-actions">
          <button mat-button (click)="dismissUpdate()" class="dismiss-btn">
            Later
          </button>
          <button
            mat-raised-button
            color="primary"
            (click)="applyUpdate()"
            class="update-btn"
          >
            <mat-icon>refresh</mat-icon>
            Update Now
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .update-notification {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        background: linear-gradient(135deg, #667eea, #764ba2);
        color: white;
        padding: 16px;
        z-index: 1000;
        transform: translateY(100%);
        transition: transform 0.3s ease-in-out;
        box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.15);
      }

      .update-notification.visible {
        transform: translateY(0);
      }

      .update-content {
        display: flex;
        align-items: center;
        gap: 16px;
        max-width: 1200px;
        margin: 0 auto;
      }

      .update-icon {
        font-size: 32px;
        width: 32px;
        height: 32px;
        color: #ffd700;
      }

      .update-text {
        flex: 1;
      }

      .update-text h4 {
        margin: 0 0 4px 0;
        font-size: 16px;
        font-weight: 600;
      }

      .update-text p {
        margin: 0;
        font-size: 14px;
        opacity: 0.9;
      }

      .update-actions {
        display: flex;
        gap: 12px;
        align-items: center;
      }

      .dismiss-btn {
        color: rgba(255, 255, 255, 0.7) !important;
      }

      .dismiss-btn:hover {
        color: white !important;
        background: rgba(255, 255, 255, 0.1) !important;
      }

      .update-btn {
        background: rgba(255, 255, 255, 0.2) !important;
        color: white !important;
        border: 1px solid rgba(255, 255, 255, 0.3) !important;
      }

      .update-btn:hover {
        background: rgba(255, 255, 255, 0.3) !important;
      }

      .update-btn mat-icon {
        margin-right: 8px;
      }

      @media (max-width: 768px) {
        .update-content {
          flex-direction: column;
          text-align: center;
          gap: 12px;
        }

        .update-actions {
          width: 100%;
          justify-content: center;
        }

        .update-text h4 {
          font-size: 15px;
        }

        .update-text p {
          font-size: 13px;
        }
      }

      @media (max-width: 480px) {
        .update-actions {
          flex-direction: column;
          width: 100%;
        }

        .update-actions button {
          width: 100%;
        }
      }
    `,
  ],
})
export class UpdateNotificationComponent {
  public readonly pwaService = inject(PwaService);
  private readonly snackBar = inject(MatSnackBar);

  public applyUpdate(): void {
    this.snackBar.open('Updating application...', '', {
      duration: 2000,
    });

    setTimeout(() => {
      this.pwaService.activateUpdate();
    }, 1000);
  }

  public dismissUpdate(): void {
    // Hide the notification temporarily (it will show again after some time)
    this.snackBar.open('Update reminder dismissed', 'Close', {
      duration: 3000,
    });
  }
}
