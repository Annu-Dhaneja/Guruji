import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, signInAnonymously } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

// Validate required Firebase configuration
if (!firebaseConfig || !firebaseConfig.projectId || !firebaseConfig.apiKey) {
  throw new Error(
    'Firebase Configuration Error: Required fields (projectId, apiKey) are missing in firebase-applet-config.json. Firestore CMS cannot function without valid Firebase configuration.'
  );
}

if (firebaseConfig.projectId.startsWith('demo-')) {
  throw new Error(
    'Firebase Configuration Error: Demo project ID detected. A real Firebase project ID is required for production Firestore CMS persistence.'
  );
}

// Initialize Firebase App
export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Authentication
export const auth = getAuth(app);

// Initialize Cloud Firestore with dedicated databaseId
export const db = firebaseConfig.firestoreDatabaseId
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

// Attempt non-blocking anonymous sign-in to satisfy auth rules
signInAnonymously(auth).catch((err) => {
  // Silent fallback if anonymous auth isn't toggled in Firebase Console
  console.debug('[Firebase] Anonymous auth status:', err?.message || err);
});

export default app;
