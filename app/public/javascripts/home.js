document.addEventListener('DOMContentLoaded', () => {
  const inputs = document.getElementsByTagName('input');
  if (document.cookie.indexOf('token') !== -1) {
    inputs[0].style.display = 'none';
    inputs[1].style.display = 'none';
    inputs[2].style.display = 'block';
  } else {
    inputs[0].style.display = 'block';
    inputs[1].style.display = 'block';
    inputs[2].style.display = 'none';
  }
  inputs[0].addEventListener('click', (e) => {
    e.preventDefault();
    window.location.replace('/login');
  });
  inputs[1].addEventListener('click', (e) => {
    e.preventDefault();
    window.location.replace('/register');
  });
  inputs[2].addEventListener('click', (e) => {
    e.preventDefault();
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    window.location.reload();
  });
})