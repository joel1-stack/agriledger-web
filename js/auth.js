// Auth state listener
if (typeof auth === 'undefined') {
  console.error('Firebase auth not initialized. Check firebase-config.js is present.');
}
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
      'poultry/batch-summary.html', 'profile.html', 'modules.html', 'notifications.html',
      'admin/dashboard.html', 'admin/approvals.html', 'admin/reports.html',
      'worker/dashboard.html', 'worker/history.html'];
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
async function registerUser(email, password, name, phone = '', farmName = '', businessUnit = 'Main Farm', role = 'general') {
  try {
    const result = await auth.createUserWithEmailAndPassword(email, password);
    // Create user profile with all fields matching mobile app UserModel
    await db.collection('users').doc(result.user.uid).set({
      email: email,
      name: name,
      phone: phone,
      role: role,
      farmName: farmName || name + "'s Farm",
      businessUnit: businessUnit || 'Main Farm',
      assignedUnits: [],
      moduleAccess: [],
      isActive: true,
      status: 'active',
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    });
    // Store complete user in session
    const userData = {
      id: result.user.uid,
      email: email,
      name: name,
      phone: phone,
      role: role,
      farmName: farmName || name + "'s Farm",
      businessUnit: businessUnit || 'Main Farm',
      assignedUnits: [],
      moduleAccess: [],
      isActive: true
    };
    sessionStorage.setItem('agriUser', JSON.stringify(userData));
    return { success: true, user: result.user, userData: userData };
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

function isGeneralUser() {
  return hasRole('general');
}

function isViewAdmin() {
  return hasRole('viewAdmin');
}

function isSuperAdmin() {
  return hasRole('superAdmin');
}

function isAdmin() {
  return isViewAdmin() || isSuperAdmin();
}

function canWrite() {
  return isGeneralUser() || isSuperAdmin();
}

function canRead() {
  return getCurrentUser() !== null;
}

// Get role badge HTML
function getRoleBadge(role) {
  const badges = {
    'general': '<span class="badge badge-green">General</span>',
    'viewAdmin': '<span class="badge badge-blue">View Only</span>',
    'superAdmin': '<span class="badge badge-purple">Admin</span>'
  };
  return badges[role] || '<span class="badge badge-gray">Unknown</span>';
}

// Check if current user can access a page based on role
function checkPageAccess(allowedRoles = ['general', 'viewAdmin', 'superAdmin']) {
  const user = getCurrentUser();
  if (!user) {
    window.location.href = 'login.html';
    return false;
  }
  if (!allowedRoles.includes(user.role)) {
    window.location.href = 'dashboard.html';
    return false;
  }
  return true;
}
