import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { AuthData } from '../auth/auth-data.model';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private token: string;
  private isAuth = false;
  private authStatus = new Subject<boolean>();
  private tokenTimer: any;
  private userId: string;

  constructor(
    private http: HttpClient,
    private route: Router) { }

  getToken() {
    return this.token;
  }
  getAuthStatus() {
    return this.isAuth;
  }
  getAuthStatusListener() {
    return this.authStatus.asObservable();
  }
  getUserId() {
    return this.userId;
  }

  register(email: string, password: string) {
    const authData: AuthData = { email: email, password: password };
    console.log(authData);
    this.http.post('http://localhost:3000/api/user/signup', authData)
      .subscribe(response => {
        console.log(response);
      });
  }

  login(email: string, password: string) {
    const authData: AuthData = { email: email, password: password };
    this.http.post<{ token: string, expireIn: number, userId: string }>('http://localhost:3000/api/user/login', authData)
      .subscribe(response => {
        console.log(response);
        const token = response.token;
        this.token = token;
        if (token) {
          const expireIn = response.expireIn;
          this.setAuthTimer(expireIn);
          this.isAuth = true;
          this.userId = response.userId;
          this.authStatus.next(true);
          const now = new Date();
          const expireDate = new Date(now.getTime() + expireIn * 1000);
          this.saveToken(token, expireDate, this.userId);
          this.route.navigate(['/']);
          console.log(response.userId);
        }
      });
  }

  Logout() {
    this.token = null;
    this.isAuth = false;
    this.authStatus.next(false);
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.userId = null;
    this.route.navigate(['/']);
  }
  private setAuthTimer(duration: number) {
    console.log('timer' + duration);
    this.tokenTimer = setTimeout(() => {
      this.Logout();
    }, duration * 1000 );
  }
  private saveToken(token: string, expireDate: Date, userId: string) {
    localStorage.setItem('token', token);
    // toISOString easy serialize and deserialize date format
    localStorage.setItem('expire', expireDate.toISOString());
    localStorage.setItem('userId', userId);

  }
  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expire');
    localStorage.removeItem('userId');
  }
  private getAuthData() {
    const token = localStorage.getItem('token');
    const expireDuration = localStorage.getItem('expire');
    const userId = localStorage.getItem('userId');
    if (!token || !expireDuration) {
      return;
    }
    return {
      token: token,
      expire: new Date(expireDuration),
      userId: userId
    };
  }
  autoAuthUser() {
    const authInfo = this.getAuthData();
    if (!authInfo) {
      return;
    }
    const now = new Date();
    const expireIn = authInfo.expire.getTime() - now.getTime();
    if (expireIn > 0) {
      this.token = authInfo.token;
      this.isAuth = true;
      this.userId = authInfo.userId;
      this.setAuthTimer(expireIn / 1000);
      this.authStatus.next(true);
    }
  }
}
