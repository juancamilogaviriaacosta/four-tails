import { ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
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
  
  model: any = {
    id: 0,
    email: '',
    password: '',
    role: ''
  };

  constructor(public router: Router, public auth: AuthService, public loadingService: LoadingService) {
  }

  login() {
    this.loadingService.show();
    setTimeout(() => {
      //this.auth.login(this.model);
      if (this.model.email === 'jenny.anderson@example.com') {
        this.model.id = 2;
        this.model.role = 'sitter';
      } else if (this.model.email === 'abraham.simpson@example.com') {
        this.model.id = 9;
        this.model.role = 'owner';
      } else if(this.model.email === 'admin.fourtails@example.com'){
        this.model.id = 1;
        this.model.role = 'admin';
      }
      localStorage.setItem('token', JSON.stringify(this.model));
      this.loadingService.hide();
      this.closeLogin();
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
