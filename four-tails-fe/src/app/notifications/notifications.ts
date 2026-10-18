import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface NotificationItem {
  id: number;
  title: string;
  description: string;
  time: string;
  category: string;
  type: 'booking' | 'message' | 'review' | 'pet';
  read: boolean;
}

@Component({
  selector: 'app-notifications',
  imports: [FormsModule],
  templateUrl: './notifications.html',
  styleUrl: './notifications.css',
})
export class Notifications {
  notifications: NotificationItem[] = [
    {
      id: 1,
      title: 'New booking request',
      description: 'Alex Morgan would like you to care for Milo this weekend.',
      time: '5 min ago',
      category: 'Booking',
      type: 'booking',
      read: false,
    },
    {
      id: 2,
      title: 'You have a new message',
      description: 'Jamie: Thanks for the update! Luna is doing great.',
      time: '28 min ago',
      category: 'Messages',
      type: 'message',
      read: false,
    },
    {
      id: 3,
      title: 'Your booking is confirmed',
      description: 'Your stay with Charlie is confirmed for 21-23 June.',
      time: '2 hours ago',
      category: 'Booking',
      type: 'booking',
      read: false,
    },
    {
      id: 4,
      title: 'A new review is in',
      description: 'Taylor left a review after your walk with Pepper.',
      time: 'Yesterday',
      category: 'Reviews',
      type: 'review',
      read: true,
    },
    {
      id: 5,
      title: 'A new friend joined Four Tails',
      description: 'Meet Maple, a playful border collie looking for a sitter.',
      time: '2 days ago',
      category: 'Community',
      type: 'pet',
      read: true,
    },
  ];
  activeFilter: 'all' | 'unread' = 'all';
  searchTerm = '';

  constructor(private location: Location) {}

  get unreadCount(): number {
    return this.notifications.filter((notification) => !notification.read).length;
  }

  get filteredNotifications(): NotificationItem[] {
    const search = this.searchTerm.trim().toLowerCase();

    return this.notifications.filter((notification) => {
      const matchesFilter = this.activeFilter === 'all' || !notification.read;
      const matchesSearch = !search || `${notification.title} ${notification.description} ${notification.category}`
        .toLowerCase()
        .includes(search);

      return matchesFilter && matchesSearch;
    });
  }

  markAllAsRead(): void {
    this.notifications = this.notifications.map((notification) => ({ ...notification, read: true }));
  }

  close(): void {
    this.location.back();
  }
}
