document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('submit').addEventListener('click', (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const payload = {
      email: email,
      password: password
    }
    console.log(payload);
    const data = new FormData();
    data.append('json', JSON.stringify(payload));

    $.post('/login', payload, (res) => {
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