import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface NotificationDto {
    id: number;
    title: string;
    body: string;
    type: string;
    read: boolean;
    readAt: string;
    actionUrl: string;
    referenceType: string;
    referenceId: number,
    createdAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private http = inject(HttpClient);
  private readonly apiUrl = '/api/notifications';

  getNotifications(): Observable<NotificationDto[]> {
    return this.http.get<NotificationDto[]>(
      `${this.apiUrl}/getNotifications`
    );
  }

  getUnreadCount(): Observable<number> {
    return this.http.get<number>(
      `${this.apiUrl}/unread-count`
    );
  }

  markAsRead(id: number): Observable<void> {
    return this.http.patch<void>(
      `${this.apiUrl}/${id}/read`,
      {}
    );
  }
}