document.addEventListener('DOMContentLoaded', () => {
  const inputs = document.getElementsByTagName('input');
  inputs[0].addEventListener('click', (e) => {
    e.preventDefault();
    window.location.replace('/login');
  });
  inputs[1].addEventListener('click', (e) => {
    e.preventDefault();
    window.location.replace('/register');
  });
})