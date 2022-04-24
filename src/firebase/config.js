import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyA3iB-yIRmmqS--NzOYEWROTSuF9eFIHwg',
  authDomain: 'firechat-app-c285e.firebaseapp.com',
  projectId: 'firechat-app-c285e',
  storageBucket: 'firechat-app-c285e.appspot.com',
  messagingSenderId: '90530949574',
  appId: '1:90530949574:web:b8194db42eedda484d6ac7',
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
