import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingService } from './loading-service';

interface JwtPayload {
  role?: unknown;
  email?: unknown;
  id?: unknown;
  username?: unknown;
  firstName?: unknown;
  lastName?: unknown;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  
  constructor(public router: Router, private http: HttpClient, public loadingService: LoadingService) {    
  }

  isInLogin() {
    return this.router.url.startsWith('/login');
  }

  isLoggedIn() {
    return !!localStorage.getItem('token');
  }

  signUp(form: any) {
    return this.http.post('/api/signUp', form);
  }

  getRole(): string | null {
    const role = this.getTokenPayload()?.role;
    return typeof role === 'string' ? role : null;
  }

  /*getUserName(): string {
    const payload = this.getTokenPayload();
    if (typeof payload?.username === 'string') {
      return payload.username;
    }

    return [payload?.firstName, payload?.lastName]
      .filter((name): name is string => typeof name === 'string')
      .join(' ');
  }*/

  getUserEmail(): string {
    const response = this.getTokenPayload()?.email;
    return typeof response === 'string' ? response : '';
  }

  getUserFirstName(): string {
    const response = this.getTokenPayload()?.firstName;
    return typeof response === 'string' ? response : '';
  }

  getUserFLastName(): string {
    const response = this.getTokenPayload()?.lastName;
    return typeof response === 'string' ? response : '';
  }

  getUserId(): number | '' {
    const response = this.getTokenPayload()?.id;
    return typeof response === 'number' && Number.isFinite(response) ? response : '';
  }

  private getTokenPayload(): JwtPayload | null {
    const token = localStorage.getItem('token');
    if (!token) {
      return null;
    }

    try {
      const parts = token.split('.');
      if (parts.length !== 3 || !parts[1]) {
        throw new Error('Invalid JWT format');
      }

      const base64Payload = parts[1].replace(/-/g, '+').replace(/_/g, '/');
      const paddedPayload = base64Payload.padEnd(Math.ceil(base64Payload.length / 4) * 4, '=');
      const bytes = Uint8Array.from(atob(paddedPayload), character => character.charCodeAt(0));
      const payload: unknown = JSON.parse(new TextDecoder().decode(bytes));
      if (payload === null || typeof payload !== 'object' || Array.isArray(payload)) {
        throw new Error('JWT payload must be a JSON object');
      }

      return payload as JwtPayload;
    } catch (error) {
      console.error('Error parsing JWT:', error);
      return null;
    }
  }

  logout() {    
    localStorage.clear();
    this.router.navigate(['/']);
  }
}
