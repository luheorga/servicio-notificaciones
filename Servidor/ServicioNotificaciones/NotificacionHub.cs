using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;

namespace ServicioNotificaciones
{
    public class NotificacionHub : Hub
    {
        public async Task EnviarMensaje(string mensaje)
        {
            await Clients.All.SendAsync("MostrarMensaje", mensaje);
        }
    }
}