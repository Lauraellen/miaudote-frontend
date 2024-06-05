import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import * as firebase from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private tokenKey = 'auth_token';
  user: Observable<any>;

  constructor(private http: HttpClient, public afAuth: AngularFireAuth, private router: Router) {
    this.user = afAuth.authState;
  }

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

  // login(body: any) {
  //   return this.http.post(`${environment.url}/login`, body);
  // }

  public login(mail: string, password: string, body: any) {
    return new Promise<void>((resolve, reject) => {
      this.afAuth.signInWithEmailAndPassword(mail, password).then((userCredential) => {
        const user = userCredential.user;
        console.debug('user => ', user);
        user?.getIdToken(true).then((idToken) => {
          localStorage.setItem('auth_token', idToken);
          body = {
            ...body,
            firebaseToken: idToken, 
            userId: user.uid
          }
          this.http.post(`${environment.url}/login`, body).subscribe((res: any) => {
            localStorage.setItem('userId', res?.userId);
            this.router.navigate(['/adote']);
            resolve();
          }, (error) => {
            console.error('Error logging in:', error);
            this.router.navigate(['/login']);
            reject();
          });
        }).catch((error) => {
          console.error('Error getting Firebase token:', error);
          this.router.navigate(['/login']);
          reject();
        });
      }).catch((error) => {
        console.error('Error signing in:', error);
        this.router.navigate(['/login']);
        reject();
      });
    });
  }
  

  public newUser(mail: string, password: string) {
    return new Promise((resolve, reject) => {
      this.afAuth.createUserWithEmailAndPassword(mail, password).then((user) => {
        console.debug('user => ', user)
        localStorage['auth_token'] = user.user?.getIdToken();
        this.router.navigate(['/login']);
      })
        .catch((error) => {
          this.router.navigate(['/login']);
        });
    })
      .catch((error) => {
        this.router.navigate(['/login']);
      });
  }

  public logout() {
    return this.afAuth.signOut();
  }

  clearAuthData(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem('userId');
  }

  tokenExpired(token: string | null) {
    if (token) {
      const expiry = (JSON.parse(atob(token.split('.')[1]))).exp;
      return (Math.floor((new Date).getTime() / 1000)) >= expiry;
    }
    return true;
  }
  

  // async tokenExpired(): Promise<boolean> {
  //   try {
  //     const user = await this.afAuth.currentUser;
  //     if (user) {
  //       const tokenResult = await user.getIdTokenResult();
  //       if (tokenResult) {
  //         const expirationTime = parseInt(tokenResult.expirationTime, 10); // Converter para número inteiro
  //         if (expirationTime) {
  //           const currentTime = Math.floor(Date.now() / 1000); // Obter o tempo atual em segundos
  //           return currentTime >= expirationTime;
  //         }
  //       }
  //     }
  //     return true;
  //   } catch (error) {
  //     console.error('Erro ao verificar a expiração do token:', error);
  //     return true;
  //   }
  // }
}