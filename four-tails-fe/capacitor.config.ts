import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'co.com.ftails',
  appName: 'Four Tails',
  webDir: 'dist/four-tails-fe/browser',
  plugins: { PushNotifications: { presentationOptions: ['alert', 'sound'] } }
};

export default config;
