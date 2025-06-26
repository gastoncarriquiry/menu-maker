import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { InstallPromptService } from '../../services/install-prompt';

@Component({
  selector: 'app-install-button',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule],
  template: `
    <button
      mat-raised-button
      color="primary"
      *ngIf="installPromptService.canShowInstallPrompt()"
      (click)="installApp()"
      class="install-button"
    >
      <mat-icon>get_app</mat-icon>
      Install App
    </button>
  `,
  styles: [
    `
      .install-button {
        margin: 8px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2) !important;
        transition: all 0.3s ease !important;
      }

      .install-button:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3) !important;
      }

      .install-button mat-icon {
        margin-right: 8px;
      }
    `,
  ],
})
export class InstallButtonComponent {
  public readonly installPromptService = inject(InstallPromptService);
  private readonly snackBar = inject(MatSnackBar);

  public async installApp(): Promise<void> {
    try {
      const result = await this.installPromptService.showInstallPrompt();

      if (result) {
        if (result.outcome === 'accepted') {
          this.snackBar.open('App installation started!', 'Close', {
            duration: 3000,
            panelClass: ['success-snackbar'],
          });
        } else {
          this.snackBar.open('Installation was cancelled', 'Close', {
            duration: 2000,
          });
        }
      } else {
        this.snackBar.open(
          'Installation is not available on this device',
          'Close',
          {
            duration: 3000,
          },
        );
      }
    } catch (error) {
      console.error('Error during app installation:', error);
      this.snackBar.open('Installation failed. Please try again.', 'Close', {
        duration: 4000,
        panelClass: ['error-snackbar'],
      });
    }
  }
}
