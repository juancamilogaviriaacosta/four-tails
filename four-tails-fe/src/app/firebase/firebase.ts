import { initializeApp } from 'firebase/app';
import { getMessaging, isSupported } from 'firebase/messaging';
import { firebaseConfig } from './firebase.config';

export const firebaseApp = initializeApp(firebaseConfig);

export async function getFirebaseMessaging() {
  if (await isSupported()) {
    return getMessaging(firebaseApp);
  }

  return null;
}