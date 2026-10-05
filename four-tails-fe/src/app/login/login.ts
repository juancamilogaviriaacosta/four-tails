import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../utils/auth-service';
import { LoadingService } from '../utils/loading-service';

@Component({
  selector: 'app-login',
  imports: [FormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {

  @Input() modalMode = false;
  @Output() closed = new EventEmitter<void>();
  @Output() setUserName = new EventEmitter<string>();

  model: any = {
    username: '',
    password: '',
  };

  constructor(public router: Router, public auth: AuthService, public loadingService: LoadingService) {
  }

  login() {
    this.loadingService.show();
    setTimeout(() => {
      //this.auth.login(this.model);
      this.loadingService.hide();
      this.closeLogin();
      this.router.navigate(['/']);
      localStorage.setItem('token', JSON.stringify(this.model));
      this.setUserName.emit(this.model.username);
    }, 1000);
    
  }

  closeLogin() {
    if (this.modalMode) {
      this.closed.emit();
      return;
    }

    this.router.navigate(['/']);
  }
}
