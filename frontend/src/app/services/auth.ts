import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface User {
  id: string;
  email: string;
  firstName: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse {
  user: User;
  tokens: AuthTokens;
  message?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly API_URL = environment.apiUrl || 'http://localhost:3000/api';
  private readonly ACCESS_TOKEN_KEY = 'menu_maker_access_token';
  private readonly REFRESH_TOKEN_KEY = 'menu_maker_refresh_token';
  private readonly USER_KEY = 'menu_maker_user';

  private readonly currentUserSubject = new BehaviorSubject<User | null>(
    this.getUserFromStorage(),
  );
  public currentUser$ = this.currentUserSubject.asObservable();

  private readonly isAuthenticatedSubject = new BehaviorSubject<boolean>(
    this.hasValidToken(),
  );
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  private readonly http = inject(HttpClient);

  constructor() {
    // Check if tokens are valid on service initialization
    this.checkTokenValidity();
  }

  /**
   * Register a new user
   */
  register(userData: RegisterRequest): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.API_URL}/auth/register`, userData)
      .pipe(
        tap((response) => this.handleAuthSuccess(response)),
        catchError(this.handleError),
      );
  }

  /**
   * Login user
   */
  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.API_URL}/auth/login`, credentials)
      .pipe(
        tap((response) => this.handleAuthSuccess(response)),
        catchError(this.handleError),
      );
  }

  /**
   * Logout user
   */
  logout(): Observable<{ message?: string }> {
    const accessToken = this.getAccessToken();

    // Call backend logout endpoint if we have a token
    const logoutRequest = accessToken
      ? this.http.post<{ message: string }>(`${this.API_URL}/auth/logout`, {})
      : new Observable<{ message: string }>((observer) => {
          observer.next({ message: 'Logged out locally' });
          observer.complete();
        });

    return logoutRequest.pipe(
      tap(() => this.handleLogout()),
      catchError(() => {
        // Even if the logout request fails, clear local storage
        this.handleLogout();
        return new Observable<{ message: string }>((observer) => {
          observer.next({ message: 'Logged out locally after error' });
          observer.complete();
        });
      }),
    );
  }

  /**
   * Refresh access token
   */
  refreshToken(): Observable<AuthTokens> {
    const refreshToken = this.getRefreshToken();

    if (!refreshToken) {
      this.handleLogout();
      return throwError(() => new Error('No refresh token available'));
    }

    return this.http
      .post<{ tokens: AuthTokens }>(`${this.API_URL}/auth/refresh`, {
        refreshToken,
      })
      .pipe(
        map((response) => response.tokens),
        tap((tokens) => this.storeTokens(tokens)),
        catchError((error) => {
          this.handleLogout();
          return this.handleError(error);
        }),
      );
  }

  /**
   * Get current user profile
   */
  getProfile(): Observable<{ user: User }> {
    return this.http.get<{ user: User }>(`${this.API_URL}/auth/profile`).pipe(
      tap((response) => {
        this.storeUser(response.user);
        this.currentUserSubject.next(response.user);
      }),
      catchError(this.handleError),
    );
  }

  /**
   * Get access token
   */
  getAccessToken(): string | null {
    return localStorage.getItem(this.ACCESS_TOKEN_KEY);
  }

  /**
   * Get refresh token
   */
  getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  /**
   * Get current user
   */
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  /**
   * Handle successful authentication
   */
  private handleAuthSuccess(response: AuthResponse): void {
    this.storeTokens(response.tokens);
    this.storeUser(response.user);
    this.currentUserSubject.next(response.user);
    this.isAuthenticatedSubject.next(true);
  }

  /**
   * Handle logout
   */
  private handleLogout(): void {
    localStorage.removeItem(this.ACCESS_TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
  }

  /**
   * Store tokens in localStorage
   */
  private storeTokens(tokens: AuthTokens): void {
    localStorage.setItem(this.ACCESS_TOKEN_KEY, tokens.accessToken);
    localStorage.setItem(this.REFRESH_TOKEN_KEY, tokens.refreshToken);
  }

  /**
   * Store user in localStorage
   */
  private storeUser(user: User): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  /**
   * Get user from localStorage
   */
  private getUserFromStorage(): User | null {
    const userStr = localStorage.getItem(this.USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  }

  /**
   * Check if we have a valid token
   */
  private hasValidToken(): boolean {
    const token = this.getAccessToken();
    if (!token) return false;

    try {
      // Basic JWT token validation (check if it's not expired)
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      return payload.exp > currentTime;
    } catch {
      return false;
    }
  }

  /**
   * Check token validity on service initialization
   */
  private checkTokenValidity(): void {
    if (!this.hasValidToken()) {
      this.handleLogout();
    }
  }

  /**
   * Handle HTTP errors
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred';

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = error.error.message;
    } else {
      // Server-side error
      errorMessage =
        error.error?.error ?? error.error?.message ?? error.message;
    }

    return throwError(() => new Error(errorMessage));
  }
}
