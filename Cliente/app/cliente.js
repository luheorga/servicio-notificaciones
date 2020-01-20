
var connection = new signalR
    .HubConnectionBuilder()
    .withUrl('http://localhost:5000/notificacionHub')    
    .build();

enviar = document.getElementById('enviar');

enviar.disabled = true;

connection.on('MostrarMensaje', mensaje => alert(mensaje));

connection.start()
    .then(() => enviar.disabled = false)
    .catch(err => console.error(err.toString()));

mostrarMensaje = () => {
    connection
        .invoke('EnviarMensaje', 'Mensaje enviado a travez de signalR!')
        .catch(err => console.error(err.toString()));
}