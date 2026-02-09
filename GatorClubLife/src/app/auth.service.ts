import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService as Auth0Service, User } from '@auth0/auth0-angular';
import { BehaviorSubject, Observable, of, combineLatest } from 'rxjs';
import { tap, map, switchMap, catchError, shareReplay } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';

export interface UserInfo {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'member';
  joined: string;
  phone?: string;
  photo?: string;
  auth0Id?: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private userInfoSubject = new BehaviorSubject<UserInfo | null>(null);

  // Expose userInfo$ as the main stream for user data
  userInfo$ = this.userInfoSubject.asObservable();

  // Map Auth0 isAuthenticated to our isLoggedIn$
  isLoggedIn$: Observable<boolean>;
  isLoading$: Observable<boolean>;
  error$: Observable<any>;

  constructor(
    private auth0: Auth0Service,
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isLoggedIn$ = this.auth0.isAuthenticated$;
    this.isLoading$ = this.auth0.isLoading$;
    this.error$ = this.auth0.error$;
    if (isPlatformBrowser(this.platformId)) {
      this.initUserSync();
    }
  }

  private initUserSync() {
    this.auth0.user$.pipe(
      switchMap(auth0User => {
        if (!auth0User) return of(null);
        return this.syncUserWithBackend(auth0User);
      })
    ).subscribe(user => {
      this.userInfoSubject.next(user);
    });
  }

  private syncUserWithBackend(auth0User: User): Observable<UserInfo | null> {
    const payload = {
      user_name: auth0User.name || auth0User.nickname || 'Unknown',
      user_email: auth0User.email,
      user_role: 'member', // Default role, backend might override if exists
      auth0_id: auth0User.sub,
      // Pass other fields if backend supports them
    };

    return this.http.post<any>('http://localhost:8080/users/create', payload).pipe(
      map(pUser => {
        // Map backend response to UserInfo
        return {
          id: pUser.user_id,
          name: pUser.user_name,
          email: pUser.user_email,
          role: pUser.user_role,
          joined: new Date(pUser.user_created_at * 1000).toISOString(),
          photo: auth0User.picture,
          auth0Id: pUser.auth0_id
        } as UserInfo;
      }),
      catchError(err => {
        console.error('Failed to sync user with backend:', err);
        return of(null);
      })
    );
  }

  // Trigger Auth0 Login
  login(): void {
    this.auth0.loginWithRedirect().subscribe();
  }

  // Trigger Auth0 Logout
  logout(): void {
    this.auth0.logout({
      logoutParams: { returnTo: document.location.origin }
    }).subscribe({
      next: () => console.log('Logged out successfully'),
      error: (err) => console.error('Logout failed:', err)
    });
  }

  // Helper for synchronous access (prefer result of subscription)
  getUserDetails(): UserInfo | null {
    return this.userInfoSubject.value;
  }

  // Legacy method - mostly no-op or just local update (won't persist to DB yet)
  setUser(user: UserInfo): void {
    this.userInfoSubject.next(user);
  }
}
