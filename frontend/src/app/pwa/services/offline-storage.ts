import { Injectable, signal, WritableSignal } from '@angular/core';

export interface MenuItem {
  id: string;
  name: string;
  description?: string;
  ingredients?: string[];
  cookingTime?: number;
  difficulty?: string;
}

export interface UserPreferences {
  dietaryRestrictions: string[];
  cuisinePreferences: string[];
  cookingSkillLevel: string;
  mealTypes: string[];
}

export interface OfflineData {
  menus: MenuItem[];
  preferences: UserPreferences | null;
  lastSync: number;
}

@Injectable({
  providedIn: 'root',
})
export class OfflineStorageService {
  private readonly STORAGE_KEY = 'menu-maker-offline-data';
  private readonly MAX_STORAGE_AGE = 24 * 60 * 60 * 1000; // 24 hours

  private readonly _offlineData: WritableSignal<OfflineData | null> =
    signal(null);
  public readonly offlineData = this._offlineData.asReadonly();

  constructor() {
    this.loadOfflineData();
  }

  private loadOfflineData(): void {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const data = JSON.parse(stored) as OfflineData;

        // Check if data is not too old
        if (Date.now() - data.lastSync < this.MAX_STORAGE_AGE) {
          this._offlineData.set(data);
        } else {
          this.clearOfflineData();
        }
      }
    } catch (error) {
      console.warn('Failed to load offline data:', error);
      this.clearOfflineData();
    }
  }

  public saveOfflineData(data: Partial<OfflineData>): void {
    try {
      const currentData = this._offlineData() || {
        menus: [],
        preferences: null,
        lastSync: 0,
      };

      const updatedData: OfflineData = {
        ...currentData,
        ...data,
        lastSync: Date.now(),
      };

      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updatedData));
      this._offlineData.set(updatedData);
    } catch (error) {
      console.error('Failed to save offline data:', error);
      // Handle storage quota exceeded
      if (
        error instanceof DOMException &&
        error.name === 'QuotaExceededError'
      ) {
        this.clearOldData();
        // Try again after clearing old data
        try {
          localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
        } catch (retryError) {
          console.error(
            'Failed to save offline data after cleanup:',
            retryError,
          );
        }
      }
    }
  }

  public getOfflineMenus(): MenuItem[] {
    const data = this._offlineData();
    return data?.menus ?? [];
  }

  public getOfflinePreferences(): UserPreferences | null {
    const data = this._offlineData();
    return data?.preferences ?? null;
  }

  public saveOfflineMenus(menus: MenuItem[]): void {
    this.saveOfflineData({ menus });
  }

  public saveOfflinePreferences(preferences: UserPreferences): void {
    this.saveOfflineData({ preferences });
  }

  public clearOfflineData(): void {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
      this._offlineData.set(null);
    } catch (error) {
      console.error('Failed to clear offline data:', error);
    }
  }

  private clearOldData(): void {
    // Clear old cached data to free up space
    const keysToRemove: string[] = [];

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith('menu-maker-cache-')) {
        keysToRemove.push(key);
      }
    }

    keysToRemove.forEach((key) => {
      try {
        localStorage.removeItem(key);
      } catch (error) {
        console.warn('Failed to remove old cache key:', key, error);
      }
    });
  }

  public getStorageInfo(): {
    used: number;
    available: number;
    percentage: number;
  } {
    let used = 0;
    let available = 5 * 1024 * 1024; // Default 5MB quota

    try {
      // Calculate used storage
      for (const key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
          used += localStorage[key].length + key.length;
        }
      }

      // Try to estimate available storage (this is approximate)
      if ('storage' in navigator && 'estimate' in navigator.storage) {
        navigator.storage.estimate().then((estimate) => {
          available = estimate.quota ?? available;
        });
      }
    } catch (error) {
      console.warn('Failed to calculate storage info:', error);
    }

    return {
      used,
      available,
      percentage: (used / available) * 100,
    };
  }

  public isDataStale(): boolean {
    const data = this._offlineData();
    if (!data) return true;

    return Date.now() - data.lastSync > this.MAX_STORAGE_AGE / 2; // Consider stale after 12 hours
  }
}
