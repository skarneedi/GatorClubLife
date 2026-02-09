import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [CommonModule],
})
export class LoginComponent implements OnInit {
  isLoggedIn$!: Observable<boolean>;
  isLoading$!: Observable<boolean>;
  error$!: Observable<any>;

  constructor(private auth: AuthService, private router: Router) {
    this.isLoggedIn$ = this.auth.isLoggedIn$;
    this.isLoading$ = this.auth.isLoading$;
    this.error$ = this.auth.error$;
  }

  ngOnInit(): void {
    this.isLoggedIn$.subscribe((isLoggedIn) => {
      console.log('🔐 isLoggedIn$ emitted:', isLoggedIn);
      if (isLoggedIn) {
        console.log('✅ User is logged in. Redirecting to /home...');
        this.router.navigate(['/home']);
      }
    });
  }

  login() {
    this.auth.login();
  }
}
