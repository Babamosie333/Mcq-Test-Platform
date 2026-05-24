const API_BASE = '';

async function apiRequest(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data.error || 'Request failed');
    err.status = res.status;
    throw err;
  }
  return data;
}

async function checkAuth() {
  try {
    return await apiRequest('/api/admin/me');
  } catch {
    return null;
  }
}

async function requireAuth() {
  const admin = await checkAuth();
  if (!admin) {
    window.location.href = '/admin/login.html';
    return null;
  }
  return admin;
}

async function logout() {
  await apiRequest('/api/admin/logout', { method: 'POST' });
  window.location.href = '/admin/login.html';
}

function getQueryParam(name) {
  return new URLSearchParams(window.location.search).get(name);
}

function showAlert(container, message, type = 'error') {
  container.innerHTML = `<div class="alert alert-${type}">${message}</div>`;
}

function formatDate(d) {
  if (!d) return '-';
  return new Date(d).toLocaleString();
}
