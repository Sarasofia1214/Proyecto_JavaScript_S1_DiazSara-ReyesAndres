const apiUrl = 'https://682a64c2ab2b5004cb3698d4.mockapi.io/formulaone/formula';
let autos = [];

document.addEventListener('DOMContentLoaded', async () => {
  try {
    const res = await fetch(apiUrl);
    const data = await res.json();
    autos = data[0].equipos;
    console.log('Equipos cargados:', autos);
    agregarEventosACoches();
  } catch (error) {
    console.error('Error cargando datos:', error);
  }
});

function agregarEventosACoches() {
  const imagenes = document.querySelectorAll('#container_cars_id img');
  imagenes.forEach((img, index) => {
    img.addEventListener('click', () => mostrarDetalle(index));
  });
}

function mostrarDetalle(index) {
  const auto = autos[index];
  if (!auto) {
    console.warn('No se encontró el auto en el índice:', index);
    return;
  }

  const detalle = document.getElementById('detalleVehiculo');
  detalle.style.display = 'block';


  detalle.innerHTML = `
    <div class="card-detalle">
      <p><strong>Modelo:</strong> ${auto.modelo || 'N/A'}</p>
      <p><strong>Motor:</strong> ${auto.motor || 'N/A'}</p>
      <p><strong>Pilotos (IDs):</strong> ${auto.pilotos.join(', ') || 'N/A'}</p>
      <p><strong>Pais:</strong> ${auto.pais || 'N/A'}</p>
      <p><strong>Entrada al equipo:</strong> ${auto.entradaEquipo || 'N/A'}</p>
      <p><strong>Copas:</strong> ${auto.copas || 'N/A'}</p>
      <img src="${auto.logoImage}" alt="${auto.nombre}" style="width: 200px;">
      <br><br>
      <button onclick="cerrarDetalle()">Regresar</button>
    </div>
  `;
}

function cerrarDetalle() {
  document.getElementById('detalleVehiculo').style.display = 'none';
}
