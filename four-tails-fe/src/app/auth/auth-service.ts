import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  constructor(public router: Router, private http: HttpClient) {    
  }

  isInLogin() {
    return this.router.url.startsWith('/login');
  }

  isLoggedIn() {
    return !!localStorage.getItem('token');
  }

  login(form: any) {
    this.http.post('/api/auth', form).subscribe({
      next: (response:any) => {
        if(response && response.token) {
          localStorage.setItem('token', response.token);
          this.router.navigate(['/']);
        } else {
          alert('Error en usuario o contraseña');
        }
      },
      error: (error) => {
        alert('Error en usuario o contraseña');
      }
    });
  }

  logout() {    
    localStorage.clear();
    this.router.navigate(['/']);
  }

}
