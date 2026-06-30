// ===== FORMATTING =====
function formatCurrency(amount) {
  return 'KSh ' + Number(amount).toLocaleString('en-KE', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
}

function formatDate(date) {
  if (!date) return '';
  if (typeof date === 'string') date = new Date(date);
  if (date.toDate) date = date.toDate();
  return date.toLocaleDateString('en-KE', { day: '2-digit', month: 'short', year: 'numeric' });
}

function formatTime(date) {
  if (!date) return '';
  if (typeof date === 'string') date = new Date(date);
  if (date.toDate) date = date.toDate();
  return date.toLocaleTimeString('en-KE', { hour: '2-digit', minute: '2-digit' });
}

function formatDateTime(date) {
  return formatDate(date) + ' ' + formatTime(date);
}

function formatNumber(num, decimals = 0) {
  return Number(num).toLocaleString('en-KE', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

function formatPercent(frac, decimals = 1) {
  return (frac * 100).toFixed(decimals) + '%';
}

// ===== TOAST NOTIFICATIONS =====
function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) {
    const div = document.createElement('div');
    div.id = 'toast-container';
    div.className = 'toast-container';
    document.body.appendChild(div);
  }
  const toast = document.createElement('div');
  toast.className = 'toast toast-' + type;
  const icons = { success: '✅', error: '❌', warning: '⚠️', info: 'ℹ️' };
  toast.innerHTML = '<span>' + (icons[type] || 'ℹ️') + '</span> ' + message;
  document.getElementById('toast-container').appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(50px)';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// ===== LOADING OVERLAY =====
function showLoading(show = true) {
  let overlay = document.getElementById('loading-overlay');
  if (show) {
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'loading-overlay';
      overlay.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(255,255,255,0.8);display:flex;align-items:center;justify-content:center;z-index:9999;';
      overlay.innerHTML = '<div style="text-align:center"><div class="loading-spinner"></div><p style="margin-top:12px;color:#6B7280;font-size:14px;">Loading...</p></div>';
      document.body.appendChild(overlay);
    }
    overlay.style.display = 'flex';
  } else {
    if (overlay) overlay.style.display = 'none';
  }
}

// ===== MODAL =====
function openModal(contentHtml, title = '') {
  const existing = document.querySelector('.modal-overlay');
  if (existing) existing.remove();
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.innerHTML = `
    <div class="modal-content">
      <div class="modal-header">
        <h2>${title}</h2>
        <button class="modal-close" onclick="closeModal()">&times;</button>
      </div>
      <div class="modal-body">${contentHtml}</div>
    </div>
  `;
  document.body.appendChild(overlay);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal();
  });
}

function closeModal() {
  const overlay = document.querySelector('.modal-overlay');
  if (overlay) overlay.remove();
}

// ===== SIDEBAR =====
function initSidebar() {
  const toggle = document.getElementById('sidebar-toggle');
  const sidebar = document.getElementById('sidebar');
  if (toggle && sidebar) {
    toggle.addEventListener('click', () => {
      if (window.innerWidth <= 640) {
        sidebar.classList.toggle('open');
      } else {
        sidebar.classList.toggle('collapsed');
        document.querySelector('.main-content')?.classList.toggle('expanded');
      }
    });
  }
  // Sub-nav toggles
  document.querySelectorAll('.nav-item.has-sub').forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const sub = item.nextElementSibling;
      if (sub && sub.classList.contains('sub-nav')) {
        sub.classList.toggle('open');
        item.querySelector('.nav-arrow')?.classList.toggle('open');
      }
    });
  });
  // Highlight active page
  const currentPath = window.location.pathname;
  document.querySelectorAll('.sidebar-nav a').forEach(a => {
    const href = a.getAttribute('href');
    if (href && currentPath.includes(href)) {
      a.classList.add('active');
    }
  });
}

// ===== LOAD USER IN SIDEBAR =====
function loadSidebarUser() {
  const user = getCurrentUser();
  if (user) {
    const nameEls = document.querySelectorAll('.sidebar-user-name');
    const roleEls = document.querySelectorAll('.sidebar-user-role');
    const avatarEls = document.querySelectorAll('.user-avatar-text');
    nameEls.forEach(el => el.textContent = user.name || user.email);
    roleEls.forEach(el => { if (typeof getRoleBadge === 'function') { el.innerHTML = getRoleBadge(user.role || 'general'); } else { el.textContent = user.role || 'general'; } });
    avatarEls.forEach(el => el.textContent = (user.name || user.email)[0].toUpperCase());
  }
}

// ===== GENERATE ID =====
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}

// ===== DEBOUNCE =====
function debounce(fn, delay = 300) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

// ===== DATA HELPERS =====
function calculateHenDay(eggs, flockSize) {
  if (!flockSize || flockSize === 0) return 0;
  return (eggs / flockSize) * 100;
}

function calculateTrays(eggs) {
  return eggs / 30;
}

function calculateNetProfit(income, expenses) {
  return income - expenses;
}

// ===== TABLE SORT =====
function sortTable(table, colIndex, numeric = false) {
  const tbody = table.querySelector('tbody');
  if (!tbody) return;
  const rows = Array.from(tbody.querySelectorAll('tr'));
  const isAsc = table.dataset.sortCol == colIndex && table.dataset.sortDir === 'asc';
  rows.sort((a, b) => {
    let aVal = a.cells[colIndex]?.textContent.trim() || '';
    let bVal = b.cells[colIndex]?.textContent.trim() || '';
    if (numeric) {
      aVal = parseFloat(aVal.replace(/[^0-9.-]/g, '')) || 0;
      bVal = parseFloat(bVal.replace(/[^0-9.-]/g, '')) || 0;
      return isAsc ? aVal - bVal : bVal - aVal;
    }
    return isAsc ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
  });
  rows.forEach(row => tbody.appendChild(row));
  table.dataset.sortCol = colIndex;
  table.dataset.sortDir = isAsc ? 'desc' : 'asc';
}

// ===== INIT ON PAGE LOAD =====
document.addEventListener('DOMContentLoaded', () => {
  initSidebar();
  loadSidebarUser();
});
