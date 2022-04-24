import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyAvw2TENVSuTjgOyW69AH3tqjwhoX8FVfg',
  authDomain: 'talkin-project.firebaseapp.com',
  projectId: 'talkin-project',
  storageBucket: 'talkin-project.appspot.com',
  messagingSenderId: '760899861952',
  appId: '1:760899861952:web:e427ea4a7b2aac0626dc25',
  measurementId: 'G-1JBR6LJBCD',
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
