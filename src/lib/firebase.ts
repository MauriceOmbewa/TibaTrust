import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyBEqdt6DX8T8-TLEWgb1vs5ivQNeiMxxSU",
  authDomain: "tibatrust.firebaseapp.com",
  projectId: "tibatrust",
  storageBucket: "tibatrust.firebasestorage.app",
  messagingSenderId: "619333466668",
  appId: "1:619333466668:web:539d0f05ea678a1efbaf89",
  measurementId: "G-0BTSED72FG"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const analytics = getAnalytics(app);
export default app;