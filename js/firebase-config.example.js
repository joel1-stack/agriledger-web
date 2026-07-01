// ===== AgriLedger Firebase Configuration =====
// Copy this file to firebase-config.js and fill in your real Firebase project values.
// firebase-config.js is gitignored and will NOT be committed to GitHub.

(function() {
  if (typeof firebase === 'undefined') {
    console.error('Firebase SDK not loaded. Check CDN scripts in your HTML.');
    return;
  }

  var firebaseConfig = {
    apiKey: "YOUR_WEB_API_KEY",
    authDomain: "agri-ledger-c427d.firebaseapp.com",
    projectId: "agri-ledger-c427d",
    storageBucket: "agri-ledger-c427d.firebasestorage.app",
    messagingSenderId: "522942087181",
    appId: "YOUR_WEB_APP_ID",
    measurementId: "G-XXXXXX"
  };

  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }

  window.auth = firebase.auth();
  window.db = firebase.firestore();

  window.db.enablePersistence({ synchronizeTabs: true }).catch(function(err) {
    if (err.code === 'failed-precondition') {
      console.warn('Firestore persistence: multiple tabs open, persistence in one tab only.');
    } else if (err.code === 'unimplemented') {
      console.warn('Firestore persistence: browser not supported.');
    }
  });

  window.Timestamp = firebase.firestore.Timestamp;
  window.FieldValue = firebase.firestore.FieldValue;
})();
