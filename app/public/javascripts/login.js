document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('submit').addEventListener('click', (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const data = {
      email: email,
      password: password
    }

    $.post('/login', data, (res) => {
      if (res && res.error) {
        // display error
        console.log('Wrong password!');
      } else if (res && res.token) {
        //save token to local storage and redirect to /profile
        const token = res.token;
        document.cookie = `token=${token}`;
        window.location.href = '/profile';
      }

    });


  })
});