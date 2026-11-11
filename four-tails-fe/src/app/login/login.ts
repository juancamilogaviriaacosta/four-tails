import { ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LoadingService } from '../utils/loading-service';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../utils/auth-service';

@Component({
  selector: 'app-login',
  imports: [FormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {

  @Input() modalMode = false;
  @Output() closed = new EventEmitter<void>();

  model: any = {
    id: 0,
    email: '',
    password: '',
    role: ''
  };

  constructor(public router: Router, private http: HttpClient, public loadingService: LoadingService, public authService: AuthService) {
  }

  login() {
    this.loadingService.show();
    this.http.post('/api/auth', this.model).subscribe({
      next: (response: any) => {
        if (response?.token) {
          this.authService.setAuthenticated(response.token);
          this.closeLogin();
        } else {
          alert('Error en usuario o contraseña');
        }
        this.loadingService.hide();
      }, error: (error) => {
        console.error('Login error:', error);
        alert('Error en usuario o contraseña');
        this.loadingService.hide();
      }
    });
  }

  closeLogin() {
    if (this.modalMode) {
      this.closed.emit();
      return;
    }
    this.router.navigate(['/']);
  }
}
