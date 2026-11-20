import { ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LoadingService } from '../utils/loading-service';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../utils/auth-service';
import { ApiUrlService } from '../utils/api-url.service';
import { PushNotificationService } from '../utils/push-notification.service';
import { FirebaseNotificationService } from '../firebase/firebase-notification.service';

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

  constructor(
    public router: Router, 
    public http: HttpClient, 
    public apiUrl: ApiUrlService,
    public authService: AuthService,
    public loadingService: LoadingService,
    public pushNotificationService: PushNotificationService,
    public firebaseNotificationService: FirebaseNotificationService,) {
  }

  login() {
    this.loadingService.show();
    this.http.post(`${this.apiUrl.apiUrl}/api/auth`, this.model).subscribe({
      next: async (response: any) => {
        if (response?.token) {
          this.authService.setAuthenticated(response.token);
          this.closeLogin();
          this.pushNotificationService.initialize();//android
          this.firebaseNotificationService.enableNotifications();//web
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
