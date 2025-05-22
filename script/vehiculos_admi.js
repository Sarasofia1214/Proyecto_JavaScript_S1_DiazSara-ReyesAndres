let monoplazas = [];

// Cargar datos de la API
fetch("https://682a64c2ab2b5004cb3698d4.mockapi.io/formulaone/formula")
  .then(res => res.json())
  .then(data => {
    console.log("Datos recibidos:", data); // Para debug
    
    // Verificar la estructura de los datos
    if (data && data.length > 0 && data[0].monoplazas) {
      monoplazas = data[0].monoplazas;
    } else if (Array.isArray(data)) {
      monoplazas = data;
    }
    
    console.log("Monoplazas cargados:", monoplazas); // Para debug
    inicializarEventos();
  })
  .catch(error => {
    console.error("Error al cargar los datos:", error);
    alert("Error al cargar los datos de los vehículos");
  });

function inicializarEventos() {
  const detalleContainer = document.getElementById("detalleVehiculo");

  document.querySelectorAll(".container_cars img").forEach((img, index) => {
    img.addEventListener("click", (e) => {
      console.log("Click en imagen:", index + 1); // Para debug
      
      const id = parseInt(img.getAttribute("data-id"));
      let auto = monoplazas.find(m => m.id === id);
      
      // Si no encuentra por ID, usar el índice
      if (!auto && monoplazas[index]) {
        auto = monoplazas[index];
      }

      console.log("Auto encontrado:", auto); // Para debug

      if (auto) {
        // Construir HTML con verificaciones para evitar errores
        const equipo = auto.equipo || auto.team || "No disponible";
        const modelo = auto.modelo || auto.model || "No disponible";
        const motor = auto.motor || auto.engine || "No disponible";
        const aceleracion = auto.aceleracion_0_100 || auto.acceleration || "No disponible";
        const velocidadMax = auto.velocidad_maxima_kmh || auto.maxSpeed || "No disponible";
        
        // Pilotos
        let pilotos = "No disponible";
        if (auto.piloto && Array.isArray(auto.piloto)) {
          pilotos = auto.piloto.join(" y ");
        } else if (auto.drivers) {
          pilotos = auto.drivers;
        }
        
        // Velocidad promedio
        let velocidadPromedio = "No disponible";
        if (auto.rendimiento && auto.rendimiento.conduccion_normal) {
          velocidadPromedio = auto.rendimiento.conduccion_normal.velocidad_promedio_kmh;
        } else if (auto.avgSpeed) {
          velocidadPromedio = auto.avgSpeed;
        }
        
        // Consumo combustible
        let consumoCombustible = "No disponible";
        if (auto.rendimiento && auto.rendimiento.conduccion_normal && auto.rendimiento.conduccion_normal.consumo_combustible) {
          const consumo = auto.rendimiento.conduccion_normal.consumo_combustible;
          consumoCombustible = `${consumo.seco} / ${consumo.lluvioso} / ${consumo.extremo}`;
        } else if (auto.fuelConsumption) {
          const consumo = auto.fuelConsumption;
          consumoCombustible = `${consumo.dry} / ${consumo.wet} / ${consumo.extreme}`;
        }
        
        // Desgaste neumáticos
        let desgatseNeumaticos = "No disponible";
        if (auto.rendimiento && auto.rendimiento.conduccion_normal && auto.rendimiento.conduccion_normal.desgaste_neumaticos) {
          const desgaste = auto.rendimiento.conduccion_normal.desgaste_neumaticos;
          desgatseNeumaticos = `${desgaste.seco} / ${desgaste.lluvioso} / ${desgaste.extremo}`;
        } else if (auto.tireDegradation) {
          const desgaste = auto.tireDegradation;
          desgatseNeumaticos = `${desgaste.dry} / ${desgaste.wet} / ${desgaste.extreme}`;
        }
        
        // Imagen
        const imagenAuto = auto.imagen || auto.image || img.src;

        detalleContainer.innerHTML = `
          <div class="info-detallada">
            <h2>Información Detallada</h2>
            <div class="anio-2025">2025</div>
            <img class="f1-logo" src="../storage/images/logo2025.png" alt="F1 Logo" style="position: absolute; top: 70px; right: 15px; width: 60px; opacity: 0.7;">
            
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
                  <p>${velocidadMax} km/h</p>
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
                  <p class="destaque-rojo">seco/lluvioso/extremo: ${consumoCombustible}</p>
                </div>
                <div class="info-seccion">
                  <h3>Desgaste neumáticos:</h3>
                  <p class="destaque-rojo">seco/lluvioso/extremo: ${desgatseNeumaticos}</p>
                </div>
              </div>
            </div>
            
            <div class="imagen-auto">
              <img src="${imagenAuto}" alt="Auto Formula 1">
            </div>
            
            <button class="btn-regresar" onclick="cerrarDetalle()">Regresar</button>
          </div>
        `;

        // Mostrar el cuadro
        detalleContainer.style.display = "block";
      } else {
        alert("No se encontró información para este vehículo");
      }
    });
  });
}

// Función para cerrar el detalle
function cerrarDetalle() {
  document.getElementById("detalleVehiculo").style.display = "none";
}

// Cerrar con tecla Escape
document.addEventListener("keydown", function(event) {
  if (event.key === "Escape") {
    cerrarDetalle();
  }
});