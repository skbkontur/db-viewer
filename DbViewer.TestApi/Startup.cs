using System.Threading.Tasks;

using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.Extensions;
using Microsoft.AspNetCore.Mvc.Controllers;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

using SkbKontur.DbViewer.TestApi.EntityFramework;

namespace SkbKontur.DbViewer.TestApi
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddControllers().AddNewtonsoftJson();
            services.AddDbContext<EntityFrameworkDbContext>(options => options.UseNpgsql(EntityFrameworkDbContext.ConnectionString));
            services.AddSingleton<IControllerFactory>(new GroboControllerFactory());
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
                app.UseDeveloperExceptionPage();

            app.UseRouting();
            app.UseStaticFiles();

            app.UseEndpoints(endpoints =>
                {
                    endpoints.MapControllers();

                    if (env.WebRootFileProvider.GetFileInfo("index.html").Exists)
                    {
                        endpoints.MapFallbackToFile("index.html");
                    }
                    else
                    {
                        endpoints.MapFallback(context =>
                            {
                                var scheme = context.Request.Scheme;
                                var host = new HostString(context.Request.Host.Host, 8080);
                                context.Response.Redirect($"{scheme}://{host}{context.Request.GetEncodedPathAndQuery()}");
                                return Task.CompletedTask;
                            });
                    }
                });
        }
    }
}