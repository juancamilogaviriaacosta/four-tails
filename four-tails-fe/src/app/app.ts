import { Component, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AuthService } from './utils/auth-service';
import { LoadingService } from './utils/loading-service';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  
  protected readonly title = signal('Four Tails');
  showUserMenu = false;
  username = 'Juan';

  constructor(public router: Router, public auth: AuthService, public loadingService: LoadingService) {
  }

  login() {
    this.showUserMenu = false;
    this.router.navigate(['/login']);
  }

  logout() {
    this.loadingService.show();
    setTimeout(() => {
      this.showUserMenu = false;
      this.auth.logout();
      this.loadingService.hide();
    }, 1000);
    
  }

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
