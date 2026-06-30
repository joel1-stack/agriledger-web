// Firebase Configuration - Web SDK v8 (namespaced)
const firebaseConfig = {
  apiKey: "REPLACED_API_KEY",
  authDomain: "agri-ledger-c427d.firebaseapp.com",
  projectId: "agri-ledger-c427d",
  storageBucket: "agri-ledger-c427d.firebasestorage.app",
  messagingSenderId: "522942087181",
  appId: "1:522942087181:web:0b181a0a0f456b08d4d544",
  measurementId: "G-DFNS0P5WMH"
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
