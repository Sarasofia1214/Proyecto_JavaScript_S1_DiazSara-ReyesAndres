function mostrarInfoCars() {

    document.getElementById("container_cars_id").style.display = "flex"
    ;
}

function ocultarCars() {
    document.getElementById("container_cars_id").style.display = "none";
}

function desenfocar() {
    document.body.style.filter = 'blur(2vw)';
  }

  function quitarDesenfoque() {
    document.body.style.filter = 'none';
  }
