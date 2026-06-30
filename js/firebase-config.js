// Firebase Configuration
// Get your API key and App ID from Firebase Console > Project Settings > General > Your apps > Web app
const firebaseConfig = {
  apiKey: "YOUR_WEB_API_KEY", // <-- REPLACE with your Web API key from Firebase Console
  authDomain: "agri-ledger-c427d.firebaseapp.com",
  projectId: "agri-ledger-c427d",
  storageBucket: "agri-ledger-c427d.appspot.com",
  messagingSenderId: "522942087181",
  appId: "YOUR_WEB_APP_ID" // <-- REPLACE with your Web App ID from Firebase Console
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();

// Enable offline persistence
db.enablePersistence({ synchronizeTabs: true }).catch(err => {
  console.warn('Firestore persistence:', err.message);
});

// Set timestamp behavior
const Timestamp = firebase.firestore.Timestamp;
const FieldValue = firebase.firestore.FieldValue;
