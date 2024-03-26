import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private tokenKey = 'auth_token';

  constructor(private http: HttpClient) { }

  setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  setUserId(id: string): void {
    localStorage.setItem('userId', id);
  }

  getUserId(): any {
    return localStorage.getItem('userId');
  }

  removeToken(): void {
    localStorage.removeItem(this.tokenKey);
  }

  isLoggedIn(): boolean {
    return this.getToken() !== null;
  }

  login(body: any) {
    return this.http.post(`${environment.url}/login`, body);

  }
}