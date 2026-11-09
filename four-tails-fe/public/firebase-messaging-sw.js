importScripts(
  'https://www.gstatic.com/firebasejs/13.2.0/firebase-app-compat.js'
);

importScripts(
  'https://www.gstatic.com/firebasejs/13.2.0/firebase-messaging-compat.js'
);

firebase.initializeApp({
  apiKey: "AIzaSyBO5pCeG5fnFH0UJyZvI2ug19pypUUNW9s",
  authDomain: "copernicus-4tails.firebaseapp.com",
  projectId: "copernicus-4tails",
  storageBucket: "copernicus-4tails.firebasestorage.app",
  messagingSenderId: "642300847988",
  appId: "1:642300847988:web:56f0e9322d83e8be232e21",
  measurementId: "G-LN0NH41STQ"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const title = payload.data?.title || '4Tails';

  self.registration.showNotification(title, {
    body: payload.data?.body || '',
    icon: '/assets/icons/icon-192x192.png',
    data: {
      url: payload.data?.url || '/'
    }
  });
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const url = event.notification.data?.url || '/';

  event.waitUntil(
    clients.openWindow(url)
  );
});