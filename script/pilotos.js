const API_URL = 'https://682a64c2ab2b5004cb3698d4.mockapi.io/formulaone/formula';

const containerPilotos = document.getElementById('container_pilotos');
const tarjetaTemplate = document.getElementById('template');
const tarjetaInfo = document.getElementById('tarjeta_info');

const imgInfo = document.getElementById('imagen_piloto_info');
const nombreInfo = document.getElementById('info_nombre');
const equipoInfo = document.getElementById('info_equipo');
const vehiculoInfo = document.getElementById('info_vehiculo');
const podiumsInfo = document.getElementById('info_podiums');

fetch(API_URL)
  .then(res => res.json())
  .then(data => {
    data.forEach(item => {
      const equipoNombre = item.equipo || "Escudería desconocida";
      item.pilotos.forEach(piloto => {
        const tarjeta = tarjetaTemplate.cloneNode(true);
        tarjeta.removeAttribute('id'); 
        tarjeta.style.display = 'flex';

      
        const imgPiloto = tarjeta.querySelector('#img_piloto');
        const nombrePiloto = tarjeta.querySelector('#name_piloto');
        const bandera = tarjeta.querySelector('#img_bandera');
        const escuderia = tarjeta.querySelector('.description p');
        const posicion = tarjeta.querySelector('#posicion');

        imgPiloto.src = piloto.foto;
        nombrePiloto.textContent = piloto.nombre;
        bandera.src = piloto.bandera;
        escuderia.textContent = piloto.escuderia;
        posicion.textContent = `#${piloto.id}`; 

        tarjeta.onclick = () => {
          mostrarInformacion(piloto, equipoNombre);
        };

        containerPilotos.appendChild(tarjeta);
      });
    });
  })
  .catch(err => console.error('Error al cargar pilotos:', err));

function mostrarInformacion(piloto, equipo) {
  imgInfo.src = piloto.foto;
  nombreInfo.textContent = piloto.nombre;
  equipoInfo.textContent = piloto.escuderia;
  vehiculoInfo.textContent = piloto.modelo;
  podiumsInfo.textContent = piloto.Podiums;

  tarjetaInfo.style.display = 'flex';
}

function ocultarTarjeta() {
  tarjetaInfo.style.display = 'none';
}
