document.getElementById('login_form').addEventListener('submit', function (e) {
    e.preventDefault();
  
    const user = document.getElementById('input_user').value;
    const password = document.getElementById('input_password').value;
  
    if (user === 'Gaia' && password === 'Gaia123') {
      window.location.href = '/index/inicio.html';
    } else if (user === 'Malu' && password === 'Malu123') {
      window.location.href = '../index/inicio_admin.html';
    } else {
      console.log('Usuario o contraseña incorrectos');
    }
  });
  "https://cdn.jsdelivr.net/npm/sweetalert2@11"
  