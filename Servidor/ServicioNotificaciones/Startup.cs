using System.Text.RegularExpressions;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;

namespace ServicioNotificaciones
{
    public class Startup
    {
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddCors();
            services.AddSignalR();
        }

        public void Configure(IApplicationBuilder app)
        {
            app.UseRouting();

            app.UseCors(builder => builder
                .SetIsOriginAllowed(dominio => Regex.IsMatch(dominio,"http://localhost:\\d+") )
                .AllowAnyHeader()
                .AllowAnyMethod()
                .AllowCredentials()
                );

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapHub<NotificacionHub>("/notificacionHub");
            });
        }
    }
}
