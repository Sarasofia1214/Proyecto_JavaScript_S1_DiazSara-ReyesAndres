async function fetchPilotos() {
    let response = await fetch("https://682a64c2ab2b5004cb3698d4.mockapi.io/formulaone/formula")
    let data = await response.json()
    console.log(data)
    renderPilotos(data)
}

function renderPilotos(parametro) {
    const template = document.getElementById("template");
    const container = document.getElementById("container_pilotos");
    container.innerHTML = ""; // limpia antes de insertar
    const pilotos = parametro[0][`pilotos`]
    
    console.log(pilotos)

    pilotos.forEach(piloto => {
        const clone = template.cloneNode(true);
        clone.style.display = "flex"
        clone.querySelector("#img_piloto").src = piloto["foto"] || "default.jpg";
        clone.querySelector("#img_bandera").src = piloto["bandera"];
        clone.querySelector("#name_piloto").textContent = piloto["nombre"];
        //clone.querySelector("#team_piloto").textContent = piloto["equipo"];
        clone.querySelector("#posicion").textContent = piloto["Podiums"];;

        container.appendChild(clone);
    });
}

fetchPilotos()
