import { Component, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AuthService } from './auth/auth-service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  
  protected readonly title = signal('Four Tails');

  constructor(public router: Router, public auth: AuthService) {

  }

  login() {
    this.router.navigate(['/login']);
  }

  isLoggedIn = true; // AuthService
  showUserMenu = false;
  username = 'Juan';

  toggleUserMenu(): void {
    this.showUserMenu = !this.showUserMenu;
  }

  goToProfile(): void {
    this.showUserMenu = false;
    this.router.navigate(['/profile']);
  }

  goToMyServices(): void {
    this.showUserMenu = false;
    this.router.navigate(['/my-services']);
  }
}
