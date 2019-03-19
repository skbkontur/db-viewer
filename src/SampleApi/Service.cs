using System;
using System.Net.Http.Formatting;
using System.Web.Http;
using System.Web.Http.Cors;

using Alko.Configuration.Settings;

using Microsoft.Owin.Hosting;

using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using Newtonsoft.Json.Serialization;

using Owin;

using Topshelf;

namespace Kontur.DBViewer.SampleApi
{
    public class Service : ServiceControl
    {
        private IDisposable service;

        public bool Start(HostControl hostControl)
        {
            try
            {
                var applicationSettings = ApplicationSettings.LoadDefault("sampleApi.csf");
                var port = applicationSettings.GetInt("ListeningPort");
                service = WebApp.Start(
                    $"http://*:{port}",
                    appBuilder =>
                    {
                        var config = new HttpConfiguration();
                        var cors = new EnableCorsAttribute("*", "*", "*");
                        config.EnableCors(cors);
                        config.MapHttpAttributeRoutes();
                        config.Formatters.Clear();
                        config.Formatters.Add(new JsonMediaTypeFormatter
                        {
                            SerializerSettings = new JsonSerializerSettings
                            {
                                ContractResolver = new CamelCasePropertyNamesContractResolver(),
                                Converters = new JsonConverter[]
                                {
                                    new StringEnumConverter(),
                                    new IsoDateTimeConverter
                                    {
                                        DateTimeFormat = "yyyy'-'MM'-'dd'T'HH':'mm':'ss.fffK"
                                    }
                                }
                            },
                        });
                        config.EnsureInitialized();
                        appBuilder.UseWebApi(config);
                    });
                Console.WriteLine("Service started (for service runner)");
                return true;
            }
            catch
            {
                return false;
            }
        }

        public bool Stop(HostControl hostControl)
        {
            try
            {
                service.Dispose();
                return true;
            }
            catch
            {
                return false;
            }
        }
    }
}