---
mode: agent
---

# Angular 20 Style Guide Updates

## Key Changes in Angular 20

### 1. File Naming Convention (Services)

- **OLD**: `auth.service.ts`, `user.service.ts`, `data.service.ts`
- **NEW**: `auth.ts`, `user.ts`, `data.ts` (in `/services` folder)
- **Class Name**: Remains `AuthService`, `UserService`, `DataService` (unchanged)
- **Rationale**: The file structure makes it clear these are services, so the `.service` suffix is redundant

### 2. Component Naming Convention

- **OLD**: `login.component.ts`, `register.component.ts`
- **NEW**: `login.ts`, `register.ts` (in `/components` folder)
- **Class Name**: Remains `LoginComponent`, `RegisterComponent` (unchanged)
- **Rationale**: The file structure makes it clear these are components

### 3. Functional Guards and Interceptors (REQUIRED)

- **Guards**: Use functional guards with `CanActivateFn`, `CanMatchFn` instead of class-based guards
- **Interceptors**: Use functional interceptors with `HttpInterceptorFn` instead of class-based interceptors
- **OLD**: `export class AuthGuard implements CanActivate`
- **NEW**: `export const authGuard: CanActivateFn = (...) => { ... }`

### 4. File Naming

- **Services**: `auth.ts` (not `auth.service.ts`)
- **Components**: `login.ts` (not `login.component.ts`)
- **Guards**: `auth-guard.ts` (not `auth.guard.ts`)
- **Interceptors**: `auth-interceptor.ts` (not `auth.interceptor.ts`)

### 5. Dependency Injection (REQUIRED)

- **OLD**: Constructor-based dependency injection
- **NEW**: Use `inject()` function for dependency injection
- **OLD**: `constructor(private auth: Auth, private router: Router) {}`
- **NEW**: `const auth = inject(Auth); const router = inject(Router);`
- **Rationale**: Functional approach, better tree-shaking, works with functional guards/interceptors

#### Dependency Injection Examples

**Services:**

```typescript
// OLD
@Injectable({ providedIn: 'root' })
export class Auth {
  constructor(private http: HttpClient) {}
}

// NEW
@Injectable({ providedIn: 'root' })
export class Auth {
  private readonly http = inject(HttpClient);

  constructor() {
    // initialization code
  }
}
```

**Functional Guards:**

```typescript
// OLD (Class-based)
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private auth: Auth,
    private router: Router,
  ) {}
}

// NEW (Functional)
export const authGuard: CanActivateFn = () => {
  const auth = inject(Auth);
  const router = inject(Router);
  // guard logic
};
```

**Functional Interceptors:**

```typescript
// OLD (Class-based)
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private auth: Auth) {}
}

// NEW (Functional)
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(Auth);
  // interceptor logic
};
```

## Naming Conventions

### File Naming

- **Services**: `auth.ts`, `user.ts`, `data.ts` (in `/services` folder)
- **Components**: `login.ts`, `register.ts`, `dashboard.ts` (in `/components` folder)
- **Guards**: `auth-guard.ts`, `admin-guard.ts` (in `/guards` folder)
- **Interceptors**: `auth-interceptor.ts`, `error-interceptor.ts` (in `/interceptors` folder)

### Folder Structure

```
src/app/
├── components/
│   ├── login/
│   │   ├── login.ts          # LoginComponent class
│   │   ├── login.html        # Template file
│   │   └── login.scss        # Styles file
│   ├── register/
│   │   ├── register.ts       # RegisterComponent class
│   │   ├── register.html     # Template file
│   │   └── register.scss     # Styles file
│   └── shared/
├── services/
│   ├── auth.ts               # AuthService class
│   ├── user.ts               # UserService class
│   └── api.ts                # ApiService class
├── guards/
│   ├── auth-guard.ts         # Functional guards
│   └── admin-guard.ts        # Functional guards
├── interceptors/
│   ├── auth-interceptor.ts   # Functional interceptors
│   └── error-interceptor.ts  # Functional interceptors
├── models/
│   ├── user.ts               # User interface/type
│   ├── auth.ts               # Auth interfaces/types
│   └── api.ts                # API interfaces/types
└── utils/
    ├── validators.ts         # Custom validators
    └── helpers.ts            # Helper functions
```

### Class Naming Examples

#### Guards

```typescript
// OLD
@Injectable()
export class AuthGuard implements CanActivate {}

// NEW
@Injectable()
export class AuthGuard implements CanActivate {}
// Note: Guards keep the "Guard" suffix for clarity
```

### Dependency Injection

```typescript
// OLD
constructor(
  private authService: AuthService,
  private userService: UserService
) {}

// NEW
import { inject } from '@angular/core';
import { AuthService } from './services/auth';

@Injectable({ providedIn: 'root' })
export class SomeComponent {
  private auth = inject(Auth);

  // Component logic...
}
```

## Modern Angular 20 Patterns

### Signal-Based Services

```typescript
@Injectable({ providedIn: 'root' })
export class AuthService {
  private _currentUser = signal<User | null>(null);
  private _isAuthenticated = signal<boolean>(false);

  readonly currentUser = this._currentUser.asReadonly();
  readonly isAuthenticated = this._isAuthenticated.asReadonly();

  // Methods...
}
```

### Standalone Components

```typescript
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatButtonModule],
  template: `...`,
})
export class LoginComponen {
  constructor(private auth: Auth) {}
}
```

### Function-Based Guards

```typescript
// Preferred over class-based guards
export const authGuard: CanActivateFn = (route, state) => {
  const auth = inject(Auth);
  return auth.isAuthenticated() || auth.redirectToLogin();
};
```

### Functional Interceptors

```typescript
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const cloned = req.clone({
    setHeaders: {
      Authorization: `Bearer ${authService.getToken()}`,
    },
  });
  return next(cloned);
};
```

## Migration Guidelines

1. **Rename service classes** to remove "Service" suffix
2. **Update file names** to match class names (lowercase with hyphens)
3. **Update import statements** throughout the application
4. **Update dependency injection** variable names
5. **Maintain backwards compatibility** during transition period
6. **Update tests** to use new naming conventions

## Benefits

- **Cleaner code**: Less verbose class and variable names
- **Better readability**: Focus on functionality rather than type
- **Consistency**: Aligns with modern TypeScript/JavaScript practices
- **Reduced boilerplate**: Less repetitive naming patterns
