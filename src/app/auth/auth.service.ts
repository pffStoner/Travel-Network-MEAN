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
  userNameSubject = new  Subject<string>();
  private userId: string;
  private username: string;



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
  getUsername() {
    return this.username;
  }

  register(username: string, email: string, password: string) {
    const authData: AuthData = { username: username, email: email, password: password };
    console.log(authData);
    this.http.post('http://localhost:3000/api/user/signup', authData)
      .subscribe(response => {
        console.log(response);
      });
  }

  login(email: string, password: string) {
    const authData: AuthData = { email: email, password: password };
    this.http.post<{ token: string, expireIn: number, userId: string, username: string }>('http://localhost:3000/api/user/login', authData)
      .subscribe(response => {
        console.log(response);
        const token = response.token;
        this.token = token;
        if (token) {
          const expireIn = response.expireIn;
          this.setAuthTimer(expireIn);
          this.isAuth = true;
          this.userId = response.userId;
          this.username = response.username;
            this.authStatus.next(true);
          const now = new Date();
          const expireDate = new Date(now.getTime() + expireIn * 1000);
          this.saveToken(token, expireDate, this.userId, this.username);
          this.route.navigate(['/']);
          console.log(response.userId);
          console.log('username', this.username);
  this.userNameSubject.next(this.username);
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
    this.username = null;

    this.route.navigate(['/']);
  }
  private setAuthTimer(duration: number) {
    console.log('timer' + duration);
    this.tokenTimer = setTimeout(() => {
      this.Logout();
    }, duration * 1000);
  }
  private saveToken(token: string, expireDate: Date, userId: string, username: string) {
    localStorage.setItem('token', token);
    // toISOString easy serialize and deserialize date format
    localStorage.setItem('expire', expireDate.toISOString());
    localStorage.setItem('userId', userId);
    localStorage.setItem('username', username);


  }
  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expire');
    localStorage.removeItem('userId');
    localStorage.removeItem('username');

  }
  private getAuthData() {
    const token = localStorage.getItem('token');
    const expireDuration = localStorage.getItem('expire');
    const userId = localStorage.getItem('userId');
    const username = localStorage.getItem('username');

    if (!token || !expireDuration) {
      return;
    }
    return {
      token: token,
      expire: new Date(expireDuration),
      userId: userId,
      username: username
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
      this.username = authInfo.username;
      this.setAuthTimer(expireIn / 1000);
      this.authStatus.next(true);
    }
  }
}
