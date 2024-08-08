document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const username = document.getElementById('loginUsername').value;
  const password = document.getElementById('loginPassword').value;

  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  });

  if (response.ok) {
    const data = await response.json();
    document.cookie = `token=${data.token}; Path=/; max-age=${24 * 60 * 60}; `;
    console.log('Set cookie:', document.cookie); 
    window.location.href = `dashboard.html`;
  } else {
    alert('Invalid credentials');
  }
});

document.getElementById('signupForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const username = document.getElementById('signupUsername').value;
  const password = document.getElementById('signupPassword').value;

  const response = await fetch('/api/auth/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  });

  if (response.ok) {
    const data = await response.json();
    document.cookie = `token=${data.token}; Path=/; max-age=${24 * 60 * 60}; Secure`;
    window.location.href = `dashboard.html`;
  } else {
    alert('Error registering');
  }
});

document.getElementById('showSignup').addEventListener('click', () => {
  document.getElementById('loginForm').classList.add('d-none');
  document.getElementById('signupForm').classList.remove('d-none');
  document.getElementById('formHeader').textContent = 'Signup';
});

document.getElementById('showLogin').addEventListener('click', () => {
  document.getElementById('signupForm').classList.add('d-none');
  document.getElementById('loginForm').classList.remove('d-none');
  document.getElementById('formHeader').textContent = 'Login';
});
