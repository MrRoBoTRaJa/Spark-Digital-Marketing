# Firebase Backend Setup

This website is ready for Firebase Cloud Firestore.

## Steps

1. Open Firebase Console: https://console.firebase.google.com/
2. Create a project.
3. Go to Build > Firestore Database.
4. Create database.
5. Go to Project settings > General > Your apps.
6. Add a Web app.
7. Copy the Firebase config.
8. Open `assets/js/firebase-config.js`.
9. Paste the config values and set:

```js
enabled: true
```

## Firestore Collections Used

- `serviceRequests`
- `smmOrders`
- `siteSettings`

## Temporary Rules For Testing

Use these only while testing:

```txt
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

For real production security, use Firebase Authentication and stricter rules.
