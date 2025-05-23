
const AppState = {
    apiData: null,
    currentCircuitIndex: null,
    isLoading: false
};

const CONFIG = {
    API_BASE_URL: "https://682a64c2ab2b5004cb3698d4.mockapi.io/formulaone/formula",
    FORMULA_MAIN_ID: "1",
    SELECTORS: {
        circuitContainer: ".circuitos_container",
        principalView: "#principal",
        detailContainer: "#nombre_1"
    }
};


const Utils = {
    createSafeId(name, fallbackPrefix = 'circuit', index = 0) {
        if (name && typeof name === 'string') {
            return name.replace(/\s+/g, '_').toLowerCase().replace(/[^a-z0-9_]/g, '');
        }
        return `${fallbackPrefix}-${index}`;
    },

    validateCircuitData(circuit) {
        const errors = [];
        if (!circuit.nombre || circuit.nombre.trim() === '') {
            errors.push('El nombre del circuito es obligatorio');
        }
        if (circuit.numero_vueltas && (isNaN(circuit.numero_vueltas) || circuit.numero_vueltas <= 0)) {
            errors.push('El número de vueltas debe ser un número positivo');
        }
        if (circuit.longitud_circuito_km && (isNaN(circuit.longitud_circuito_km) || circuit.longitud_circuito_km <= 0)) {
            errors.push('La longitud del circuito debe ser un número positivo');
        }
        return errors;
    },

    showLoading(container, message = 'Cargando...') {
        if (container) {
            container.innerHTML = `<div class="loading-message">${message}</div>`;
        }
    },

    showError(container, message = 'Ha ocurrido un error') {
        if (container) {
            container.innerHTML = `<div class="error-message">${message}</div>`;
        }
    }
};


const ApiService = {
   
    async fetchData() {
        const response = await fetch(`${CONFIG.API_BASE_URL}/${CONFIG.FORMULA_MAIN_ID}`);
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status} - ${response.statusText}`);
        }
        return await response.json();
    },

    async updateData(updatedData) {
        const response = await fetch(`${CONFIG.API_BASE_URL}/${CONFIG.FORMULA_MAIN_ID}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedData)
        });

        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status} - ${response.statusText}`);
        }
        return await response.json();
    }
};

const UIRenderer = {
    renderCircuitGrid() {
        const container = document.querySelector(CONFIG.SELECTORS.circuitContainer);
        if (!container) {
            console.error('Container element not found');
            return;
        }

        container.innerHTML = '';

        if (!AppState.apiData?.circuito?.length) {
            container.innerHTML = '<div class="no-data-message">No hay circuitos disponibles para mostrar.</div>';
            return;
        }

        AppState.apiData.circuito.forEach((circuito, index) => {
            const imgContainer = document.createElement('div');
            imgContainer.className = 'circuit-item';
            
            const img = document.createElement('img');
            img.src = circuito.imagen || '';
            img.alt = circuito.nombre || 'Circuito';
            img.id = Utils.createSafeId(circuito.nombre, 'circuit', index);
            img.setAttribute('data-id', index);
            img.className = 'circuit-image';
            
            img.onerror = function() {
                this.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlbiBubyBkaXNwb25pYmxlPC90ZXh0Pjwvc3ZnPg==';
                this.alt = 'Imagen no disponible';
            };
            
            img.onclick = () => CircuitManager.showCircuitDetail(index);
            
            const title = document.createElement('div');
            title.className = 'circuit-title';
            title.textContent = circuito.nombre || `Circuito ${index + 1}`;
            
            imgContainer.appendChild(img);
            imgContainer.appendChild(title);
            container.appendChild(imgContainer);
        });
    },

    renderCircuitDetail(circuitIndex) {
        const container = document.getElementById("nombre_1");
        if (!container) {
            console.error('Detail container not found');
            return;
        }

        if (!AppState.apiData?.circuito?.[circuitIndex]) {
            Utils.showError(container, 'Circuito no encontrado');
            return;
        }

        const circuito = AppState.apiData.circuito[circuitIndex];
        const teamName = AppState.apiData.equipos?.[circuitIndex]?.nombre || 'N/A';

        container.innerHTML = `
            <div class="circuit-card">
                <div class="circuit-header">
                    <h1 class="circuit-title">${circuito.nombre || 'N/A'}</h1>
                    <div class="circuit-year">${circuito.primer_gran_premio || 'N/A'}</div>
                </div>
                <div class="circuit-stats">
                    <div class="stat-item">
                        <div class="stat-label">Longitud</div>
                        <div class="stat-value">${circuito.longitud_circuito_km ? `${circuito.longitud_circuito_km} km` : 'N/A'}</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-label">Equipo Asociado</div>
                        <div class="stat-value">${teamName}</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-label">Vueltas</div>
                        <div class="stat-value">${circuito.numero_vueltas || 'N/A'}</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-label">Récord de Vuelta</div>
                        <div class="stat-value">
                            ${circuito.record_vuelta?.tiempo ? 
                                `${circuito.record_vuelta.tiempo} (${circuito.record_vuelta.piloto || 'N/A'}, ${circuito.record_vuelta.año || 'N/A'})` : 
                                'N/A'}
                        </div>
                    </div>
                </div>
                <div class="circuit-image-container">
                    <img src="${circuito.imagen || ''}" class="circuitojava" alt="Imagen del circuito" 
                         onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjBmMGYwIiBzdHJva2U9IiNkZGQiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE2IiBmaWxsPSIjOTk5IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+SW1hZ2VuIG5vIGRpc3BvbmlibGU8L3RleHQ+PC9zdmc+'">
                </div>
                <p class="descripcionjava">${circuito.descripcion || 'Sin descripción disponible'}</p>
                <div class="container_botones">
                    <button class="btn-edit" id="editCircuitBtn" title="Editar circuito">Editar</button>
                    <button class="btn-delete" id="deleteCircuitBtn" title="Eliminar circuito">Eliminar</button>
                    <button class="btn-new" id="newCircuitBtn" title="Crear nuevo circuito">Nuevo</button>
                </div>
            </div>
        `;

        this.attachDetailEventListeners(circuitIndex);
    },

    attachDetailEventListeners(circuitIndex) {
        const editBtn = document.getElementById("editCircuitBtn");
        const deleteBtn = document.getElementById("deleteCircuitBtn");
        const newBtn = document.getElementById("newCircuitBtn");

        if (editBtn) editBtn.addEventListener("click", () => CrudOperations.editCircuit(circuitIndex));
        if (deleteBtn) deleteBtn.addEventListener("click", () => CrudOperations.deleteCircuit(circuitIndex));
        if (newBtn) newBtn.addEventListener("click", () => CrudOperations.addCircuit());
    }
};

const CircuitManager = {
    
    async loadAndRenderGrid() {
        const container = document.querySelector(CONFIG.SELECTORS.circuitContainer);
        if (!container) return;

        if (AppState.isLoading) return;
        AppState.isLoading = true;

        try {
            Utils.showLoading(container, 'Cargando circuitos...');
            AppState.apiData = await ApiService.fetchData();
            UIRenderer.renderCircuitGrid();
        } catch (error) {
            console.error("Error loading circuits:", error);
            Utils.showError(container, 'Error al cargar los circuitos. Por favor, inténtalo de nuevo más tarde.');
        } finally {
            AppState.isLoading = false;
        }
    },

   
    async showCircuitDetail(circuitIndex) {
        const detailView = document.getElementById("principal");
        const detailContainer = document.getElementById("nombre_1");
        
        if (!detailView || !detailContainer) return;

        try {
            if (!AppState.apiData) {
                Utils.showLoading(detailContainer, 'Cargando datos del circuito...');
                AppState.apiData = await ApiService.fetchData();
            }

            AppState.currentCircuitIndex = parseInt(circuitIndex);
            detailView.style.display = "flex";
            UIRenderer.renderCircuitDetail(circuitIndex);
        } catch (error) {
            console.error("Error loading circuit details:", error);
            Utils.showError(detailContainer, 'Error al cargar los datos del circuito');
        }
    },

    
    hideCircuitDetail() {
        const detailView = document.getElementById("principal");
        if (detailView) {
            detailView.style.display = "none";
        }
        AppState.currentCircuitIndex = null;
    }
};

const CrudOperations = {
   
    async addCircuit() {
        try {
            const circuitData = await this.getCircuitDataFromUser();
            if (!circuitData) return;

            const validationErrors = Utils.validateCircuitData(circuitData);
            if (validationErrors.length > 0) {
                alert(`Errores de validación:\n${validationErrors.join('\n')}`);
                return;
            }

            if (!AppState.apiData) {
                AppState.apiData = await ApiService.fetchData();
            }

            const updatedData = { ...AppState.apiData };
            if (!updatedData.circuito) updatedData.circuito = [];
            updatedData.circuito.push(circuitData);

            await ApiService.updateData(updatedData);
            AppState.apiData = updatedData;
            
            alert("Circuito añadido");
            await CircuitManager.loadAndRenderGrid();
            CircuitManager.showCircuitDetail(updatedData.circuito.length - 1);
            
        } catch (error) {
            console.error(error);
            alert("Error al añadir el circuito.");
        }
    },


    async editCircuit(index) {
        if (!AppState.apiData?.circuito?.[index]) {
            alert("No hay circuito seleccionado para editar");
            return;
        }

        try {
            const currentCircuit = AppState.apiData.circuito[index];
            const updatedData = await this.getCircuitDataFromUser(currentCircuit);
            if (!updatedData) return;

            const validationErrors = Utils.validateCircuitData(updatedData);
            if (validationErrors.length > 0) {
                alert(`Errores de validación:\n${validationErrors.join('\n')}`);
                return;
            }

            const apiData = { ...AppState.apiData };
            apiData.circuito[index] = updatedData;

            await ApiService.updateData(apiData);
            AppState.apiData = apiData;
            
            alert("Circuito editado con éxito");
            await CircuitManager.loadAndRenderGrid();
            CircuitManager.showCircuitDetail(index);
            
        } catch (error) {
            console.error("Error editing circuit:", error);
            alert("Error al editar el circuito. Por favor, inténtalo de nuevo.");
        }
    },

    async deleteCircuit(index) {
        if (!AppState.apiData?.circuito?.[index]) {
            alert("No hay circuito seleccionado para eliminar");
            return;
        }

        const circuitName = AppState.apiData.circuito[index].nombre || 'este circuito';
        
        if (!confirm(`¿Estás seguro de que quieres eliminar "${circuitName}"? Esta acción es irreversible.`)) {
            return;
        }

        try {
            const updatedData = { ...AppState.apiData };
            updatedData.circuito.splice(index, 1);

            await ApiService.updateData(updatedData);
            AppState.apiData = updatedData;
            
            alert("Circuito eliminado con éxito");
            CircuitManager.hideCircuitDetail();
            await CircuitManager.loadAndRenderGrid();
            
        } catch (error) {
            console.error("Error deleting circuit:", error);
            alert("Error al eliminar el circuito. Por favor, inténtalo de nuevo.");
        }
    },

    async getCircuitDataFromUser(existingData = {}) {
        const nombre = prompt("Nombre del circuito:", existingData.nombre || '');
        if (nombre === null) return null; 

        const imagen = prompt("URL de la imagen:", existingData.imagen || '');
        const primerGranPremio = prompt("Año del primer Gran Premio:", existingData.primer_gran_premio || '');
        const numeroVueltas = prompt("Número de vueltas:", existingData.numero_vueltas || '');
        const longitudKm = prompt("Longitud en km:", existingData.longitud_circuito_km || '');
        const recordTiempo = prompt("Tiempo récord:", existingData.record_vuelta?.tiempo || '');
        const recordPiloto = prompt("Piloto del récord:", existingData.record_vuelta?.piloto || '');
        const recordAño = prompt("Año del récord:", existingData.record_vuelta?.año || '');
        const descripcion = prompt("Descripción:", existingData.descripcion || '');

        return {
            nombre: nombre?.trim() || '',
            imagen: imagen?.trim() || '',
            primer_gran_premio: primerGranPremio?.trim() || '',
            numero_vueltas: parseInt(numeroVueltas) || 0,
            longitud_circuito_km: parseFloat(longitudKm) || 0,
            record_vuelta: {
                tiempo: recordTiempo?.trim() || '',
                piloto: recordPiloto?.trim() || '',
                año: parseInt(recordAño) || 0
            },
            descripcion: descripcion?.trim() || ''
        };
    }
};

function mostrarCircuitos(elemento) {
    const index = elemento.getAttribute("data-id");
    CircuitManager.showCircuitDetail(index);
}

function ocultarCircuitos() {
    CircuitManager.hideCircuitDetail();
}

function loadAllCircuitsAndRenderGrid() {
    return CircuitManager.loadAndRenderGrid();
}

document.addEventListener("DOMContentLoaded", () => {
    CircuitManager.loadAndRenderGrid();
});