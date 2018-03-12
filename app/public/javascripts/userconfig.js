document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('submit').addEventListener('click', (e) => {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    $.post(`${window.location.pathname}/update`, { username, password }, (res) => {
      if (res.success) {
        window.location.reload();
      } else {
        showError(res);
      }
    })
  })
})

const showError = (err) => {
  console.log(err);
};