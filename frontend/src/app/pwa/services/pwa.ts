import { Injectable } from '@angular/core';
import { SwUpdate, VersionReadyEvent } from '@angular/service-worker';
import { BehaviorSubject, filter, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PwaService {
  private readonly _isOnline = new BehaviorSubject<boolean>(true);
  private readonly _updateAvailable = new BehaviorSubject<boolean>(false);

  public readonly isOnline$ = this._isOnline.asObservable();
  public readonly updateAvailable$ = this._updateAvailable.asObservable();

  constructor(private readonly swUpdate: SwUpdate) {
    this.initializeNetworkListener();
    this.initializeUpdateListener();
  }

  private initializeNetworkListener(): void {
    // Set initial online status
    this._isOnline.next(navigator.onLine);

    // Listen for online/offline events
    window.addEventListener('online', () => {
      this._isOnline.next(true);
    });

    window.addEventListener('offline', () => {
      this._isOnline.next(false);
    });
  }

  private initializeUpdateListener(): void {
    if (this.swUpdate.isEnabled) {
      // Check for updates immediately
      this.swUpdate.checkForUpdate();

      // Listen for available updates
      this.swUpdate.versionUpdates
        .pipe(
          filter((evt): evt is VersionReadyEvent => evt.type === 'VERSION_READY'),
          map(() => true)
        )
        .subscribe((updateAvailable) => {
          this._updateAvailable.next(updateAvailable);
        });

      // Check for updates every 6 hours
      setInterval(() => {
        this.swUpdate.checkForUpdate();
      }, 6 * 60 * 60 * 1000);
    }
  }

  public activateUpdate(): void {
    if (this.swUpdate.isEnabled) {
      this.swUpdate.activateUpdate().then(() => {
        window.location.reload();
      });
    }
  }

  public get isOnline(): boolean {
    return this._isOnline.value;
  }

  public get updateAvailable(): boolean {
    return this._updateAvailable.value;
  }
}
