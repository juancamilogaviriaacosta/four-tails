import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingService } from './loading-service';

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

  login(form: any) {
    this.loadingService.show();
    this.http.post('/api/auth', form).subscribe({
      next: (response:any) => {
        if(response && response.token) {
          localStorage.setItem('token', response.token);
          this.router.navigate(['/']);
          this.loadingService.hide();
        } else {
          alert('Error en usuario o contraseña');
          this.loadingService.hide();
        }
      },
      error: (error) => {
        alert('Error en usuario o contraseña');
        this.loadingService.hide();
      }
    });
  }

  signUp(form: any) {
    return this.http.post('/api/signUp', form);
  }

  getRole() {
    const token = localStorage.getItem('token');
    if (!token) {
      return null;
    }
    try {
      const payload = JSON.parse(token);
      return payload.role;
    } catch (error) {
      console.error('Error parsing token:', error);
      return null;
    }
  }

  getUserName() {
    const token = localStorage.getItem('token');
    if (!token) {
      return '';
    }
    try {
      const payload = JSON.parse(token);
      return payload.username;
    } catch (error) {
      console.error('Error parsing token:', error);
      return '';
    }
  }

  getUserEmail() {
    const token = localStorage.getItem('token');
    if (!token) {
      return '';
    }
    try {
      const payload = JSON.parse(token);
      return payload.email;
    } catch (error) {
      console.error('Error parsing token:', error);
      return '';
    }
  }

  getUserId() {
    const token = localStorage.getItem('token');
    if (!token) {
      return '';
    }
    try {
      const payload = JSON.parse(token);
      return payload.id;
    } catch (error) {
      console.error('Error parsing token:', error);
      return '';
    }
  }

  logout() {    
    localStorage.clear();
    this.router.navigate(['/']);
  }
}
