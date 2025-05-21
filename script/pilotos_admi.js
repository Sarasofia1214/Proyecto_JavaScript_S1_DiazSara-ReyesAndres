    // Manejadores para mostrar/ocultar el formulario
    document.getElementById('btn-anadir').addEventListener('click', function() {
      document.getElementById('form-piloto').style.display = 'block';
  });
  
  document.getElementById('btn-cancelar').addEventListener('click', function() {
      document.getElementById('form-piloto').style.display = 'none';
      document.getElementById('piloto-form').reset();
  });
  
  // Manejador para el envío del formulario
  document.getElementById('piloto-form').addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Obtener los valores del formulario
      const nombre = document.getElementById('nombre').value;
      const vehiculo = document.getElementById('vehiculo').value;
      const equipo = document.getElementById('equipo').value;
      const podiums = document.getElementById('podiums').value;
      const posicion = document.getElementById('rot').value;
      const pais = document.getElementById('pais').value;
      const imagenUrl = document.getElementById('imagen').value;
      const banderaUrl = document.getElementById('bandera').value;
      
      // Crear una nueva tarjeta de piloto
      crearTarjetaPiloto(nombre, equipo, posicion, imagenUrl, banderaUrl, vehiculo, podiums);
      
      // Ocultar y resetear el formulario
      document.getElementById('form-piloto').style.display = 'none';
      this.reset();
  });
  
  // Función para crear una nueva tarjeta de piloto
  function crearTarjetaPiloto(nombre, equipo, posicion, imagenUrl, banderaUrl, vehiculo, podiums) {
      // Clonar la plantilla
      const template = document.getElementById('template');
      const nuevaTarjeta = template.cloneNode(true);
      nuevaTarjeta.id = ''; // Quitar el ID para evitar duplicados
      nuevaTarjeta.style.display = 'flex'; // Hacer visible la tarjeta
      
      // Establecer los valores
      nuevaTarjeta.querySelector('#img_piloto').src = imagenUrl;
      nuevaTarjeta.querySelector('#img_bandera').src = banderaUrl;
      nuevaTarjeta.querySelector('#name_piloto').textContent = nombre;
      nuevaTarjeta.querySelector('#team_piloto').textContent = equipo;
      nuevaTarjeta.querySelector('#posicion').textContent = '#' + posicion;
      
      // Almacenar datos adicionales para la tarjeta de información
      nuevaTarjeta.dataset.vehiculo = vehiculo;
      nuevaTarjeta.dataset.podiums = podiums;
      
      // Añadir evento para mostrar la tarjeta de información
      nuevaTarjeta.addEventListener('click', function() {
          mostrarInformacionPiloto(nombre, equipo, vehiculo, podiums, imagenUrl);
      });
      
      // Añadir la nueva tarjeta al contenedor
      document.getElementById('container_pilotos').appendChild(nuevaTarjeta);
  }
  
  // Función para mostrar la tarjeta de información detallada
  function mostrarInformacionPiloto(nombre, equipo, vehiculo, podiums, imagenUrl) {
      document.getElementById('info_nombre').textContent = nombre;
      document.getElementById('info_equipo').textContent = equipo;
      document.getElementById('info_vehiculo').textContent = vehiculo;
      document.getElementById('info_podiums').textContent = podiums;
      document.getElementById('imagen_piloto_info').src = imagenUrl;
      
      document.getElementById('tarjeta_info').style.display = 'block';
  }
  
  // Función para ocultar la tarjeta de información
  function ocultarTarjeta() {
      document.getElementById('tarjeta_info').style.display = 'none';
  }
  