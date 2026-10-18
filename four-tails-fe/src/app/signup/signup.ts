import { Component, EventEmitter, Input, Output } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../utils/auth-service';
import { LoadingService } from '../utils/loading-service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import messagesEn from './messages-en.json';
import messagesEs from './messages-es.json';

@Component({
  selector: 'app-signup',
  imports: [FormsModule, CommonModule],
  templateUrl: './signup.html',
  styleUrl: './signup.css',
})
export class Signup {

  private readonly messages = typeof navigator !== 'undefined' && navigator.language.toLowerCase().startsWith('es')
    ? messagesEs
    : messagesEn;

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
    this.auth.signUp(this.model).subscribe({
      next: (response: any) => {
        if (response?.token) {
          localStorage.setItem('token', response.token);
        }
        this.loadingService.hide();
        this.closeSignup();
        this.router.navigate(['/edit-profile']);
      },
      error: (error: HttpErrorResponse) => {
        this.loadingService.hide();
        const isDuplicateEmail = error.status === 409 || error.error?.code === 'EMAIL_ALREADY_REGISTERED';
        alert(isDuplicateEmail
          ? this.messages.signup.errors.emailAlreadyRegistered
          : this.messages.signup.errors.generic);
      },
    });
  }

}
