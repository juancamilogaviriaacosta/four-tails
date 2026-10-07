import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../utils/auth-service';
import { LoadingService } from '../utils/loading-service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-signup',
  imports: [FormsModule, CommonModule],
  templateUrl: './signup.html',
  styleUrl: './signup.css',
})
export class Signup {

  @Input() modalMode = false;
  @Output() closed = new EventEmitter<void>();

  model: any = {
    email: '',
    firstName: '',
    lastName: '',
    password: '',
  };

  constructor(public router: Router, public auth: AuthService, public loadingService: LoadingService) {
  }

  closeSignup() {
    if (this.modalMode) {
      this.closed.emit();
      return;
    }
    this.router.navigate(['/']);
  }

  signUp() {
    this.loadingService.show();
    setTimeout(() => {
      //this.auth.signUp(this.model);
      this.loadingService.hide();
      this.closeSignup();
      this.router.navigate(['/edit-profile']);
      localStorage.setItem('token', JSON.stringify(this.model));
    }, 1000);
  }

}
