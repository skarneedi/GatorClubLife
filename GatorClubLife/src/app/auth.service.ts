import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface UserInfo {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'member';
  joined: string;
  phone?: string; 
  photo?: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private loggedInSubject = new BehaviorSubject<boolean>(false);
  private userInfoSubject = new BehaviorSubject<UserInfo | null>(null);

  isLoggedIn$ = this.loggedInSubject.asObservable();
  userInfo$ = this.userInfoSubject.asObservable();

  constructor() {
    if (this.isBrowser()) {
      const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
      const storedUser = localStorage.getItem('userInfo');
      const userInfo = storedUser ? JSON.parse(storedUser) : null;

      this.loggedInSubject.next(isLoggedIn);
      this.userInfoSubject.next(userInfo);
    }
  }

  setUser(user: UserInfo): void {
    if (this.isBrowser()) {
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userInfo', JSON.stringify(user));
    }
    this.loggedInSubject.next(true);
    this.userInfoSubject.next(user);
  }

  getUserDetails(): UserInfo | null {
    if (this.isBrowser()) {
      const storedUser = localStorage.getItem('userInfo');
      return storedUser ? JSON.parse(storedUser) : null;
    }
    return null;
  }

  logout(): void {
    if (this.isBrowser()) {
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('userInfo');
    }
    this.loggedInSubject.next(false);
    this.userInfoSubject.next(null);
  }

  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  }
}
