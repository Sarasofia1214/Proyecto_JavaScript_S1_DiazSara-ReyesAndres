const API_URL = 'https://682a64c2ab2b5004cb3698d4.mockapi.io/formulaone/formula';
let monoplazas = [];

function cargarPilotos() {
  const containerPilotos = document.getElementById("container_cars");
  
  if (!containerPilotos) {
    console.error("No se encontró el elemento con ID 'container_cars'");
    return;
  }

  fetch(API_URL)
    .then(response => {
      if (!response.ok) {
        throw new Error(`Error en la solicitud: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      if (!data || !Array.isArray(data) || data.length === 0) {
        throw new Error("No se encontraron datos válidos");
      }

      const pilotoData = data[0];
      
      if (!pilotoData.pilotos || !Array.isArray(pilotoData.pilotos)) {
        throw new Error("No se encontraron datos de pilotos");
      }

      console.log("Datos de pilotos:", pilotoData);
      
      containerPilotos.innerHTML = '';
      
      pilotoData.pilotos.forEach(piloto => {
        const driverCard = document.createElement('div');
        driverCard.className = 'drivers-container';
        
        driverCard.innerHTML = `
          <div class="driver-card"> 
            <img src="https://www.formula1.com/content/dam/fom-website/teams/2025/red-bull-racing.jpg" 
                 class="driver-background" 
                 alt="Fondo del equipo">
            
            <div class="driver-info">
              <div class="driver-role">${piloto.rol || 'Piloto'}</div>
              <div class="driver-name">${piloto.nombre || 'Nombre no disponible'}</div>
              <div class="driver-number">
                <span class="team-dot"></span>
                <span class="team-text">${piloto.escuderia || 'Equipo desconocido'}</span>
              </div>
            </div>
            <img src="${piloto.photo || piloto.imagen || '../storage/images/default-driver.png'}" 
                 class="driver-photo" 
                 alt="${piloto.nombre || 'Piloto'}"
                 onerror="this.src='../storage/images/default-driver.png'">
          </div>
        `;
        
        containerPilotos.appendChild(driverCard);
      });
    })
    .catch(error => {
      console.error("Error al cargar los pilotos:", error);
      mostrarMensajeError("Error al cargar los datos de los pilotos");
    });
}

function cargarVehiculos() {
  fetch(API_URL)
    .then(response => {
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      if (data && Array.isArray(data) && data.length > 0) {
        if (data[0].monoplazas && Array.isArray(data[0].monoplazas)) {
          monoplazas = data[0].monoplazas;
        } else if (Array.isArray(data)) {
          monoplazas = data;
        }
      } else {
        throw new Error("Estructura de datos no válida");
      }
      
      console.log("Monoplazas cargados:", monoplazas); 
      mostrarVehiculosEnGaleria();
    })
    .catch(error => {
      console.error("Error al cargar los vehículos:", error);
      mostrarMensajeError("Error al cargar los datos de los vehículos");
    });
}

function mostrarVehiculosEnGaleria() {
  const container = document.getElementById("container_cars_id");
  
  if (!container) {
    console.error("No se encontró el elemento con ID 'container_cars_id'");
    return;
  }
  
  container.innerHTML = "";
  
  if (monoplazas.length === 0) {
    container.innerHTML = '<p>No hay vehículos disponibles</p>';
    return;
  }
  
  monoplazas.forEach((vehiculo, index) => {
    const imgContainer = document.createElement("div");
    imgContainer.className = "vehicle-container";
    
    const img = document.createElement("img");
    img.src = vehiculo.imagen || vehiculo.image || "../storage/images/carroultimo.png";
    img.alt = `${vehiculo.equipo || vehiculo.team || 'Equipo'} - ${vehiculo.modelo || vehiculo.model || 'Modelo'}`;
    img.setAttribute("data-id", vehiculo.id || (index + 1));
    img.className = "vehicle-image";
    
    img.onerror = function() {
      this.src = "../storage/images/carroultimo.png";
    };
    
    img.addEventListener("click", (e) => {
      console.log("Click en vehículo:", vehiculo.equipo || vehiculo.team);
      mostrarDetalleVehiculo(vehiculo, img);
    });
    
    imgContainer.appendChild(img);
    container.appendChild(imgContainer);
  });
}

function mostrarDetalleVehiculo(auto, img) {
  const detalleContainer = document.getElementById("detalleVehiculo");
  
  if (!detalleContainer) {
    console.error("No se encontró el elemento con ID 'detalleVehiculo'");
    return;
  }
  
  const equipo = auto.equipo || auto.team || 'Equipo no especificado';
  const modelo = auto.modelo || auto.model || 'Modelo no especificado';
  const motor = auto.motor || auto.engine || 'Motor no especificado';
  const aceleracion = auto.aceleracion_0_100 || auto.acceleration || '2.6';
  const velocidadMax = auto.velocidad_maxima_kmh || auto.maxSpeed || '350';
  
  let pilotos = "Pilotos no especificados";
  if (auto.piloto && Array.isArray(auto.piloto)) {
    pilotos = auto.piloto.join(" y ");
  } else if (auto.drivers) {
    pilotos = auto.drivers;
  } else if (auto.piloto) {
    pilotos = auto.piloto;
  }
  
  let velocidadPromedio = "320";
  if (auto.rendimiento) {
    const tipoConduccion = Object.keys(auto.rendimiento)[0];
    if (auto.rendimiento[tipoConduccion] && auto.rendimiento[tipoConduccion].velocidad_promedio_kmh) {
      velocidadPromedio = auto.rendimiento[tipoConduccion].velocidad_promedio_kmh;
    }
  } else if (auto.avgSpeed) {
    velocidadPromedio = auto.avgSpeed;
  }
  
  let consumoCombustible = "Datos no disponibles";
  if (auto.rendimiento) {
    const tipoConduccion = Object.keys(auto.rendimiento)[0];
    if (auto.rendimiento[tipoConduccion] && auto.rendimiento[tipoConduccion].consumo_combustible) {
      const consumo = auto.rendimiento[tipoConduccion].consumo_combustible;
      consumoCombustible = `Seco: ${consumo.seco || 'N/A'}, Lluvioso: ${consumo.lluvioso || 'N/A'}, Extremo: ${consumo.extremo || 'N/A'}`;
    }
  } else if (auto.fuelConsumption) {
    const consumo = auto.fuelConsumption;
    consumoCombustible = `Seco: ${consumo.dry || 'N/A'}, Lluvioso: ${consumo.wet || 'N/A'}, Extremo: ${consumo.extreme || 'N/A'}`;
  }
  
  let desgasteNeumaticos = "Datos no disponibles";
  if (auto.rendimiento) {
    const tipoConduccion = Object.keys(auto.rendimiento)[0];
    if (auto.rendimiento[tipoConduccion] && auto.rendimiento[tipoConduccion].desgaste_neumaticos) {
      const desgaste = auto.rendimiento[tipoConduccion].desgaste_neumaticos;
      desgasteNeumaticos = `Seco: ${desgaste.seco || 'N/A'}, Lluvioso: ${desgaste.lluvioso || 'N/A'}, Extremo: ${desgaste.extremo || 'N/A'}`;
    }
  } else if (auto.tireDegradation) {
    const desgaste = auto.tireDegradation;
    desgasteNeumaticos = `Seco: ${desgaste.dry || 'N/A'}, Lluvioso: ${desgaste.wet || 'N/A'}, Extremo: ${desgaste.extreme || 'N/A'}`;
  }
  
  const imagenAuto = auto.imagen || auto.image || img.src;
  
  detalleContainer.innerHTML = `
    <div class="info-detallada">
      <h2>Información Detallada</h2>
      <div class="logos_detallado">
        <img src="../storage/images/logo2025.svg" alt="F1 Logo" class="f1-logo">
        <img src="../storage/images/flechas.svg" alt="Decoración" class="logo_flechas"> 
      </div>
      
      <div class="contenedor">
        <div class="lado-izquierdo">
          <div class="info-seccion">
            <h3>Equipo:</h3>
            <p>${equipo}</p>
          </div>
          <div class="info-seccion">
            <h3>Modelo:</h3>
            <p>${modelo}</p>
          </div>
          <div class="info-seccion">
            <h3>Motor:</h3>
            <p>${motor}</p>
          </div>
          <div class="info-seccion">
            <h3>Aceleración 0-100:</h3>
            <p>${aceleracion} s</p>
          </div>
          <div class="info-seccion">
            <h3>Velocidad máxima:</h3>
            <p>${velocidadMax} KM/H</p>
          </div>
        </div>
        
        <div class="lado-derecho">
          <div class="info-seccion">
            <h3>Pilotos:</h3>
            <p>${pilotos}</p>
          </div>
          <div class="info-seccion">
            <h3>Tipo de conducción:</h3>
            <p>Normal</p>
          </div>
          <div class="info-seccion">
            <h3>Velocidad promedio:</h3>
            <p>${velocidadPromedio} km/h</p>
          </div>
          <div class="info-seccion">
            <h3>Consumo combustible:</h3>
            <p class="destaque-rojo">${consumoCombustible}</p>
          </div>
          <div class="info-seccion">
            <h3>Desgaste neumáticos:</h3>
            <p class="destaque-rojo">${desgasteNeumaticos}</p>
          </div>
        </div>
      </div>
      
      <div class="imagen-auto">
        <img src="${imagenAuto}" alt="Auto Formula 1" onerror="this.src='../storage/images/carroultimo.png'">
      </div>
      
      <div class="container_botones">
        <button class="boton_anadir" onclick="mostrarFormularioAñadir()">Añadir nuevo</button>
        <button class="boton_eliminar" onclick="eliminarVehiculo('${auto.id}')">Eliminar</button>
        <button class="boton_editar" onclick="editarVehiculo('${auto.id}')">Editar</button>
        <button class="boton_regresar" onclick="cerrarDetalle()">Regresar</button>
      </div>
    </div>
  `;
  
  detalleContainer.style.display = "block";
}

function mostrarFormularioAñadir() {
  const detalleContainer = document.getElementById("detalleVehiculo");
  
  detalleContainer.innerHTML = `
    <div class="info-detallada">
      <h2>Añadir Nuevo Vehículo</h2>
      <div class="logos_detallado">
        <img src="../storage/images/logo2025.svg" alt="F1 Logo" class="f1-logo">
        <img src="../storage/images/flechas.svg" alt="Decoración" class="logo_flechas"> 
      </div>
      
      <form id="formularioAñadir" class="formulario-añadir">
        <div class="contenedor">
          <div class="lado-izquierdo">
            <div class="info-seccion">
              <h3>Equipo:</h3>
              <input type="text" id="equipo" name="equipo" required>
            </div>
            <div class="info-seccion">
              <h3>Modelo:</h3>
              <input type="text" id="modelo" name="modelo" required>
            </div>
            <div class="info-seccion">
              <h3>Motor:</h3>
              <input type="text" id="motor" name="motor" required>
            </div>
            <div class="info-seccion">
              <h3>Aceleración 0-100 (segundos):</h3>
              <input type="number" id="aceleracion" name="aceleracion" step="0.1" min="0" required>
            </div>
            <div class="info-seccion">
              <h3>Velocidad Máxima (KM/H):</h3>
              <input type="number" id="velocidadMax" name="velocidadMax" min="0" required>
            </div>
          </div>
          
          <div class="lado-derecho">
            <div class="info-seccion">
              <h3>Piloto 1:</h3>
              <input type="text" id="piloto1" name="piloto1" required>
            </div>
            <div class="info-seccion">
              <h3>Piloto 2:</h3>
              <input type="text" id="piloto2" name="piloto2" required>
            </div>
            <div class="info-seccion">
              <h3>URL de la Imagen:</h3>
              <input type="url" id="linkImagen" name="linkImagen" placeholder="https://ejemplo.com/imagen.jpg" required>
            </div>
          </div>
        </div>
        
        <div class="container_botones">
          <button type="submit" class="boton_anadir">Guardar Vehículo</button>
          <button type="button" class="boton_regresar" onclick="cerrarDetalle()">Cancelar</button>
        </div>
      </form>
    </div>
  `;
  
  detalleContainer.style.display = "block";
  
  const formulario = document.getElementById("formularioAñadir");
  formulario.addEventListener("submit", function(e) {
    e.preventDefault();
    guardarNuevoVehiculo();
  });
}

function guardarNuevoVehiculo() {
  const formulario = document.getElementById('formularioAñadir');
  const formData = new FormData(formulario);
  
  const equipo = formData.get('equipo').trim();
  const modelo = formData.get('modelo').trim();
  const motor = formData.get('motor').trim();
  const piloto1 = formData.get('piloto1').trim();
  const piloto2 = formData.get('piloto2').trim();
  const linkImagen = formData.get('linkImagen').trim();
  
  if (!equipo || !modelo || !motor || !piloto1 || !piloto2 || !linkImagen) {
    mostrarMensajeError("Completa todos los campos obligatorios.");
    return;
  }
  
  const proximoId = monoplazas.length > 0 ? Math.max(...monoplazas.map(m => m.id || 0)) + 1 : 1;
  
  const nuevoVehiculo = {
    id: proximoId,
    equipo: equipo,
    modelo: modelo,
    motor: motor,
    aceleracion_0_100: formData.get('aceleracion') || "2.6",
    velocidad_maxima_kmh: parseInt(formData.get('velocidadMax')) || 350,
    piloto: [piloto1, piloto2],
    imagen: linkImagen,
    rendimiento: {
      [formData.get('tipoConduccion') || 'normal']: {
        velocidad_promedio_kmh: "320",
        consumo_combustible: {
          seco: "1.9",
          lluvioso: "2.1",
          extremo: "2.4"
        },
        desgaste_neumaticos: {
          seco: "1.5",
          lluvioso: "0.8",
          extremo: "2.5"
        }
      }
    }
  };
  
  mostrarMensajeCarga("Guardando vehículo...");
  
  fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(nuevoVehiculo)
  })
  .then(response => {
    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }
    return response.json();
  })
  .then(data => {
    console.log('Vehículo guardado exitosamente:', data);
    
    monoplazas.push(data);
    
    mostrarVehiculosEnGaleria();
    
    mostrarMensajeExito("¡Vehículo añadido exitosamente!");
    
    setTimeout(() => {
      cerrarDetalle();
    }, 2000);
  })
  .catch(error => {
    console.error('Error al guardar el vehículo:', error);
    mostrarMensajeError("Error al guardar el vehículo. Por favor, verifica los datos e inténtalo de nuevo.");
  });
}

function mostrarMensajeCarga(mensaje) {
  const detalleContainer = document.getElementById("detalleVehiculo");
  detalleContainer.innerHTML = `
    <div class="info-detallada">
      <div class="mensaje-carga">
        <h2>${mensaje}</h2>
        <div class="loader"></div>
      </div>
    </div>
  `;
}

function mostrarMensajeExito(mensaje) {
  const detalleContainer = document.getElementById("detalleVehiculo");
  detalleContainer.innerHTML = `
    <div class="info-detallada">
      <div class="mensaje-exito">
        <h2>${mensaje}</h2>
      </div>
    </div>
  `;
}

function mostrarMensajeError(mensaje) {
  const detalleContainer = document.getElementById("detalleVehiculo");
  detalleContainer.innerHTML = `
    <div class="info-detallada">
      <div class="mensaje-error">
        <h2>${mensaje}</h2>
        <button class="boton_regresar" onclick="cerrarDetalle()">Cerrar</button>
      </div>
    </div>
  `;
}

function cerrarDetalle() {
  const detalleContainer = document.getElementById("detalleVehiculo");
  if (detalleContainer) {
    detalleContainer.style.display = "none";
  }
}

function eliminarVehiculo(id) {
  if (!confirm("¿Estás seguro de que quieres eliminar este vehículo?")) {
    return;
  }
  
  mostrarMensajeCarga("Eliminando vehículo...");
  
  fetch(`${API_URL}/${id}`, {
    method: 'DELETE'
  })
  .then(response => {
    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }
    return response.json();
  })
  .then(() => {
    monoplazas = monoplazas.filter(vehiculo => vehiculo.id != id);
    
    mostrarVehiculosEnGaleria();
    
    mostrarMensajeExito("¡Vehículo eliminado exitosamente!");
    
    setTimeout(() => {
      cerrarDetalle();
    }, 2000);
  })
  .catch(error => {
    console.error('Error al eliminar el vehículo:', error);
    mostrarMensajeError("Error al eliminar el vehículo.");
  });
}

function editarVehiculo(vehiculoId) {
    const vehiculo = monoplazas.find(v => v.id == vehiculoId);
    if (!vehiculo) {
        mostrarMensajeError("No se encontró el vehículo a editar.");
        return;
    }

    const detalleContainer = document.getElementById("detalleVehiculo");
    
    const equipo = vehiculo.equipo || vehiculo.team || '';
    const modelo = vehiculo.modelo || vehiculo.model || '';
    const motor = vehiculo.motor || vehiculo.engine || '';
    const aceleracion = vehiculo.aceleracion_0_100 || vehiculo.acceleration || '2.6';
    const velocidadMax = vehiculo.velocidad_maxima_kmh || vehiculo.maxSpeed || '';
    
    let piloto1 = '', piloto2 = '';
    if (vehiculo.piloto && Array.isArray(vehiculo.piloto)) {
        piloto1 = vehiculo.piloto[0] || '';
        piloto2 = vehiculo.piloto[1] || '';
    } else if (vehiculo.drivers) {
        const pilotos = vehiculo.drivers.split(' y ');
        piloto1 = pilotos[0] || '';
        piloto2 = pilotos[1] || '';
    }
    
    let tipoConduccionActual = 'normal';
    if (vehiculo.rendimiento) {
        if (vehiculo.rendimiento.agresiva) tipoConduccionActual = 'agresiva';
        else if (vehiculo.rendimiento.ahorro) tipoConduccionActual = 'ahorro';
        else if (vehiculo.rendimiento.normal) tipoConduccionActual = 'normal';
    }
    
    const imagenVehiculo = vehiculo.imagen || vehiculo.image || '';
    
    detalleContainer.innerHTML = `
        <div class="info-detallada">
            <h2>Editar Vehículo</h2>
            <div class="logos_detallado">
                <img src="../storage/images/logo2025.svg" alt="F1 Logo" class="f1-logo">
                <img src="../storage/images/flechas.svg" alt="Decoración" class="logo_flechas">    
            </div>
            
            <form id="formularioEditar" class="formulario-añadir">
                <div class="contenedor">
                    <div class="lado-izquierdo">
                        <div class="info-seccion">
                            <h3>Equipo:</h3>
                            <input type="text" id="equipo" name="equipo" value="${equipo}" required>
                        </div>
                        <div class="info-seccion">
                            <h3>Modelo:</h3>
                            <input type="text" id="modelo" name="modelo" value="${modelo}" required>
                        </div>
                        <div class="info-seccion">
                            <h3>Motor:</h3>
                            <input type="text" id="motor" name="motor" value="${motor}" required>
                        </div>
                        <div class="info-seccion">
                            <h3>Aceleración 0-100 (segundos):</h3>
                            <input type="number" id="aceleracion" name="aceleracion" step="0.1" min="0" value="${aceleracion}" required>
                        </div>
                        <div class="info-seccion">
                            <h3>Velocidad Máxima (KM/H):</h3>
                            <input type="number" id="velocidadMax" name="velocidadMax" min="0" value="${velocidadMax}" required>
                        </div>
                    </div>
                    
                    <div class="lado-derecho">
                        <div class="info-seccion">
                            <h3>Piloto 1:</h3>
                            <input type="text" id="piloto1" name="piloto1" value="${piloto1}" required>
                        </div>
                        <div class="info-seccion">
                            <h3>Piloto 2:</h3>
                            <input type="text" id="piloto2" name="piloto2" value="${piloto2}" required>
                        </div>
                        <div class="info-seccion">
                            <h3>Tipo de Conducción:</h3>
                            <select id="tipoConduccion" name="tipoConduccion" required>
                                <option value="normal" ${tipoConduccionActual === 'normal' ? 'selected' : ''}>Normal</option>
                                <option value="agresiva" ${tipoConduccionActual === 'agresiva' ? 'selected' : ''}>Agresiva</option>
                                <option value="ahorro" ${tipoConduccionActual === 'ahorro' ? 'selected' : ''}>Ahorro de Combustible</option>
                            </select>
                        </div>
                        <div class="info-seccion">
                            <h3>URL de la Imagen:</h3>
                            <input type="url" id="linkImagen" name="linkImagen" value="${imagenVehiculo}" placeholder="https://ejemplo.com/imagen.jpg" required>
                        </div>
                    </div>
                </div>
                
                <div class="container_botones">
                    <button type="submit" class="boton_editar">Guardar Cambios</button>
                    <button type="button" class="boton_regresar" onclick="cerrarDetalle()">Cancelar</button>
                </div>
            </form>
        </div>
    `;
    
    detalleContainer.style.display = "block";
    
    document.getElementById('formularioEditar').addEventListener('submit', function(e) {
        e.preventDefault();
        actualizarVehiculo(vehiculoId);
    });
}

function actualizarVehiculo(vehiculoId) {
  const formulario = document.getElementById('formularioEditar');
  const formData = new FormData(formulario);
  
  const vehiculoActualizado = {
    id: vehiculoId,
    equipo: formData.get('equipo'),
    modelo: formData.get('modelo'),
    motor: formData.get('motor'),
    aceleracion_0_100: formData.get('aceleracion'),
    velocidad_maxima_kmh: parseInt(formData.get('velocidadMax')),
    piloto: [formData.get('piloto1'), formData.get('piloto2')],
    imagen: formData.get('linkImagen'),
    rendimiento: {
      [formData.get('tipoConduccion') || 'normal']: {
        velocidad_promedio_kmh: "320", 
        consumo_combustible: {
          seco: "1.9", 
          lluvioso: "2.1",
          extremo: "2.4"
        },
        desgaste_neumaticos: {
          seco: "1.5", 
          lluvioso: "0.8",
          extremo: "2.5"
        }
      }
    }
  };
  
  // Mostrar loading
  mostrarMensajeCarga("Actualizando vehículo...");
  
  // Hacer PUT a la API
  fetch(`${API_URL}/${vehiculoId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(vehiculoActualizado)
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Error en la respuesta del servidor');
    }
    return response.json();
  })
  .then(data => {
    console.log(data);
    
    const index = monoplazas.findIndex(v => v.id == vehiculoId);
    if (index !== -1) {
      monoplazas[index] = data;
    }
    mostrarVehiculosEnGaleria();
    mostrarMensajeExito("Vehículo actualizado");
    
        setTimeout(() => {
  cerrarDetalle();
    }, 2000);
  })
  .catch(error => {
    console.error(error);
    mostrarMensajeError("Error al actualizar..");
  });
}

document.addEventListener("DOMContentLoaded", function() {
  cargarPilotos();
  cargarVehiculos();
});

document.addEventListener("keydown", function(event) {
  if (event.key === "Escape") {
    cerrarDetalle();
  }
});

