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

  logout() {    
    localStorage.clear();
    this.router.navigate(['/']);
  }
}
