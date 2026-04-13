import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getAnalytics, isSupported } from 'firebase/analytics';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyBvDgU-BmIvzoE184f8vw4EfjqvL7WIhB8',
  authDomain: 'presskit-generator.firebaseapp.com',
  projectId: 'presskit-generator',
  storageBucket: 'presskit-generator.firebasestorage.app',
  messagingSenderId: '862365271178',
  appId: '1:862365271178:web:f408f70871c31050491973',
  measurementId: 'G-GBCWWD9J7Y',
};

const app = initializeApp(firebaseConfig);

let analytics = null;
if (typeof window !== 'undefined') {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  });
}

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();
export { analytics };
