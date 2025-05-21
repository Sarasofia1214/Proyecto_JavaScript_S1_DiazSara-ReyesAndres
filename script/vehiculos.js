function mostrarDetalle(id) {
  fetch(`https://682a64c2ab2b5004cb3698d4.mockapi.io/formulaone/formula/${id}`)
    .then(res => res.json())
    .then(data => {

      document.getElementById("ladoIzquierdo").innerHTML = `
        <p><strong>Equipo:</strong><br> ${data.equipo}</p>
        <p><strong>Modelo:</strong> ${data.modelo}<br><strong>Motor:</strong> ${data.motor}</p>
        <p><strong>Aceleración:</strong> ${data.aceleracion}</p>
        <p><strong>Velocidad máx:</strong><br> ${data.velocidadMax}</p>
      `;

   
      document.getElementById("ladoDerecho").innerHTML = `
        <p><strong style="color:red">Pilotos:</strong><br> ${data.pilotos}</p>
        <p><strong style="color:red">Tipo de conducción:</strong> ${data.tipoConduccion}</p>
        <p><strong style="color:red">Velocidad promedio km/h:</strong> ${data.velocidadPromedio}</p>
        <p><strong style="color:red">Consumo combustible:</strong><br>
           seco: ${data.consumoSeco}, lluvioso: ${data.consumoLluvia}, extremo: ${data.consumoExtremo}</p>
        <p><strong style="color:red">Desgaste neumáticos:</strong><br>
           seco: ${data.desgasteSeco}, lluvioso: ${data.desgasteLluvia}, extremo: ${data.desgasteExtremo}</p>
      `;


      document.getElementById("imagenAuto").src = data.imagen;

   
      document.getElementById("infoDetalle").style.display = "block";
    })
    .catch(error => {
      console.error("Error al obtener los datos:", error);
      alert("Hubo un problema al cargar la información.");
    });
}

function cerrarDetalle() {
  document.getElementById("infoDetalle").style.display = "none";
}
