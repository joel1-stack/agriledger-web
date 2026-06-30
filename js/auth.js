// Auth state listener
let currentUser = null;
let userModel = null;

auth.onAuthStateChanged(async (user) => {
  if (user) {
    currentUser = user;
    // Load user profile from Firestore
    try {
      const doc = await db.collection('users').doc(user.uid).get();
      if (doc.exists) {
        userModel = { id: doc.id, ...doc.data() };
        // Store in session
        sessionStorage.setItem('agriUser', JSON.stringify(userModel));
        // Redirect if on auth page
        const authPages = ['login.html', 'register.html'];
        const currentPage = window.location.pathname.split('/').pop();
        if (authPages.includes(currentPage) || currentPage === '' || currentPage === 'index.html') {
          window.location.href = 'dashboard.html';
        }
      }
    } catch (err) {
      console.error('Error loading user profile:', err);
    }
  } else {
    currentUser = null;
    userModel = null;
    sessionStorage.removeItem('agriUser');
    const protectedPages = ['dashboard.html', 'inventory.html', 'cashbook.html', 'journal.html',
      'contracts.html', 'property.html', 'transport.html', 'reports.html', 'settings.html',
      'farming/crops.html', 'farming/livestock.html', 'farming/poultry.html', 'farming/dairy.html',
      'poultry/poultry-dashboard.html', 'poultry/farm-setup.html', 'poultry/flock-register.html',
      'poultry/production-log.html', 'poultry/sales.html', 'poultry/other-income.html',
      'poultry/feed-expenses.html', 'poultry/health-vet.html', 'poultry/mortality.html',
      'poultry/batch-summary.html'];
    const currentPage = window.location.pathname.split('/').pop();
    const currentPath = window.location.pathname;
    const isProtected = protectedPages.some(p => currentPath.includes(p));
    if (isProtected) {
      window.location.href = 'login.html';
    }
  }
});

// Get current user helper
function getCurrentUser() {
  if (userModel) return userModel;
  const stored = sessionStorage.getItem('agriUser');
  if (stored) {
    userModel = JSON.parse(stored);
    return userModel;
  }
  return null;
}

// Login
async function loginUser(email, password) {
  try {
    const result = await auth.signInWithEmailAndPassword(email, password);
    return { success: true, user: result.user };
  } catch (error) {
    let message = 'Login failed';
    switch (error.code) {
      case 'auth/user-not-found': message = 'No account found with this email'; break;
      case 'auth/wrong-password': message = 'Incorrect password'; break;
      case 'auth/invalid-email': message = 'Invalid email address'; break;
      case 'auth/too-many-requests': message = 'Too many attempts. Try again later'; break;
      default: message = error.message;
    }
    return { success: false, error: message };
  }
}

// Register
async function registerUser(email, password, name, phone = '') {
  try {
    const result = await auth.createUserWithEmailAndPassword(email, password);
    // Create user profile
    await db.collection('users').doc(result.user.uid).set({
      email: email,
      name: name,
      phoneNumber: phone,
      role: 'general',
      businessUnit: 'Main Farm',
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });
    return { success: true, user: result.user };
  } catch (error) {
    let message = 'Registration failed';
    switch (error.code) {
      case 'auth/email-already-in-use': message = 'Email already registered'; break;
      case 'auth/weak-password': message = 'Password must be at least 6 characters'; break;
      case 'auth/invalid-email': message = 'Invalid email address'; break;
      default: message = error.message;
    }
    return { success: false, error: message };
  }
}

// Logout
async function logoutUser() {
  try {
    await auth.signOut();
    sessionStorage.removeItem('agriUser');
    window.location.href = 'login.html';
    return true;
  } catch (error) {
    console.error('Logout error:', error);
    return false;
  }
}

// Check role
function hasRole(...roles) {
  const user = getCurrentUser();
  return user && roles.includes(user.role);
}

function canWrite() {
  const user = getCurrentUser();
  return user && (user.role === 'general' || user.role === 'superAdmin');
}

function isSuperAdmin() {
  return hasRole('superAdmin');
}
