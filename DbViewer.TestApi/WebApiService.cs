using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http.Formatting;
using System.Reflection;
using System.Web.Http;
using System.Web.Http.Cors;

using Cassandra;
using Cassandra.Mapping.Attributes;

using Microsoft.Owin.Hosting;

using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using Newtonsoft.Json.Serialization;

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
                    config.Formatters.Clear();
                    config.Formatters.Add(new JsonMediaTypeFormatter
                        {
                            SerializerSettings = new JsonSerializerSettings
                                {
                                    Converters = new JsonConverter[] {new CqlObjectPropertyToStringConverter()}
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

        private IDisposable service;
    }

    public class CqlObjectPropertyToStringConverter : JsonConverter
    {
        public override void WriteJson(JsonWriter writer, object value, JsonSerializer serializer)
        {
            var dictionary = new Dictionary<string, object>();
            foreach (var property in value.GetType().GetProperties(BindingFlags.Public | BindingFlags.Instance))
            {
                if (property.PropertyType == typeof(LocalDate) || property.PropertyType == typeof(TimeUuid))
                {
                    dictionary[property.Name] = property.GetValue(value).ToString();
                }
                else
                {
                    dictionary[property.Name] = property.GetValue(value);
                }
            }

            staticSerializer.Serialize(writer, dictionary);
        }

        public override object ReadJson(JsonReader reader, Type objectType, object existingValue, JsonSerializer serializer)
        {
            throw new NotImplementedException();
        }

        public override bool CanConvert(Type objectType)
        {
            return objectType.GetCustomAttributes<TableAttribute>().Any();
        }

        private readonly JsonSerializer staticSerializer = new JsonSerializer {ContractResolver = new DefaultContractResolver()};
    }
}