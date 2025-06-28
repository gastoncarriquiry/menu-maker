import { Injectable, signal, WritableSignal } from '@angular/core';
import { SwUpdate, VersionReadyEvent } from '@angular/service-worker';
import { filter, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PwaService {
  private readonly _isOnline: WritableSignal<boolean> = signal(true);
  private readonly _updateAvailable: WritableSignal<boolean> = signal(false);

  public readonly isOnline = this._isOnline.asReadonly();
  public readonly updateAvailable = this._updateAvailable.asReadonly();

  constructor(private readonly swUpdate: SwUpdate) {
    this.initializeNetworkListener();
    this.initializeUpdateListener();
  }

  private initializeNetworkListener(): void {
    // Set initial online status
    this._isOnline.set(navigator.onLine);

    // Listen for online/offline events
    window.addEventListener('online', () => {
      this._isOnline.set(true);
    });

    window.addEventListener('offline', () => {
      this._isOnline.set(false);
    });
  }

  private initializeUpdateListener(): void {
    if (this.swUpdate.isEnabled) {
      // Check for updates immediately
      this.swUpdate.checkForUpdate();

      // Listen for available updates
      this.swUpdate.versionUpdates
        .pipe(
          filter(
            (evt): evt is VersionReadyEvent => evt.type === 'VERSION_READY',
          ),
          map(() => true),
        )
        .subscribe((updateAvailable) => {
          this._updateAvailable.set(updateAvailable);
        });

      // Check for updates every 6 hours
      setInterval(
        () => {
          this.swUpdate.checkForUpdate();
        },
        6 * 60 * 60 * 1000,
      );
    }
  }

  public activateUpdate(): void {
    if (this.swUpdate.isEnabled) {
      this.swUpdate.activateUpdate().then(() => {
        window.location.reload();
      });
    }
  }
}
