// ===== AgriLedger Firebase Configuration =====
// Copy this file to firebase-config.js and fill in your real Firebase project values.
// firebase-config.js is gitignored and will NOT be committed to GitHub.

const firebaseConfig = {
  apiKey: "YOUR_WEB_API_KEY",
  authDomain: "agri-ledger-c427d.firebaseapp.com",
  projectId: "agri-ledger-c427d",
  storageBucket: "agri-ledger-c427d.firebasestorage.app",
  messagingSenderId: "522942087181",
  appId: "YOUR_WEB_APP_ID",
  measurementId: "G-XXXXXX"
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();

db.enablePersistence({ synchronizeTabs: true }).catch(function(err) {
  if (err.code === 'failed-precondition') {
    console.warn('Firestore persistence: multiple tabs open, persistence in one tab only.');
  } else if (err.code === 'unimplemented') {
    console.warn('Firestore persistence: browser not supported.');
  }
});

const Timestamp = firebase.firestore.Timestamp;
const FieldValue = firebase.firestore.FieldValue;
