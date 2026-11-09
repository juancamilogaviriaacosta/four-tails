import { Injectable } from '@angular/core';

import {
  getToken,
  onMessage
} from 'firebase/messaging';

import { getFirebaseMessaging } from './firebase';
import { vapidKey } from './firebase.config';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirebaseNotificationService {

  constructor(private http: HttpClient) {
  }

  async enableNotifications(): Promise<void> {
    const token = await this.requestPermissionAndGetToken();
    if (!token) {
      return;
    }

    await firstValueFrom(this.http.post('/api/devices/register', { token, platform: 'WEB'}));
    console.log('Device registered successfully');
  }

  async requestPermissionAndGetToken(): Promise<string | null> {

    if (!('Notification' in window)) {
      return null;
    }

    const permission = await Notification.requestPermission();

    if (permission !== 'granted') {
      return null;
    }

    const messaging = await getFirebaseMessaging();

    if (!messaging) {
      return null;
    }

    const registration = await navigator.serviceWorker.register(
      '/firebase-messaging-sw.js'
    );

    const token = await getToken(messaging, {
      vapidKey,
      serviceWorkerRegistration: registration
    });

    return token || null;
  }

  async listenForegroundMessages(): Promise<void> {

    const messaging = await getFirebaseMessaging();

    if (!messaging) {
      return;
    }

    onMessage(messaging, (payload) => {
      console.log('Foreground notification:', payload);
    });
  }
}