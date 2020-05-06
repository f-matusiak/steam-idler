document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("submit").addEventListener("click", (e) => {
    e.preventDefault();

    const steamID64 = document.getElementsByTagName("input")[0].value;

    $.post(
      `${window.location.pathname}/setid`,
      { steamID64: steamID64 },
      (res) => {
        if (res.success) {
          console.log(res);
          window.location.reload();
        } else {
          showError(res);
        }
      }
    );
  });
  document.getElementById("update").addEventListener("click", (e) => {
    e.preventDefault();
    $.post(`${window.location.pathname}/update`, (res) => {
      if (res.success) {
        window.location.reload();
      } else {
        showError(res);
      }
    });
  });
});

const showError = (err) => {
  console.log(err);
};
