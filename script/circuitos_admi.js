async function fetchEquipos(idd) {
    let response = await fetch("https://682a64c2ab2b5004cb3698d4.mockapi.io/formulaone/formula");
    let data = await response.json();
    console.log(data);
    renderEquipos(data, idd);
  }

  function renderEquipos(datas, id) {
    const container = document.getElementById("nombre_1");
    const circuito = datas[0]["circuito"][id]["nombre"];
    container.innerHTML = `
      <p class="nombrejava">${circuito} - ${datas[0]["equipos"][id]["nombre"]}</p>
      <p class="paisjava">${datas[0]["circuito"][id]["primer_gran_premio"]}</p>
      <p class="vueltas">${datas[0]["circuito"][id]["numero_vueltas"]} vueltas</p> 
      <p class="longitudjava">${datas[0]["circuito"][id]["longitud_circuito_km"]} km</p>
      <p class="tiempojava">${datas[0]["circuito"][id]["record_vuelta"]["tiempo"]}</p>
      <p class="pilotojava">${datas[0]["circuito"][id]["record_vuelta"]["piloto"]}</p>
      <p class="añojava">${datas[0]["circuito"][id]["record_vuelta"]["año"]}</p>
      <img src="${datas[0]["circuito"][id]["imagen"]}" class="circuitojava">
      <p class="descripcionjava">${datas[0]["circuito"][id]["descripcion"]}</p>
      <div class="container_botones">
        <button class="Añadir">Editar</button>
        <button class="Eliminar">Eliminar</button>
        <button class="Nuevo">Nuevo</button>
      </div>
    
      `;
  }

  function mostrarCircuitos(elemento) {
    const idd = elemento.getAttribute("data-id");
    document.getElementById("principal").style.display = "flex";
    fetchEquipos(idd);
  }

  function ocultarCircuitos() {
    document.getElementById("principal").style.display = "none";
  }