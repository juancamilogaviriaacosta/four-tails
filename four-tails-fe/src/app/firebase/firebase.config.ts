import { FirebaseOptions, initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

export const firebaseConfig: FirebaseOptions = {
  apiKey: "AIzaSyBO5pCeG5fnFH0UJyZvI2ug19pypUUNW9s",
  authDomain: "copernicus-4tails.firebaseapp.com",
  projectId: "copernicus-4tails",
  storageBucket: "copernicus-4tails.firebasestorage.app",
  messagingSenderId: "642300847988",
  appId: "1:642300847988:web:56f0e9322d83e8be232e21",
  measurementId: "G-LN0NH41STQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const vapidKey = 'BMwnmkmx_SpkHKeJqlz498cfDxEysYd89zJWAF16rFtiMLCVF8vUVLycwhVS3KBLWQW8IyXoZ7DyAMLHd41zK2w';