import { Routes } from '@angular/router';
import { authGuard, guestGuard } from './guards/auth-guard';
import { LoginComponent } from './pages/login/login';
import { RegisterComponent } from './pages/register/register';
import { DashboardComponent } from './components/dashboard/dashboard';
import { HomeComponent } from './components/home/home';

export const routes: Routes = [
  // Public routes (accessible only when NOT authenticated)
  {
    path: '',
    component: HomeComponent,
    canActivate: [guestGuard],
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [guestGuard],
    title: 'Login - Menu Maker',
  },
  {
    path: 'register',
    component: RegisterComponent,
    canActivate: [guestGuard],
    title: 'Registro - Menu Maker',
  },

  // Protected routes (require authentication)
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard],
    title: 'Dashboard - Menu Maker',
  },

  // Redirect rules
  {
    path: 'home',
    redirectTo: '',
    pathMatch: 'full',
  },

  // Catch-all route - redirect to appropriate page based on auth status
  {
    path: '**',
    redirectTo: '',
  },
];
