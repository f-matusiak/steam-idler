document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('submit').addEventListener('click', (e) => {
    e.preventDefault();

    const steamID64 = document.getElementsByTagName('input')[0].value;
    console.log(steamID64);
    $.post(`${window.location.pathname}/setid`, { steamID64: steamID64 }, (res) => {
      console.log(res);
    })
  })
  document.getElementById('update').addEventListener('click', (e) => {
    e.preventDefault();
    $.post(`${window.location.pathname}/update`, {}, (res) => {
      console.log(res);
    })
  })
})