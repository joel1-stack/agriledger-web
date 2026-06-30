// Load Firebase config from gitignored config.js
if (typeof FIREBASE_CONFIG === 'undefined' || !FIREBASE_CONFIG.apiKey || FIREBASE_CONFIG.apiKey === 'YOUR_WEB_API_KEY') {
  console.error('%c⚠️ AgriLedger: Firebase not configured!', 'font-size:16px;font-weight:bold;color:red;');
  console.error('%cCopy js/config.example.js to js/config.js and fill in your Firebase project values.', 'font-size:14px;color:#F5A623;');
}

const firebaseConfig = typeof FIREBASE_CONFIG !== 'undefined' ? FIREBASE_CONFIG : {
  apiKey: "missing",
  authDomain: "missing",
  projectId: "missing",
  storageBucket: "missing",
  messagingSenderId: "missing",
  appId: "missing"
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();

// Enable offline persistence
db.enablePersistence({ synchronizeTabs: true }).catch(function(err) {
  if (err.code === 'failed-precondition') {
    console.warn('Firestore persistence: multiple tabs open, persistence in one tab only.');
  } else if (err.code === 'unimplemented') {
    console.warn('Firestore persistence: browser not supported.');
  }
});

const Timestamp = firebase.firestore.Timestamp;
const FieldValue = firebase.firestore.FieldValue;
