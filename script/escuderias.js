
async function fetchEquipos(idd) {
  let response = await fetch("https://682a64c2ab2b5004cb3698d4.mockapi.io/formulaone/formula")
  let data = await response.json()
  console.log(data)
  renderEquipos(data,idd)
}

function renderEquipos(datas,id) {
  console.log(id)
  console.log(datas)

  const container = document.getElementById("nombre_1");
 
  const equipos = datas[0]["equipos"][id]["nombre"];
  container.innerHTML = 
  `<p class="nombrecompletojava">${equipos} ${datas[0]["equipos"][id]["nombreCompleto"]}</p>
  <p class="paisjava">${datas[0]["equipos"][id]["pais"]}</p>
  <img src="${datas[0]["equipos"][id]["logoImage"]}" alt="logo" class="logojava"> 
  <img src="${datas[0]["equipos"][id]["bandera"]}" alt="bandera" class="banderajava">

  <p class="modelojava">   ${datas[0]["equipos"][id]["modelo"]}  </p>
  <p class="copasjava">${datas[0]["equipos"][id]["copas"]} </p>
  <p class="entradajava"> ${datas[0]["equipos"][id]["entradaEquipo"]}</p>
    <p class="pilotosjava"> ${datas[0]["equipos"][id]["pilotos"]} </p>`
 
  
}

function mostrarEscuderias(elemento) {
  const idd = elemento.getAttribute("data-id")
  document.getElementById("cuadro").style.display = "flex"
  fetchEquipos(idd)
}

function ocultarEscuderias() {
    document.getElementById("cuadro").style.display = "none";
}



  function quitarDesenfoque() {
    document.body.style.filter = 'none';
  }