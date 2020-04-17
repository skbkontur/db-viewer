using System;
using System.Web.Http;
using System.Web.Http.Cors;

using Microsoft.Owin.Hosting;

using Owin;

namespace SkbKontur.DbViewer.TestApi
{
    public class WebApiService
    {
        public void Start(int port)
        {
            service = WebApp.Start($"http://*:{port}", appBuilder =>
                {
                    var config = new HttpConfiguration();
                    var cors = new EnableCorsAttribute("*", "*", "*");
                    config.EnableCors(cors);
                    config.MapHttpAttributeRoutes();
                    config.EnsureInitialized();
                    appBuilder.UseWebApi(config);
                });
        }

        public void Stop()
        {
            service.Dispose();
        }

        private IDisposable service;
    }
}