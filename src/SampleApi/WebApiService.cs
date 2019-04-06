using System;
using System.Net.Http.Formatting;
using System.Web.Http;
using System.Web.Http.Cors;
using Microsoft.Owin.Hosting;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using Newtonsoft.Json.Serialization;
using Owin;

namespace Kontur.DBViewer.SampleApi
{
    public class WebApiService
    {
        private IDisposable service;

        public void Start(int port)
        {
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
                                    DateTimeFormat = "yyyy'-'MM'-'dd'T'HH':'mm':'ss.fffffffK"
                                }
                            }
                        },
                    });
                    config.EnsureInitialized();
                    appBuilder.UseWebApi(config);
                });
        }

        public void Stop()
        {
            service.Dispose();
        }
    }
}