import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { AuthService, UserInfo } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [FormsModule, HttpClientModule, CommonModule],
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  emailError: string = '';
  passwordError: string = '';

  constructor(
    private router: Router,
    private http: HttpClient,
    private authService: AuthService
  ) {}

  validateEmail(): boolean {
    return this.username.endsWith('@ufl.edu');
  }

  login() {
    this.emailError = '';
    this.passwordError = '';

    if (!this.validateEmail()) {
      this.emailError = 'Please use a valid UF email (e.g., user@ufl.edu).';
      return;
    }

    const payload = {
      email: this.username,
      password: this.password,
    };

    this.http
      .post<any>('http://localhost:8080/login', payload, {
        withCredentials: true,
      })
      .pipe(
        catchError((error) => {
          if (error.error?.message === 'Incorrect password') {
            this.passwordError = 'Incorrect password';
          } else if (
            error.error?.message === 'Invalid email or account not found'
          ) {
            this.emailError = 'Invalid email or account not found';
          } else {
            this.emailError = 'An unexpected error occurred';
          }
          return throwError(() => error);
        })
      )
      .subscribe((response) => {
        const userInfo: UserInfo = {
          id: response.user_id,
          name: response.user_name || this.username,
          email: response.user_email || this.username,
          role: response.user_role || 'member',
          joined: new Date(response.user_created_at * 1000)
            .toISOString()
            .split('T')[0],
        };

        this.authService.setUser(userInfo);

        // ✅ Redirect based on role
        if (userInfo.role === 'admin') {
          this.router.navigate(['/admin']);
        } else {
          this.router.navigate(['/home']); // CHANGED from '/announcements' to '/home'
        }
      });
  }

  goToRegister(): void {
    this.router.navigate(['/register']);
  }
}
