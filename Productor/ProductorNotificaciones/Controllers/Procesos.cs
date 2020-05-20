using System.Text.Json;
using Microsoft.AspNetCore.Mvc;
using RabbitMQ.Client;

namespace ProductorNotificaciones.Controllers
{
    [ApiController]
    public class ProcesosController : ControllerBase
    {
        [HttpPost("CrearProceso")]
        public IActionResult CrearProceso([FromBody] Proceso proceso)
        {
            var fabrica = new ConnectionFactory();
            IConnection conn = fabrica.CreateConnection();
            IModel channel = conn.CreateModel();
            channel.ExchangeDeclare("ConsumidorNotificacacion", ExchangeType.Fanout);
            channel.QueueDeclare("ConsumidorNotificacacion", true, false, false, null);
            channel.QueueBind("ConsumidorNotificacacion", "ConsumidorNotificacacion", "", null);
            channel.BasicPublish("ConsumidorNotificacacion", "", null, JsonSerializer.SerializeToUtf8Bytes(proceso));
            channel.Close();
            conn.Close();

            return Ok(proceso);
        }
    }

    public class Proceso
    {
        public string Tipo { get; set; }
        public int Cantidad { get; set; }
    }
}