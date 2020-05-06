document.addEventListener("DOMContentLoaded", () => {
  $("#authlogin").on("submit", (e) => {
    e.preventDefault();

    const auth = document.getElementById("auth").value;
    $.post(`${window.location.pathname}/login`, { auth }, (res) => {
      if (res.success) {
        window.location.reload();
      } else {
        showError(res);
      }
    });
    return false;
  });

  document.getElementById("logout").addEventListener("click", (e) => {
    e.preventDefault();

    $.post(`${window.location.pathname}/logout`, (res) => {
      if (res.success) {
        window.location.reload();
      } else {
        showError(res);
      }
    });
  });
  console.log($("#startapp"));
  $("#startapp").on("submit", (e) => {
    e.preventDefault();

    const appId = document.getElementById("appId").value;

    $.post(`${window.location.pathname}/start`, { appId }, (res) => {
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
