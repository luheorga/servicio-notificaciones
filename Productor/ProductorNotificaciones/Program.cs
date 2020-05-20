using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

namespace ProductorNotificaciones
{
    class Program
    {
        public static void Main(string[] args)
        {
            CreateHostBuilder(args).Build().Run();
        }

        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .ConfigureWebHostDefaults(webBuilder =>
                {
                    webBuilder.UseUrls("http://localhost:4200/");
                    webBuilder.ConfigureServices((services) =>
                    {
                        services.AddControllers();
                        services.AddCors();
                    });
                    webBuilder.Configure(app =>
                    {
                        app.UseCors(a => 
                            a.SetIsOriginAllowed(o => o.Contains("localhost"))
                            .AllowAnyMethod()
                            .AllowAnyHeader()
                        );
                        app.UseRouting();
                        app.UseEndpoints(e =>
                        {
                            e.MapControllers();
                        });
                    });
                });
    }
}
