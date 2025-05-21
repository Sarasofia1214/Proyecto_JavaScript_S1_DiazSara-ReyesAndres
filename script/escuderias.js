
async function fetchEquipos() {
  let response = await fetch("https://682a64c2ab2b5004cb3698d4.mockapi.io/formulaone/formula")
  let data = await response.json()
  console.log(data)
  renderEquipos(data) // solo pasamos el array de escuderías
  
}

function renderEquipos(parametro) {
  const template = document.getElementById("template");
  const container = document.getElementById("cuadrado");
  const equipos = parametro[0]["equipos"]


  equipos.forEach(equipo=> {
      const clone = template.cloneNode(true);
      clone.style.display = "flex"
      clone.querySelector(".nombre_1").textContent = equipo.nombreCompleto;
      container.appendChild(clone);
     console.log(equipo.nombreCompleto);
  
  });
  
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