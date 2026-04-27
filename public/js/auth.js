const API = 'http://localhost:3000/api';

async function register() {
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const role = document.getElementById('role').value;
  const msg = document.getElementById('msg');

  try {
    const res = await fetch(`${API}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, role }),
    });
    const data = await res.json();

    if (res.ok) {
      msg.className = 'message success';
      msg.textContent = 'Registered! Scan this QR code with your authenticator app:';
      document.getElementById('qrContainer').innerHTML =
        `<img src="${data.qrCode}" alt="QR Code" width="200">`;
      setTimeout(() => window.location.href = 'login.html', 8000);
    } else {
      msg.className = 'message error';
      msg.textContent = data.message;
    }
  } catch (e) {
    msg.className = 'message error';
    msg.textContent = 'Connection error.';
  }
}

async function login() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const msg = document.getElementById('msg');

  try {
    const res = await fetch(`${API}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();

    if (res.ok) {
      sessionStorage.setItem('userId', data.userId);
      window.location.href = 'verify2fa.html';
    } else {
      msg.className = 'message error';
      msg.textContent = data.message;
    }
  } catch (e) {
    msg.className = 'message error';
    msg.textContent = 'Connection error.';
  }
}

async function verify2FA() {
  const code = document.getElementById('code').value;
  const userId = sessionStorage.getItem('userId');
  const msg = document.getElementById('msg');

  try {
    const res = await fetch(`${API}/auth/verify-2fa`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, token: code }),
    });
    const data = await res.json();

    if (res.ok) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      window.location.href = 'dashboard.html';
    } else {
      msg.className = 'message error';
      msg.textContent = data.message;
    }
  } catch (e) {
    msg.className = 'message error';
    msg.textContent = 'Connection error.';
  }
}
