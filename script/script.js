document.getElementById('login_containerr').addEventListener('submit', function (e) {
  e.preventDefault();

  const user = document.getElementById('input_user').value;
  const password = document.getElementById('input_password').value;

  if (user === 'a123' && password === 'a123') {
      window.location.href = '../index/inicio.html';  
  } else if (user === 'u123' && password === 'u123') {
      window.location.href = '../index/pilotos.html';  
  } else {
      alert('Usuario o contraseña incorrectos');
  }
});
