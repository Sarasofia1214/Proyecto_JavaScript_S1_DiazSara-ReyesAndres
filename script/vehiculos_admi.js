let monoplazas = [];

fetch("https://682a64c2ab2b5004cb3698d4.mockapi.io/formulaone/formula")
  .then(res => res.json())
  .then(data => {
    
    if (data && data.length > 0 && data[0].monoplazas) {
      monoplazas = data[0].monoplazas;
    } else if (Array.isArray(data)) {
      monoplazas = data;
    }
    
    console.log("Monoplazas cargados:", monoplazas); 
    inicializarEventos();
  })
  .catch(error => {
    console.error("Error al cargar los datos:", error);
   
  });

function inicializarEventos() {
  const detalleContainer = document.getElementById("detalleVehiculo");

  document.querySelectorAll(".container_cars img").forEach((img, index) => {
    img.addEventListener("click", (e) => {
      console.log("Click en imagen:", index + 1);
      
      const id = parseInt(img.getAttribute("data-id"));
      let auto = monoplazas.find(m => m.id === id);
      
      if (!auto && monoplazas[index]) {
        auto = monoplazas[index];
      }

      if (auto) {
        mostrarDetalleVehiculo(auto, img);
      }
    });
  });
}

function mostrarDetalleVehiculo(auto, img) {
  const detalleContainer = document.getElementById("detalleVehiculo");
  
  const equipo = auto.equipo || auto.team;
  const modelo = auto.modelo || auto.model;
  const motor = auto.motor || auto.engine;
  const aceleracion = auto.aceleracion_0_100 || auto.acceleration;
  const velocidadMax = auto.velocidad_maxima_kmh || auto.maxSpeed;
  
  let pilotos = "Max Verstappen y Sergio Pérez";
  if (auto.piloto && Array.isArray(auto.piloto)) {
    pilotos = auto.piloto.join(" y ");
  } else if (auto.drivers) {
    pilotos = auto.drivers;
  }
  
  let velocidadPromedio = "320";
  if (auto.rendimiento && auto.rendimiento.conduccion_normal) {
    velocidadPromedio = auto.rendimiento.conduccion_normal.velocidad_promedio_kmh;
  } else if (auto.avgSpeed) {
    velocidadPromedio = auto.avgSpeed;
  }
  
  let consumoCombustible = "seco: 1.9, lluvioso: 2.1, extremo: 2.4";
  if (auto.rendimiento && auto.rendimiento.conduccion_normal && auto.rendimiento.conduccion_normal.consumo_combustible) {
    const consumo = auto.rendimiento.conduccion_normal.consumo_combustible;
    consumoCombustible = `seco: ${consumo.seco}, lluvioso: ${consumo.lluvioso}, extremo: ${consumo.extremo}`;
  } else if (auto.fuelConsumption) {
    const consumo = auto.fuelConsumption;
    consumoCombustible = `seco: ${consumo.dry}, lluvioso: ${consumo.wet}, extremo: ${consumo.extreme}`;
  }
  
  let desgatseNeumaticos = "seco: 1.5, lluvioso: 0.8, extremo: 2.5";
  if (auto.rendimiento && auto.rendimiento.conduccion_normal && auto.rendimiento.conduccion_normal.desgaste_neumaticos) {
    const desgaste = auto.rendimiento.conduccion_normal.desgaste_neumaticos;
    desgatseNeumaticos = `seco: ${desgaste.seco}, lluvioso: ${desgaste.lluvioso}, extremo: ${desgaste.extremo}`;
  } else if (auto.tireDegradation) {
    const desgaste = auto.tireDegradation;
    desgatseNeumaticos = `seco: ${desgaste.dry}, lluvioso: ${desgaste.wet}, extremo: ${desgaste.extreme}`;
  }
  

  const imagenAuto = auto.imagen || auto.image || img.src;

  detalleContainer.innerHTML = `
    <div class="info-detallada">
      <h2>Información Detallada</h2>
      <div class="logos_detallado">
          <img src="../storage/images/logo2025.svg" alt="F1 Logo" class="f1-logo">
          <img src="../storage/images/flechas.svg" alt="" class="logo_flechas" > 
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
            <h3>Aceleración:</h3>
            <p>${aceleracion} s</p>
          </div>
          <div class="info-seccion">
            <h3>Velocidad máx:</h3>
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
            <h3>Velocidad promedio km/h:</h3>
            <p>${velocidadPromedio}</p>
          </div>
          <div class="info-seccion">
            <h3>Consumo combustible:</h3>
            <p class="destaque-rojo">${consumoCombustible}</p>
          </div>
          <div class="info-seccion">
            <h3>Desgaste neumáticos:</h3>
            <p class="destaque-rojo">${desgatseNeumaticos}</p>
          </div>
        </div>
      </div>
      
      <div class="imagen-auto">
        <img src="${imagenAuto}" alt="Auto Formula 1">
      </div>
      <div class="container_botones">
          <button class="boton_anadir" onclick="mostrarFormularioAñadir()">Añadir nuevo</button>
          <button class="boton_eliminar">Eliminar</button>
          <button class="boton_editar">Editar</button>
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
          <img src="../storage/images/flechas.svg" alt="" class="logo_flechas" > 
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
              <h3>Velocidad Máxima (KM/H):</h3>
              <input type="number" id="velocidadMax" name="velocidadMax" required>
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
              <h3>Tipo de Conducción:</h3>
              <select id="tipoConduccion" name="tipoConduccion" required>
                <option value="">Seleccionar...</option>
                <option value="normal">Normal</option>
                <option value="agresiva">Agresiva</option>
                <option value="ahorro">Ahorro de Combustible</option>
              </select>
            </div>
            <div class="info-seccion">
              <h3>Link de la Imagen:</h3>
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
  
  // Agregar event listener al formulario
  document.getElementById('formularioAñadir').addEventListener('submit', function(e) {
    e.preventDefault();
    guardarNuevoVehiculo();
  });
}

function guardarNuevoVehiculo() {
  const formulario = document.getElementById('formularioAñadir');
  const formData = new FormData(formulario);
  
  // Obtener el siguiente ID disponible
  const proximoId = Math.max(...monoplazas.map(m => m.id || 0)) + 1;
  
  // Crear objeto del nuevo vehículo
  const nuevoVehiculo = {
    id: proximoId,
    equipo: formData.get('equipo'),
    modelo: formData.get('modelo'),
    motor: formData.get('motor'),
    velocidad_maxima_kmh: parseInt(formData.get('velocidadMax')),
    piloto: [formData.get('piloto1'), formData.get('piloto2')],
    imagen: formData.get('linkImagen'),
    aceleracion_0_100: "2.6", // Valor por defecto
    rendimiento: {
      [formData.get('tipoConduccion')]: {
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
  mostrarMensajeCarga("Guardando vehículo...");
  
  // Hacer POST a la API
  fetch("https://682a64c2ab2b5004cb3698d4.mockapi.io/formulaone/formula", {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(nuevoVehiculo)
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Error en la respuesta del servidor');
    }
    return response.json();
  })
  .then(data => {
    console.log('Vehículo guardado:', data);
    
    // Actualizar array local
    monoplazas.push(data);
    
    // Mostrar mensaje de éxito
    mostrarMensajeExito("¡Vehículo añadido exitosamente!");
    
    // Cerrar modal después de 2 segundos
    setTimeout(() => {
      cerrarDetalle();
      // Opcional: recargar la página para mostrar el nuevo vehículo en la galería
      // location.reload();
    }, 2000);
  })
  .catch(error => {
    console.error('Error al guardar el vehículo:', error);
    mostrarMensajeError("Error al guardar el vehículo. Por favor, inténtalo de nuevo.");
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
        <h2>✅ ${mensaje}</h2>
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
  document.getElementById("detalleVehiculo").style.display = "none";
}

document.addEventListener("keydown", function(event) {
  if (event.key === "Escape") {
    cerrarDetalle();
  }
});