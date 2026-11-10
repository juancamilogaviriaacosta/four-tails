import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { forkJoin } from 'rxjs';
import { NotificationService } from './notification.service';

export const notificationsResolver: ResolveFn<any> = () => {
    const notificationService = inject(NotificationService);
    return forkJoin({
        notifications: notificationService.getNotifications(),
        unreadCount: notificationService.getUnreadCount()
    });
};