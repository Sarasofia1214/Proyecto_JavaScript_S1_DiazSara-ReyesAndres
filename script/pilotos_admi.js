const API_URL = 'https://682a64c2ab2b5004cb3698d4.mockapi.io/formulaone/formula';

const containerPilotos = document.getElementById('container_pilotos');
const tarjetaTemplate = document.getElementById('template');
const tarjetaInfo = document.getElementById('tarjeta_info');

const imgInfo = document.getElementById('imagen_piloto_info');
const nombreInfo = document.getElementById('info_nombre');
const equipoInfo = document.getElementById('info_equipo');
const vehiculoInfo = document.getElementById('info_vehiculo');
const podiumsInfo = document.getElementById('info_podiums');


const btnEliminar = tarjetaInfo.querySelector('.eliminar_container');
const btnEditar = tarjetaInfo.querySelector('.editar_container');


let pilotoActual = null;
let equipoActual = null;
let idEquipoActual = null;
let idPilotoActual = null;

function cargarPilotos() {
  containerPilotos.innerHTML = ''; 
  
  fetch(API_URL)
    .then(res => res.json())
    .then(data => {
      data.forEach(item => {
        const equipoNombre = item.equipo || "Escudería desconocida";
        const equipoId = item.id;
        
        if (item.pilotos && Array.isArray(item.pilotos)) {
          item.pilotos.forEach(piloto => {
            const tarjeta = tarjetaTemplate.cloneNode(true);
            tarjeta.removeAttribute('id'); 
            tarjeta.style.display = 'flex';
            
     
            tarjeta.dataset.equipoId = equipoId;
            tarjeta.dataset.pilotoId = piloto.id;
            
            const imgPiloto = tarjeta.querySelector('#img_piloto');
            const nombrePiloto = tarjeta.querySelector('#name_piloto');
            const bandera = tarjeta.querySelector('#img_bandera');
            const escuderia = tarjeta.querySelector('.description p');
            const posicion = tarjeta.querySelector('#posicion');

            imgPiloto.src = piloto.foto || '';
            nombrePiloto.textContent = piloto.nombre;
            bandera.src = piloto.bandera || '';
            escuderia.textContent = piloto.escuderia || equipoNombre;
            posicion.textContent = `#${piloto.id}`; 

            tarjeta.onclick = () => {
              mostrarInformacion(piloto, equipoNombre, equipoId, piloto.id);
            };

            containerPilotos.appendChild(tarjeta);
          });
        }
      });
    })
    .catch(err => console.error(err));
}
cargarPilotos();


function mostrarInformacion(piloto, equipo, equipoId, pilotoId) {
  imgInfo.src = piloto.foto || '';
  nombreInfo.textContent = piloto.nombre;
  equipoInfo.textContent = piloto.escuderia || equipo;
  vehiculoInfo.textContent = piloto.modelo || '';
  podiumsInfo.textContent = piloto.Podiums || '0';

  pilotoActual = piloto;
  equipoActual = equipo;
  idEquipoActual = equipoId;
  idPilotoActual = pilotoId;

  tarjetaInfo.style.display = 'flex';
}


function ocultarTarjeta() {
  tarjetaInfo.style.display = 'none';
  pilotoActual = null;
}

btnEliminar.addEventListener('click', function() {
  if (pilotoActual && idEquipoActual && idPilotoActual) {
    if (confirm(`¿Estás seguro de eliminar a ${pilotoActual.nombre}?`)) {
      eliminarPiloto(idEquipoActual, idPilotoActual);
    }
  }
});

function eliminarPiloto(equipoId, pilotoId) {
  if (!equipoId || !pilotoId) {
    return;
  }

  fetch(`${API_URL}/${equipoId}`)
    .then(res => {
      if (!res.ok) {
        throw new Error('No se pudo obtener los datos del equipo');
      }
      return res.json();
    })
    .then(equipo => {
      if (!equipo || !Array.isArray(equipo.pilotos)) {
        throw new Error('');
      }
      
      const pilotoIndex = equipo.pilotos.findIndex(p => p.id == pilotoId);
      
      if (pilotoIndex === -1) {
        throw new Error('Piloto no encontrado en este equipo');
      }
      
      const pilotos = equipo.pilotos.filter(p => p.id != pilotoId);
      
      return fetch(`${API_URL}/${equipoId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...equipo,
          pilotos: pilotos
        })
      });
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Error al actualizar el equipo');
      }
      return response.json();
    })
    .then(data => {
      ocultarTarjeta();
      cargarPilotos(); 
      alert('Piloto eliminado correctamente');
    })
    .catch(err => {
      console.error('Error al eliminar piloto:', err);
      alert(`Error al eliminar el piloto: ${err.message}`);
    });
}

btnEditar.addEventListener('click', function() {
  if (pilotoActual) {
    mostrarFormularioEdicion(pilotoActual);
  }
});

function mostrarFormularioEdicion(piloto) {
  ocultarTarjeta();
  

  const formularioEdicion = document.createElement('div');
  formularioEdicion.className = 'formulario-piloto';
  formularioEdicion.id = 'form-editar';
  formularioEdicion.style.display = 'block';
  
  formularioEdicion.innerHTML = `
    <h2>Editar Piloto</h2>
    <img class="flechas" src="../storage/images/flechas.svg" alt="Flechas">
    
    <form id="piloto-editar-form">
        <div class="form-row">
            <div class="form-group">
                <label for="edit-nombre">Nombre:</label>
                <input type="text" id="edit-nombre" value="${piloto.nombre || ''}" required>
            </div>
            <div class="form-group">
                <label for="edit-vehiculo">Vehículo:</label>
                <input type="text" id="edit-vehiculo" value="${piloto.modelo || ''}" required>
            </div>
        </div>
        
        <div class="form-row">
            <div class="form-group">
                <label for="edit-equipo">Equipo:</label>
                <input type="text" id="edit-equipo" value="${piloto.escuderia || equipoActual || ''}" required>
            </div>
            <div class="form-group">
                <label for="edit-podiums">Podiums:</label>
                <input type="number" id="edit-podiums" min="0" value="${piloto.Podiums || '0'}" required>
            </div>
        </div>
        
        <div class="form-row">
            <div class="form-group">
                <label for="edit-rot">Posición:</label>
                <select id="edit-rot" required>
                    ${generatePositionOptions(piloto.id || '1')}
                </select>
            </div>
            <div class="form-group">
                <label for="edit-pais">País:</label>
                <input type="text" id="edit-pais" value="${piloto.pais || ''}" required>
            </div>
        </div>
        
        <div class="form-row">
            <div class="form-group">
                <label for="edit-imagen">URL Imagen Piloto:</label>
                <input type="url" id="edit-imagen" value="${piloto.foto || ''}" required>
            </div>
            <div class="form-group">
                <label for="edit-bandera">URL Bandera País:</label>
                <input type="url" id="edit-bandera" value="${piloto.bandera || ''}" required>
            </div>
        </div>
        
        <div class="form-actions">
            <button type="button" class="btn btn-cancel" id="btn-cancelar-edicion">Cancelar</button>
            <button type="submit" class="btn btn-submit">Guardar</button>
        </div>
    </form>
  `;
  

  document.body.appendChild(formularioEdicion);
  document.getElementById('btn-cancelar-edicion').addEventListener('click', function() {
    document.getElementById('form-editar').remove();
  });
  

  document.getElementById('piloto-editar-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const pilotoActualizado = {
      id: idPilotoActual,
      nombre: document.getElementById('edit-nombre').value,
      modelo: document.getElementById('edit-vehiculo').value,
      escuderia: document.getElementById('edit-equipo').value,
      Podiums: document.getElementById('edit-podiums').value,
      foto: document.getElementById('edit-imagen').value,
      bandera: document.getElementById('edit-bandera').value,
      pais: document.getElementById('edit-pais').value,
  
    };
    
   
    actualizarPiloto(idEquipoActual, pilotoActualizado);
    
   // Eliminar formulario
    document.getElementById('form-editar').remove();
  });
}


function generatePositionOptions(selected) {
  let options = '';
  for (let i = 1; i <= 20; i++) {
    options += `<option value="${i}" ${i == selected ? 'selected' : ''}>${i}</option>`;
  }
  return options;
}

function actualizarPiloto(equipoId, pilotoActualizado) {
  fetch(`${API_URL}/${equipoId}`)
    .then(res => res.json())
    .then(equipo => {
      if (equipo && equipo.pilotos) {
      
        const pilotos = equipo.pilotos.map(p => {
          if (p.id == pilotoActualizado.id) {
            return pilotoActualizado;
          }
          return p;
        });




        
        return fetch(`${API_URL}/${equipoId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...equipo,
            pilotos: pilotos
          })
        });
      }
    })
    .then(response => {
      if (response && response.ok) {
        cargarPilotos(); 
        alert('Piloto actualizado correctamente');
      }
    })
    .catch(err => {
      console.error('Error al actualizar piloto:', err);
      alert('Hubo un error al actualizar el piloto');
    });
}

document.getElementById('btn-anadir').addEventListener('click', function() {
  document.getElementById('form-piloto').style.display = 'block';
});

document.getElementById('btn-cancelar').addEventListener('click', function() {
  document.getElementById('form-piloto').style.display = 'none';
  document.getElementById('piloto-form').reset();
});

document.getElementById('piloto-form').addEventListener('submit', function(e) {
  e.preventDefault();
  
  const nuevoPiloto = {
    id: Date.now().toString(), 
    nombre: document.getElementById('nombre').value,
    modelo: document.getElementById('vehiculo').value,
    escuderia: document.getElementById('equipo').value,
    Podiums: document.getElementById('podiums').value,
    foto: document.getElementById('imagen').value,
    bandera: document.getElementById('bandera').value,
    pais: document.getElementById('pais').value,
  };
  

  anadirPiloto(nuevoPiloto);
  

  document.getElementById('form-piloto').style.display = 'none';
  this.reset();
});


function anadirPiloto(nuevoPiloto) {

  fetch(API_URL)
    .then(res => res.json())
    .then(equipos => {
      const equipoExistente = equipos.find(e => e.equipo === nuevoPiloto.escuderia);
      
      if (equipoExistente) {
        return fetch(`${API_URL}/${equipoExistente.id}`)
          .then(res => res.json())
          .then(equipo => {
            const pilotos = equipo.pilotos || [];
            pilotos.push(nuevoPiloto);
            
            return fetch(`${API_URL}/${equipoExistente.id}`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                ...equipo,
                pilotos: pilotos
              })
            });
          });
      } else {
        // Crear un nuevo equipo con el piloto
        return fetch(API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            equipo: nuevoPiloto.escuderia,
            pilotos: [nuevoPiloto]
          })
        });
      }
    })
    .then(response => {
      if (response.ok) {
        cargarPilotos(); 
        alert('Piloto añadido correctamente');
      }
    })
    .catch(err => {
      console.error('Error al añadir piloto:', err);
      alert('Hubo un error al añadir el piloto');
    });
}