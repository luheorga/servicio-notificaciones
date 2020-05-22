using Microsoft.AspNetCore.Mvc;
using MassTransit;
using System.Threading.Tasks;
using Mensajes;
using System.Linq;
using System.Threading;

namespace ProductorNotificaciones.Controllers
{
    [ApiController]
    public class ProcesosController : ControllerBase
    {
        private readonly IPublishEndpoint _publicador;

        public ProcesosController(IPublishEndpoint publicador)
        {
            _publicador = publicador;
        }
        [HttpPost("CrearProceso")]
        public async Task<IActionResult> CrearProceso([FromBody] Proceso proceso)
        {
            var procesoProgreso = new
            {
                IdEmpresa = proceso.IdEmpresa,
                IdNomina = proceso.IdNomina,
                IdProceso = proceso.Tipo,
                TotalRegistros = proceso.Cantidad
            };
            await _publicador.Publish<ICrearProcesoProgreso>(procesoProgreso);
            CrearNotificacionesProgreso(procesoProgreso);
            return Ok(procesoProgreso);
        }


        private async Task CrearNotificacionesProgreso(dynamic proceso)
        {
            foreach (var indice in Enumerable.Range(0, proceso.TotalRegistros))
                await _publicador.Publish<INotificarProgreso>(proceso);
        }
    }


    public class Proceso
    {
        public int IdEmpresa { get; set; }
        public string IdNomina { get; set; }
        public string Tipo { get; set; }
        public int Cantidad { get; set; }
    }
}

namespace Mensajes
{
    public interface ICrearProcesoProgreso
    {
        int IdEmpresa { get; }
        string IdNomina { get; }
        string IdProceso { get; }
        int TotalRegistros { get; }
    }

    public interface INotificarProgreso
    {
        int IdEmpresa { get; }
        string IdNomina { get; }
        string IdProceso { get; }
    }
}