import { Component, HostListener, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { Login } from './login/login';
import { AuthService } from './utils/auth-service';
import { LoadingService } from './utils/loading-service';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Login],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  
  protected readonly title = signal('Four Tails');
  showUserMenu = false;
  showLoginModal = false;
  mobileMenuOpen = false;
  username = '';

  constructor(public router: Router, public auth: AuthService, public loadingService: LoadingService) {
  }

  login() {
    this.showUserMenu = false;
    this.mobileMenuOpen = false;
    this.showLoginModal = true;
  }

  closeLoginModal(): void {
    this.showLoginModal = false;
  }

  @HostListener('document:keydown.escape')
  closeLoginModalOnEscape(): void {
    if (this.showLoginModal) {
      this.closeLoginModal();
    }
    this.mobileMenuOpen = false;
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen = false;
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

  closeUserMenuOnFocusOut(event: FocusEvent): void {
    const container = event.currentTarget as HTMLElement;
    if (!container.contains(event.relatedTarget as Node | null)) {
      this.showUserMenu = false;
    }
  }

  goToProfile(): void {
    this.showUserMenu = false;
    this.router.navigate(['/profile']);
  }

  goToMyServices(): void {
    this.showUserMenu = false;
    this.router.navigate(['/my-services']);
  }

  isNotInLoginPage() {
    return this.router.url !== '/login';
  }

  setUserName(username: string) {
    this.username = username;
  }

  goToMessages() {
    this.router.navigate(['/messages']);
  }
}
