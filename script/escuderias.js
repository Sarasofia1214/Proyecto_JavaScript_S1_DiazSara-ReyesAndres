
async function fetchEquipos() {
  let response = await fetch("https://682a64c2ab2b5004cb3698d4.mockapi.io/formulaone/formula")
  let data = await response.json()
  console.log(data)
  renderEquipos(data) // solo pasamos el array de escuderías
  
}

function renderEquipos(datas) {

  const container = document.getElementById("nombre_1");
 
  const equipos = datas[0]["equipos"]
  for (let i = 0; i<equipos.length;i++){
    let equipo = equipos
    container.innerHTML += `${equipos[i]["nombreCompleto"]}`
    
      
  

  }
  
}

fetchEquipos()








function mostrarEscuderias() {
    
    document.getElementById("cuadro").style.display = "flex"
    ;
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