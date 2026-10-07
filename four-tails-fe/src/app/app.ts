import { Component, HostListener, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { Login } from './login/login';
import { AuthService } from './utils/auth-service';
import { LoadingService } from './utils/loading-service';
import { Signup } from './signup/signup';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Login, Signup],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  
  protected readonly title = signal('Four Tails');
  showUserMenu = false;
  showLoginModal = false;
  mobileMenuOpen = false;
  username = '';
  showSignupModal = false;

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

  signup() {
    this.showUserMenu = false;
    this.mobileMenuOpen = false;
    this.showSignupModal = true;
  }

  closeSignupModal(): void {
    this.showSignupModal = false;
  }

  @HostListener('document:keydown.escape')
  closeLoginOrSignupModalOnEscape(): void {
    if (this.showLoginModal) {
      this.closeLoginModal();
    }
    if (this.showSignupModal) {
      this.closeSignupModal();
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
      this.mobileMenuOpen = false;
      this.auth.logout();
      this.loadingService.hide();
      this.router.navigate(['/']);
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
    this.router.navigate(['/edit-profile']);
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
