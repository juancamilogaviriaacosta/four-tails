
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { ApiUrlService } from '../utils/api-url.service';

export interface NotificationDto {
    id: number;
    title: string;
    body: string;
    type: string;
    read: boolean;
    readAt: string | null;
    actionUrl: string | null;
    referenceType: string | null;
    referenceId: number | null;
    createdAt: string;
}

@Injectable({
    providedIn: 'root'
})
export class NotificationService {

    private unreadCountSubject = new BehaviorSubject<number>(0);
    readonly unreadCount$ = this.unreadCountSubject.asObservable();

    constructor(private http: HttpClient, private apiUrl: ApiUrlService) {
    }

    getNotifications(): Observable<NotificationDto[]> {
        return this.http.get<NotificationDto[]>(
            `${this.apiUrl.apiUrl}/api/notifications/getNotifications`
        );
    }

    getUnreadCount(): Observable<number> {
        return this.http.get<number>(
            `${this.apiUrl.apiUrl}/api/notifications/getUnreadCount`
        );
    }

    refreshUnreadCount(): Observable<number> {
        return this.getUnreadCount().pipe(
            tap(count => this.unreadCountSubject.next(count))
        );
    }

    markAsRead(id: number, wasUnread = false): Observable<void> {
        return this.http.patch<void>(`${this.apiUrl.apiUrl}/api/notifications/${id}/read`, {}).pipe(tap(() => {
            if (wasUnread) {
                const current = this.unreadCountSubject.value;
                this.unreadCountSubject.next(Math.max(0, current - 1));
            }
        }));
    }

    setUnreadCount(count: number): void {
        this.unreadCountSubject.next(count);
    }

    resetUnreadCount(): void {
        this.unreadCountSubject.next(0);
    }

    refreshUnreadCountSilently(): void {
        this.getUnreadCount().subscribe({
            next: count => this.unreadCountSubject.next(count),
            error: error => console.error('Error refreshing notifications', error)
        });
    }
}
