import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class RegisterComponent {
  registerForm: FormGroup;
  isLoading = signal(false);

  constructor(
    private readonly fb: FormBuilder,
    private readonly auth: AuthService,
    private readonly router: Router,
    private readonly snackBar: MatSnackBar,
  ) {
    this.registerForm = this.fb.group({
      firstName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required],
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.registerForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string): string | null {
    const field = this.registerForm.get(fieldName);
    if (field?.errors && (field.dirty || field.touched)) {
      return Object.keys(field.errors)[0];
    }
    return null;
  }

  hasPasswordMismatch(): boolean {
    const password = this.registerForm.get('password')?.value;
    const confirmPassword = this.registerForm.get('confirmPassword')?.value;
    const confirmField = this.registerForm.get('confirmPassword');

    return !!(
      confirmField &&
      confirmField.touched &&
      password &&
      confirmPassword &&
      password !== confirmPassword
    );
  }

  onSubmit(): void {
    if (this.registerForm.valid && !this.hasPasswordMismatch()) {
      this.isLoading.set(true);

      const formValue = this.registerForm.value;
      const registerData = {
        firstName: formValue.firstName,
        email: formValue.email,
        password: formValue.password,
      };

      this.auth.register(registerData).subscribe({
        next: (response) => {
          this.isLoading.set(false);
          this.snackBar.open('¡Cuenta creada exitosamente!', 'Cerrar', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'top',
            panelClass: ['success-snackbar'],
          });
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          this.isLoading.set(false);
          this.snackBar.open(
            error.message ?? 'Error de registro. Por favor intenta de nuevo.',
            'Cerrar',
            {
              duration: 5000,
              horizontalPosition: 'center',
              verticalPosition: 'top',
              panelClass: ['error-snackbar'],
            },
          );
        },
      });
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.registerForm.controls).forEach((key) => {
        this.registerForm.get(key)?.markAsTouched();
      });
    }
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }
}
