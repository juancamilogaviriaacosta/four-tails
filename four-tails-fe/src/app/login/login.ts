import { Component } from '@angular/core';
import { AuthService } from '../auth/auth-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {

  constructor(public router: Router, public auth: AuthService) {
  }

  closeLogin() {
    this.router.navigate(['/']);
  }
}
