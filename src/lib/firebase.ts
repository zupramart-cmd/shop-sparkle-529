import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyAx8WE9-Knq3d7Dya-JWIqzhLRz5u92Dr8",
  authDomain: "bitqraft.firebaseapp.com",
  projectId: "bitqraft",
  storageBucket: "bitqraft.firebasestorage.app",
  messagingSenderId: "267273941210",
  appId: "1:267273941210:web:9128ff2168dca5849835e3"
};
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;
