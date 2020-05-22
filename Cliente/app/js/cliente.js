
function hacerPeticion(metodo, url, params) {
    return new Promise((resolver, rechazar) => {
        const xhr = new XMLHttpRequest();

        xhr.open(metodo, url);
        xhr.onload = function () {
            if (this.status >= 200 && this.status < 300) {
                resolver(this.response);
            } else {
                rechazar({
                    estado: this.status,
                    descripcion: this.statusText
                });
            }
        };
        xhr.onerror = function () {
            rechazar({
                status: this.status,
                statusText: this.statusText
            });
        };

        if (params && typeof params === 'object') {
            params = JSON.stringify(params);
            xhr.setRequestHeader("Content-Type", "application/json");
        }

        xhr.send(params);

    });
}


formularioAJSON = formulario => [].reduce.call(formulario.elements, (data, elemento) => {
    if (!elemento.name || !elemento.value)
        return data;

    data[elemento.name] = elemento.type === 'number' ? elemento.valueAsNumber : elemento.value;

    return data;

}, {});


const formulario = document.getElementById('formulario');

function crearProceso() {
    const valido = formulario.reportValidity();
    if (!valido)
        return;
    let formularioJSON = formularioAJSON(formulario);
    formularioJSON = { ...formularioJSON, idEmpresa: 1, idNomina: "FNX" };
    connection.invoke("SuscribirAProceso", formularioJSON.idEmpresa, formularioJSON.idNomina, formularioJSON.tipo)
        .then(() => {
            console.log(`suscrito al grupo!`);
            hacerPeticion('POST', 'http://localhost:4200/CrearProceso', formularioJSON)
                .then(data => alert(`proceso ${formularioJSON.tipo} creado`))
                .catch(err => alert('error en la petición', err.statusText));
        })
        .catch(err => console.error(err));

}

const listaProcesos = document.getElementById('listaProcesos');
const progresos = {};

crearProgreso = (proceso) => {
    const div = document.createElement('div');
    const li = document.createElement('li');
    const txt = document.createTextNode(proceso.idProceso);
    li.appendChild(txt);
    li.appendChild(div);
    listaProcesos.appendChild(li);
    progresos[proceso.idProceso] = div;
};

notificarAvance = (proceso) => {
    const progreso = progresos[proceso.idProceso];

    if (!progreso) {
        crearProgreso(proceso);
        return;
    }

    if (proceso.terminado) {
        alert(`Proceso ${proceso.idProceso} terminado!`);        
        const li = progreso.parentElement;
        listaProcesos.removeChild(li);
        delete progresos[proceso.idProceso];
        return;
    }    
    progreso.style.width = `${proceso.porcentaje}%`;
};

var connection = new signalR
    .HubConnectionBuilder()
    .configureLogging(signalR.LogLevel.Trace)
    .withUrl('http://localhost:5000/notificacionesHub')
    .withAutomaticReconnect()
    .build();

Object.defineProperty(WebSocket, 'OPEN', { value: 1 });

connection.start()
    .then(() => console.log("Conectado!!"))
    .catch(err => console.error(err));

connection.on('actualizarEstadoProceso', proceso => notificarAvance(proceso));

