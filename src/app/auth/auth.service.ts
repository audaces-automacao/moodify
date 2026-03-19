import { DOCUMENT } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { LoginResponse, VerifyResponse } from '../models/auth.model';

const TOKEN_KEY = 'auth_token';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private storage = inject(DOCUMENT).defaultView?.localStorage;

  isAuthenticated = signal(false);

  getToken(): string | null {
    return this.storage?.getItem(TOKEN_KEY) ?? null;
  }

  login(email: string, password: string): Observable<boolean> {
    return this.http.post<LoginResponse>('/api/auth/login', { email, password }).pipe(
      tap(response => {
        this.storage?.setItem(TOKEN_KEY, response.token);
        this.isAuthenticated.set(true);
      }),
      map(() => true),
      catchError(() => of(false))
    );
  }

  logout(): void {
    this.storage?.removeItem(TOKEN_KEY);
    this.isAuthenticated.set(false);
    this.router.navigate(['/login']);
  }

  verifyToken(): Observable<boolean> {
    const token = this.getToken();
    if (!token) {
      return of(false);
    }

    return this.http.get<VerifyResponse>('/api/auth/verify').pipe(
      tap(() => {
        this.isAuthenticated.set(true);
      }),
      map(() => true),
      catchError(() => {
        this.logout();
        return of(false);
      })
    );
  }
}
