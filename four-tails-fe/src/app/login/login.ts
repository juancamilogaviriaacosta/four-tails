import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../utils/auth-service';

@Component({
  selector: 'app-login',
  imports: [FormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {

  model: any = {
    username: '',
    password: '',
  };

  constructor(public router: Router, public auth: AuthService) {
  }

  login() {
    this.auth.login(this.model);
  }

  closeLogin() {
    this.router.navigate(['/']);
  }
}
