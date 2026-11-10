import { Location } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationDto, NotificationService } from './notification.service';


interface NotificationItem extends NotificationDto {
  time: string;
  category: string;
}

@Component({
  selector: 'app-notifications',
  imports: [FormsModule],
  templateUrl: './notifications.html',
  styleUrl: './notifications.css',
})
export class Notifications {

  private notificationService = inject(NotificationService);
  private location = inject(Location);
  private router = inject(Router);

  notifications: NotificationItem[] = [];
  unreadCount = 0;

  activeFilter: 'all' | 'unread' = 'all';
  searchTerm = '';
  loading = false;

  constructor(private route: ActivatedRoute) {
    const notifications = this.route.snapshot.data['preload'].notifications as NotificationItem[];
    this.notifications = notifications.map(notification => ({
          ...notification,
          time: this.formatTime(notification.createdAt),
          category: this.getCategory(notification.type)
        }));
    this.unreadCount = this.route.snapshot.data['preload'].unreadCount;
  }

  get filteredNotifications(): NotificationItem[] {
    const search = this.searchTerm.trim().toLowerCase();

    return this.notifications.filter(notification => {
      const matchesFilter =
        this.activeFilter === 'all' || !notification.read;

      const matchesSearch =
        !search ||
        `${notification.title} ${notification.body} ${notification.category}`
          .toLowerCase()
          .includes(search);

      return matchesFilter && matchesSearch;
    });
  }

  openNotification(notification: NotificationItem): void {
    if (notification.read) {
      this.navigateToNotification(notification);
      return;
    }

    this.notificationService.markAsRead(notification.id).subscribe({
      next: () => {
        this.notifications = this.notifications.map(item =>
          item.id === notification.id
            ? { ...item, read: true, readAt: new Date().toISOString() }
            : item
        );

        this.unreadCount = Math.max(0, this.unreadCount - 1);

        this.navigateToNotification(notification);
      },
      error: (error) => {
        console.error('Error marking notification as read', error);
      }
    });
  }

  private navigateToNotification(notification: NotificationItem): void {
    if (notification.actionUrl) {
      this.router.navigateByUrl(notification.actionUrl);
    }
  }

  private getCategory(type: string): string {
    const categories: Record<string, string> = {
      BOOKING: 'Booking',
      MESSAGE: 'Messages',
      REVIEW: 'Reviews',
      PET: 'Community'
    };

    return categories[type] ?? 'General';
  }

  private formatTime(date: string): string {
    const timestamp = new Date(date).getTime();
    const diff = Math.max(0, Date.now() - timestamp);

    const minutes = Math.floor(diff / 60000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes} min ago`;

    const hours = Math.floor(minutes / 60);

    if (hours < 24) return `${hours} hours ago`;

    const days = Math.floor(hours / 24);

    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;

    return new Date(date).toLocaleDateString();
  }

  markAllAsRead(): void {
    // Pendiente de implementar endpoint en Spring Boot.
  }

  close(): void {
    this.location.back();
  }
}