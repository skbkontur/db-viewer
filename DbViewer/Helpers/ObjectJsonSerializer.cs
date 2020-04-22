using System;
using System.Collections.Generic;

using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace SkbKontur.DbViewer.Helpers
{
    public class ObjectJsonSerializer : JsonConverter
    {
        public override void WriteJson(JsonWriter writer, object? value, JsonSerializer serializer)
        {
            staticSerializer.Serialize(writer, value);
        }

        public override object? ReadJson(JsonReader reader, Type objectType, object? existingValue, JsonSerializer serializer)
        {
            throw new NotImplementedException();
        }

        public override bool CanConvert(Type objectType)
        {
            return objectType == typeof(Dictionary<string, object>) || objectType == typeof(object[]);
        }

        public override bool CanRead => false;

        private static readonly JsonSerializer staticSerializer = new JsonSerializer {Converters = {new StringEnumConverter()}};
    }
}