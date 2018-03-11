document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('update').addEventListener('click', (e) => {
    e.preventDefault();

    $.post(`${window.location.pathname}/update`, (res) => {
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
}