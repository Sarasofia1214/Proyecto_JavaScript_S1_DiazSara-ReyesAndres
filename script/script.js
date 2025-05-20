document.getElementById('login_form').addEventListener('submit', function (e) {
    e.preventDefault();
  
    const user = document.getElementById('input_user').value;
    const password = document.getElementById('input_password').value;
  
    if (user === 'Admi' && password === 'Admi123') {
      window.location.href = './index/inicio_admi.html';
    } else if (user === 'User' && password === 'User123') {
      window.location.href = './index/inicio.html';
    } else {
      console.log('Usuario o contraseña incorrectos');
    }
  });

  