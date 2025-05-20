
async function fetchEquipos() {
  let response = await fetch("https://682a64c2ab2b5004cb3698d4.mockapi.io/formulaone/formula")
  let data = await response.json()
  console.log(data)
  renderEquipos(data)
}

function renderEquipos(parametro) {
  const template = document.getElementById("template");
  const container = document.getElementById("container_escuderia");
  
  const escuderia = parametro[0]["equipos"]



 escuderia.forEach(escuderia => {
      const clone = template.cloneNode(true);
      clone.style.display = "flex"
      clone.querySelector(".nombre_1").textContent = escuderia ["nombreCompleto"];
      clone.querySelector(".pais_1").textContent = escuderia ["pais"];
      clone.querySelector(".modelo_1").textContent = escuderia ["modelo"];
      clone.querySelector(".entrada_1").textContent = escuderia ["entradaEquipo"]
  
  
  
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