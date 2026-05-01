// Firebase setup:
// 1. Create a Firebase project.
// 2. Enable Cloud Firestore.
// 3. Add a Web app in Firebase and paste its config below.
// 4. Set enabled to true.
export const firebaseSettings = {
  enabled: false,
  config: {
    apiKey: "PASTE_FIREBASE_API_KEY",
    authDomain: "PASTE_PROJECT_ID.firebaseapp.com",
    projectId: "PASTE_PROJECT_ID",
    storageBucket: "PASTE_PROJECT_ID.firebasestorage.app",
    messagingSenderId: "PASTE_SENDER_ID",
    appId: "PASTE_APP_ID"
  }
};
