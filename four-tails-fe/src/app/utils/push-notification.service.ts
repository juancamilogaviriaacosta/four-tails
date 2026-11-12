
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Capacitor } from '@capacitor/core';
import { PushNotifications } from '@capacitor/push-notifications';
import { firstValueFrom } from 'rxjs';
import { ApiUrlService } from '../utils/api-url.service';
import { NotificationService } from '../notifications/notification.service';

@Injectable({
    providedIn: 'root'
}) export class PushNotificationService {
    private initialized = false;
    constructor(private http: HttpClient, private apiUrl: ApiUrlService, private router: Router, private notificationService: NotificationService) { }
    async initialize(): Promise<void> {
        if (!Capacitor.isNativePlatform() || Capacitor.getPlatform() !== 'android') {
            return;
        }
        if (this.initialized) {
            return;
        }
        this.initialized = true;
        try {
            await PushNotifications.addListener('registration', async token => {
                console.log('FCM Android token:', token.value);
                try {
                    await firstValueFrom(this.http.post(`${this.apiUrl.apiUrl}/api/devices/register`, {
                        token: token.value,
                        platform: 'ANDROID'
                    }));
                    console.log('Android device registered successfully');
                } catch (error) {
                    console.error('Error registering Android device:', error);
                }
            });
            await PushNotifications.addListener('registrationError', error => {
                console.error('FCM registration error:', error);
            });
            await PushNotifications.addListener('pushNotificationReceived', notification => {
                console.log('Android foreground notification:', notification);
                this.notificationService.refreshUnreadCountSilently();
            });
            await PushNotifications.addListener('pushNotificationActionPerformed', action => {
                console.log('Android notification action:', action);
                const actionUrl = action.notification.data?.['actionUrl'];
                if (typeof actionUrl === 'string' && actionUrl.startsWith('/')) {
                    this.router.navigateByUrl(actionUrl);
                }
                this.notificationService.refreshUnreadCountSilently();
            });
            let permission = await PushNotifications.checkPermissions();
            if (permission.receive === 'prompt' || permission.receive === 'prompt-with-rationale') {
                permission = await PushNotifications.requestPermissions();
            }
            if (permission.receive !== 'granted') {
                console.warn('Android notification permission not granted');
                return;
            }
            await PushNotifications.register();
            console.log('Android push notification registration requested');
        } catch (error) {
            this.initialized = false;
            console.error('Error initializing Android push notifications:', error);
        }
    }
}