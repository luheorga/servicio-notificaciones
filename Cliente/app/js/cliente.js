
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
    const formularioJSON = formularioAJSON(formulario);
    hacerPeticion('POST', 'http://localhost:4200/CrearProceso', formularioJSON)
        .then(data => alert('Proceso creado correctamente'))
        .catch(err => alert('error en la petición', err.statusText));
}



// var connection = new signalR
//     .HubConnectionBuilder()
//     .withUrl('http://localhost:5000/notificacionHub')
//     .withAutomaticReconnect()
//     .build();

// Object.defineProperty(WebSocket, 'OPEN', { value: 1 });

// connection.start()
//     .then(() => console.log("Conectado!!"))
//     .catch(err => console.error(err.toString()));
