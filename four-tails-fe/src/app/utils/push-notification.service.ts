
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Capacitor } from '@capacitor/core';
import { PushNotifications } from '@capacitor/push-notifications';
import { firstValueFrom } from 'rxjs';
import { ApiUrlService } from '../utils/api-url.service';
import { NotificationService } from '../notifications/notification.service';
import { LocalNotifications } from '@capacitor/local-notifications';
import { AuthService } from './auth-service';

@Injectable({
    providedIn: 'root'
}) export class PushNotificationService {
    private initialized = false;
    private deviceToken: string | null = null;
    private readonly registeredDevices = new Set<string>();
    private readonly registeringDevices = new Set<string>();

    constructor(
        private http: HttpClient,
        private apiUrl: ApiUrlService,
        private router: Router,
        private notificationService: NotificationService,
        private authService: AuthService
    ) { }

    async initialize(): Promise<void> {
        if (!Capacitor.isNativePlatform() || Capacitor.getPlatform() !== 'android') {
            return;
        }
        if (this.initialized) {
            return;
        }
        try {
            await PushNotifications.addListener('registration', async token => {
                console.log('FCM Android token:', token.value);
                this.deviceToken = token.value;
                await this.registerDevice(token.value);
            });
            await PushNotifications.addListener('registrationError', error => {
                console.error('FCM registration error:', error);
            });
            await LocalNotifications.createChannel({
                id: '4tails_notifications',
                name: 'Notificaciones 4Tails',
                description: 'Reservas y actualizaciones de 4Tails',
                importance: 5,
                visibility: 1,
                vibration: true,
                lights: true
            });
            await PushNotifications.addListener('pushNotificationReceived', async notification => {
                console.log('Android foreground notification:', JSON.stringify(notification));
                this.notificationService.refreshUnreadCountSilently();
                const data = notification.data ?? {};
                const title = data['title'] || notification.title || '4Tails';
                const body = data['body'] || notification.body || 'You have a new notification';
                const actionUrl = data['url'] || data['actionUrl'] || '/';
                try {
                    await LocalNotifications.schedule({
                        notifications: [{
                            id: Date.now() % 2147483647,
                            title,
                            body,
                            schedule: {
                                at: new Date(Date.now() + 1000)
                            },
                            extra: {
                                actionUrl
                            }
                        }]
                    });
                } catch (error) {
                    console.error('Error displaying local notification:', error);
                }
            });
            await LocalNotifications.addListener('localNotificationActionPerformed', action => {
                const actionUrl = action.notification.extra?.['actionUrl'];
                if (typeof actionUrl === 'string' && actionUrl.startsWith('/')) {
                    this.router.navigateByUrl(actionUrl);
                }
                this.notificationService.refreshUnreadCountSilently();
            });
            await PushNotifications.addListener('pushNotificationActionPerformed', action => {
                console.log('Android notification action:', action);
                const actionUrl = action.notification.data?.['url'] || action.notification.data?.['actionUrl'];
                if (typeof actionUrl === 'string' && actionUrl.startsWith('/')) {
                    this.router.navigateByUrl(actionUrl);
                }
                this.notificationService.refreshUnreadCountSilently();
            });
            this.authService.isAuthenticated$.subscribe(isAuthenticated => {
                if (!isAuthenticated) {
                    return;
                }
                if (this.deviceToken) {
                    void this.registerDevice(this.deviceToken);
                }
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
            this.initialized = true;
        } catch (error) {
            this.initialized = false;
            console.error('Error initializing Android push notifications:', error);
        }
    }

    private async registerDevice(token: string): Promise<void> {
        if (!this.authService.isLoggedIn()) {
            return;
        }

        const registrationKey = `${this.authService.getUserId()}:${token}`;
        if (this.registeredDevices.has(registrationKey) || this.registeringDevices.has(registrationKey)) {
            return;
        }

        this.registeringDevices.add(registrationKey);
        try {
            await firstValueFrom(this.http.post(`${this.apiUrl.apiUrl}/api/devices/register`, {
                token,
                platform: 'ANDROID'
            }));
            this.registeredDevices.add(registrationKey);
            console.log('Android device registered successfully');
        } catch (error) {
            console.error('Error registering Android device:', error);
        } finally {
            this.registeringDevices.delete(registrationKey);
        }
    }
}