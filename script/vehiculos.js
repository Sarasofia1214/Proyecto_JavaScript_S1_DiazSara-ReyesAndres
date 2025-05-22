const apiURL = 'https://682a64c2ab2b5004cb3698d4.mockapi.io/formulaone/formula';
const imagenes = document.querySelectorAll('#container_cars_id img');

imagenes.forEach(imagen => {
    imagen.addEventListener('click', async () => {
        const id = imagen.dataset.id;
        try {
            const res = await fetch(`${apiURL}/${id}`);
            const data = await res.json();
            mostrarDetalleExtra(data, imagen.src);
        } catch (error) {
            console.error('Error al obtener datos:', error);
        }
    });
});

function mostrarDetalleExtra(data, imagenSrc) {
    document.getElementById("extraLadoIzquierdo").innerHTML = `
        <p>Equipo: <br><span>${data.escuderia}</span></p>
        <p>Modelo: ${data.nombre} &nbsp;&nbsp; Motor: ${data.motor}</p>
        <p>Aceleración: ${data.aceleracion}</p>
        <p>Velocidad max: ${data.velocidad}</p>
    `;

    document.getElementById("extraLadoDerecho").innerHTML = `
        <p><span>Pilotos:</span><br> ${data.pilotos}</p>
        <p><span>Tipo de conducción:</span> ${data.conduccion}</p>
        <p><span>Velocidad promedio km/h:</span> ${data.velocidad_promedio}</p>
        <p><span>Consumo combustible:</span><br> seco: ${data.combustible_seco}, lluvioso: ${data.combustible_lluvia}, extremo: ${data.combustible_extremo}</p>
        <p><span>Desgaste neumáticos:</span><br> seco: ${data.desgaste_seco}, lluvioso: ${data.desgaste_lluvia}, extremo: ${data.desgaste_extremo}</p>
    `;

    document.getElementById("extraImagenAuto").src = imagenSrc;

    document.getElementById("infoDetalleExtra").style.display = "block";
}

function cerrarDetalleExtra() {
    document.getElementById("infoDetalleExtra").style.display = "none";
}
