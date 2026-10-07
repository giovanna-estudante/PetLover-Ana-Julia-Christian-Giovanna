import { initializeApp } from 'firebase/app';

import {
  initializeAuth,
  getReactNativePersistence,
} from 'firebase/auth';

import AsyncStorage from '@react-native-async-storage/async-storage';

import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyCAjje5ICh5PBd77C9LJSRPx3sM2yt-hGo',
  authDomain: 'petlover-634d0.firebaseapp.com',
  projectId: 'petlover-634d0',
  storageBucket: 'petlover-634d0.firebasestorage.app',
  messagingSenderId: '227010127165',
  appId: '1:227010127165:web:0f3c1c9b87678146049154',
};

const app = initializeApp(
  firebaseConfig
);

export const auth = initializeAuth(
  app,
  {
    persistence:
      getReactNativePersistence(
        AsyncStorage
      ),
  }
);

export const db =
  getFirestore(app);

export default app;