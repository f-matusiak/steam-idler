document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementsByTagName('input')[0];
  input.addEventListener('click', (e) => {
    e.preventDefault();
    window.location.replace('/login');
  })
})