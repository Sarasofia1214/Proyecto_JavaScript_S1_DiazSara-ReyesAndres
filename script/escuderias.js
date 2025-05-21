
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
  container.innerHTML = `${equipos} ${datas[0]["equipos"][id]["pais"]} ${datas[0]["equipos"][id]["motor"]}  ${datas[0]["equipos"][id]["modelo"]} ${datas[0]["equipos"][id]["logoImage"]}` 
                        
  
}









function mostrarEscuderias(elemento) {
  const idd = elemento.getAttribute("data-id")
  document.getElementById("cuadro").style.display = "flex"
  fetchEquipos(idd)
}

function ocultarEscuderias() {
    document.getElementById("cuadro").style.display = "none";
}

function desenfocar() {
    document.body.style.filter = 'blur(2vw)';
  }

  function quitarDesenfoque() {
    document.body.style.filter = 'none';
  }