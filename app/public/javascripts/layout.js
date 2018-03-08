addEventListener("DOMContentLoaded", () => {
  setTimeout(hideURLbar, 0);
  const logoff = document.getElementById('logoff');
  const login = document.getElementById('login');
  if (document.cookie.indexOf('token') !== -1) {
    login.style.display = 'none';
    logoff.style.display = 'block';
  } else {
    login.style.display = 'block';
    logoff.style.display = 'none';
  }

  logoff.addEventListener('click', (e) => {
    e.preventDefault();
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    window.location.replace('/');
  });
}, false);

function hideURLbar() { window.scrollTo(0, 1); }