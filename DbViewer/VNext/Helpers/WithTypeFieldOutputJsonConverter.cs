using System;

using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json.Serialization;

namespace SkbKontur.DbViewer.VNext.Helpers
{
    public class WithTypeFieldOutputJsonConverter<T> : JsonConverter
    {
        public WithTypeFieldOutputJsonConverter()
        {
            internalSerializer = new JsonSerializer
                {
                    Converters = {new StringEnumConverter()},
                    ContractResolver = new CamelCasePropertyNamesContractResolver()
                };
        }

        public override void WriteJson(JsonWriter writer, object value, JsonSerializer serializer)
        {
            if (value == null)
            {
                writer.WriteNull();
            }
            else
            {
                var result = JObject.FromObject(value, internalSerializer);
                result["type"] = JToken.FromObject(value.GetType().Name);
                writer.WriteToken(result.CreateReader(), true);
            }
        }

        public override object ReadJson(JsonReader reader, Type objectType, object existingValue, JsonSerializer serializer)
        {
            throw new NotSupportedException();
        }

        public override bool CanConvert(Type objectType)
        {
            return typeof(T).IsAssignableFrom(objectType);
        }

        private readonly JsonSerializer internalSerializer;
    }
}