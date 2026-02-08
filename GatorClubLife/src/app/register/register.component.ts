import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  standalone: true,
  imports: [FormsModule, HttpClientModule, CommonModule],
})
export class RegisterComponent {
  name = '';
  email = '';
  username = '';
  password = '';
  confirmPassword = '';
  role = '';
  errorMessage = '';
  submitted = false;
  passwordNotStrong = false;
  invalidEmail = false;

  showPassword = false;
  showConfirmPassword = false;

  emailAvailable: boolean | null = null;
  usernameAvailable: boolean | null = null;
  checkingEmail = false;
  checkingUsername = false;
  emailCheckTimeout: any = null;
  usernameCheckTimeout: any = null;

  capsLockOnPassword = false;
  capsLockOnConfirm = false;

  passwordStrength: number = 0;
  passwordStrengthLabel: string = '';
  passwordStrengthColor: string = '';

  constructor(private router: Router, private http: HttpClient) {}

  toggleShowPassword(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPassword(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  onPasswordInput(): void {
    if (this.password) {
      this.passwordNotStrong = !this.isPasswordStrong(this.password);
    } else {
      this.passwordNotStrong = false;
    }

    const hasLower = /[a-z]/.test(this.password);
    const hasUpper = /[A-Z]/.test(this.password);
    const hasNumber = /\d/.test(this.password);
    const hasSpecial = /[^\w\s]/.test(this.password);

    let score = 0;
    if (hasLower) score++;
    if (hasUpper) score++;
    if (hasNumber) score++;
    if (hasSpecial) score++;
    if (this.password.length >= 8) score++;

    this.passwordStrength = (score / 5) * 100;
    if (this.passwordStrength < 40) {
      this.passwordStrengthLabel = 'Weak';
      this.passwordStrengthColor = 'red';
    } else if (this.passwordStrength < 80) {
      this.passwordStrengthLabel = 'Moderate';
      this.passwordStrengthColor = 'orange';
    } else {
      this.passwordStrengthLabel = 'Strong';
      this.passwordStrengthColor = 'green';
    }
  }

  isPasswordStrong(password: string): boolean {
    const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,}$/;
    return strongRegex.test(password);
  }

  checkEmailAvailability(): void {
    if (this.emailCheckTimeout) clearTimeout(this.emailCheckTimeout);
    const uflRegex = /^[a-zA-Z0-9._%+-]+@ufl\.edu$/;
    if (!this.email || !uflRegex.test(this.email)) {
      this.emailAvailable = null;
      return;
    }

    this.checkingEmail = true;
    this.emailAvailable = null;

    this.emailCheckTimeout = setTimeout(() => {
      this.http
        .get<{ available: boolean }>(`/api/placeholder/check-email?email=${encodeURIComponent(this.email)}`)
        .subscribe({
          next: (res) => {
            this.emailAvailable = res.available;
            this.checkingEmail = false;
          },
          error: () => {
            this.emailAvailable = null;
            this.checkingEmail = false;
          },
        });
    }, 400);
  }

  checkUsernameAvailability(): void {
    if (this.usernameCheckTimeout) clearTimeout(this.usernameCheckTimeout);
    if (!this.username) {
      this.usernameAvailable = null;
      return;
    }

    this.checkingUsername = true;
    this.usernameAvailable = null;

    this.usernameCheckTimeout = setTimeout(() => {
      this.http
        .get<{ available: boolean }>(`/api/placeholder/check-username?username=${encodeURIComponent(this.username)}`)
        .subscribe({
          next: (res) => {
            this.usernameAvailable = res.available;
            this.checkingUsername = false;
          },
          error: () => {
            this.usernameAvailable = null;
            this.checkingUsername = false;
          },
        });
    }, 400);
  }

  register(): void {
    this.errorMessage = '';
    this.submitted = true;

    if (!this.name || !this.email || !this.username || !this.password || !this.confirmPassword || !this.role) return;

    const uflRegex = /^[a-zA-Z0-9._%+-]+@ufl\.edu$/;
    if (!uflRegex.test(this.email)) {
      this.invalidEmail = true;
      this.errorMessage = 'Please use a valid @ufl.edu email address.';
      return;
    } else {
      this.invalidEmail = false;
    }

    if (this.emailAvailable === false || this.usernameAvailable === false) {
      this.errorMessage = 'Email or Username is already taken.';
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match!';
      return;
    }

    if (!this.isPasswordStrong(this.password)) {
      this.errorMessage = 'Password must meet strength requirements.';
      this.passwordNotStrong = true;
      return;
    }

    const payload = {
      user_name: this.username,
      user_email: this.email,
      user_role: this.role,
      user_password: this.password,
    };

    this.http
      .post<{ user_id: number }>('http://localhost:8080/users/create', payload)
      .pipe(
        catchError((err) => {
          // ✅ Improved error parsing to avoid [object Object]
          if (typeof err.error === 'string') {
            this.errorMessage = err.error;
          } else if (err.error?.message) {
            this.errorMessage = err.error.message;
          } else {
            this.errorMessage = 'Registration failed!';
          }
          return throwError(() => err);
        })
      )
      .subscribe(() => this.router.navigate(['/login']));
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }

  handleCapsLock(event: KeyboardEvent, field: string): void {
    const isCaps = event.getModifierState && event.getModifierState('CapsLock');
    if (field === 'password') this.capsLockOnPassword = isCaps;
    else if (field === 'confirm') this.capsLockOnConfirm = isCaps;
  }
}
