const token = localStorage.getItem('token');
const user = JSON.parse(localStorage.getItem('user') || '{}');

if (!token) window.location.href = 'login.html';

document.getElementById('welcomeMsg').innerHTML =
  `Welcome, <strong>${user.name}</strong> <span class="role-badge">${user.role}</span>`;

// Show links based on role
const links = document.getElementById('roleLinks');
const btnStyle = 'display:block;width:100%;padding:0.7rem;margin-bottom:0.5rem;background:#1e40af;color:white;border:none;border-radius:8px;cursor:pointer;font-size:1rem;';

if (user.role === 'admin') {
  links.innerHTML += `<button style="${btnStyle}" onclick="goTo('admin')">Admin Panel</button>`;
}
if (user.role === 'manager') {
  links.innerHTML += `<button style="${btnStyle}" onclick="goTo('manager')">Manager Panel</button>`;
}
links.innerHTML += `<button style="${btnStyle}" onclick="goTo('profile')">My Profile</button>`;

async function goTo(route) {
  const res = await fetch(`http://localhost:3000/api/${route}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  alert(JSON.stringify(data, null, 2));
}

function logout() {
  localStorage.clear();
  window.location.href = 'login.html';
}
