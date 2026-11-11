import { Component, HostListener, OnDestroy, OnInit, signal } from '@angular/core';
import { App as CapacitorApp } from '@capacitor/app';
import { PluginListenerHandle } from '@capacitor/core';
import { Router, RouterOutlet } from '@angular/router';
import { Login } from './login/login';
import { catchError, distinctUntilChanged, EMPTY, of, Subscription, switchMap, timer } from 'rxjs';
import { AuthService } from './utils/auth-service';
import { LoadingService } from './utils/loading-service';
import { Signup } from './signup/signup';
import { AuthPromptService } from './utils/auth-prompt-service';
import { NotificationService } from './notifications/notification.service';
import { AsyncPipe } from '@angular/common';
import { interval } from 'rxjs';
import { ApiUrlService } from './utils/api-url.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Login, Signup, AsyncPipe],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit, OnDestroy {

  protected readonly title = signal('Four Tails');
  showUserMenu = false;
  showLoginModal = false;
  mobileMenuOpen = false;
  username = '';
  searchTerm = '';
  showSignupModal = false;
  private backButtonListener?: PluginListenerHandle;
  showAuthWarning = false;
  private authWarningTimeout?: ReturnType<typeof setTimeout>;
  private authPromptSubscription: Subscription;
  private notificationSyncSubscription?: Subscription;

  constructor(
    public router: Router,
    public apiUrl: ApiUrlService,
    public authService: AuthService,
    public loadingService: LoadingService,
    public authPromptService: AuthPromptService,
    public notificationService: NotificationService,
  ) {
    this.authPromptSubscription = authPromptService.loginAndSignupPromptRequested$.subscribe(() => {
      this.showAuthWarning = true;
      this.mobileMenuOpen = window.matchMedia('(max-width: 1100px)').matches;
      clearTimeout(this.authWarningTimeout);
      this.authWarningTimeout = setTimeout(() => {
        this.showAuthWarning = false;
      }, 6000);
    });
  }

  async ngOnInit(): Promise<void> {

    if (this.authService.isLoggedIn()) {
      this.notificationService.refreshUnreadCount().subscribe({
        error: error => console.error('Error loading notifications', error)
      });
    } else {
      this.notificationService.resetUnreadCount();
    }

    this.notificationSyncSubscription = this.authService.isAuthenticated$.pipe(distinctUntilChanged(), switchMap(isAuthenticated => {
      if (!isAuthenticated) {
        return of(0);
      }
      return timer(0, 30_000).pipe(switchMap(() => this.notificationService.getUnreadCount().pipe(catchError(error => {
        console.error('Error refreshing notification count', error);
        return EMPTY;
      }))));
    })).subscribe(count => {
      this.notificationService.setUnreadCount(count);
    });

    this.backButtonListener = await CapacitorApp.addListener('backButton', ({ canGoBack }) => {
      if (this.showLoginModal || this.showSignupModal) {
        this.closeLoginOrSignupModalOnEscape();
        return;
      }

      if (this.mobileMenuOpen) {
        this.closeMobileMenu();
        return;
      }

      if (canGoBack) {
        window.history.back();
      } else {
        void CapacitorApp.exitApp();
      }
    });
  }

  ngOnDestroy(): void {
  void this.backButtonListener?.remove();
  this.authPromptSubscription.unsubscribe();
  this.notificationSyncSubscription?.unsubscribe();
  clearTimeout(this.authWarningTimeout);
}

  login() {
    this.dismissAuthWarning();
    this.showUserMenu = false;
    this.mobileMenuOpen = false;
    this.showLoginModal = true;
  }

  closeLoginModal(): void {
    this.showLoginModal = false;
  }

  signup() {
    this.dismissAuthWarning();
    this.showUserMenu = false;
    this.mobileMenuOpen = false;
    this.showSignupModal = true;
  }

  dismissAuthWarning(): void {
    this.showAuthWarning = false;
    clearTimeout(this.authWarningTimeout);
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
      this.notificationService.resetUnreadCount();
      this.authService.logout();
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

  isNotInLoginPage() {
    return this.router.url !== '/login';
  }

  navigateToProfile(): void {
    this.showUserMenu = false;
    this.mobileMenuOpen = false;
    this.router.navigate(['/edit-profile']);
  }

  navigateToMessages() {
    this.showUserMenu = false;
    this.mobileMenuOpen = false;
    this.router.navigate(['/messages']);
  }

  navigateToNotifications(): void {
    this.showUserMenu = false;
    this.mobileMenuOpen = false;
    this.router.navigate(['/notifications']);
  }

  search(event: Event): void {
    const value = (event.target as HTMLInputElement).value.trim();
    this.searchTerm = value;

    if (value.includes('http://') || value.includes('https://')) {
      this.apiUrl.setUrl(this.searchTerm);
    };
  }

  navigateToFindSitter(): void {
    this.showUserMenu = false;
    this.mobileMenuOpen = false;
    this.router.navigate(['/find-sitter']);
  }

  navigateToPetMarket(): void {
    this.showUserMenu = false;
    this.mobileMenuOpen = false;
    this.router.navigate(['/pet-market']);
  }

  navigateSitterDashboard(): void {
    this.showUserMenu = false;
    this.mobileMenuOpen = false;
    this.router.navigate(['/sitter-dashboard']);
  }

  navigateToBecomeSitter(): void {
    this.showUserMenu = false;
    this.mobileMenuOpen = false;
    this.router.navigate(['/become-sitter']);
  }

  navigateToMyBookings(): void {
    this.showUserMenu = false;
    this.mobileMenuOpen = false;
    this.router.navigate(['/my-bookings']);
  }
}
