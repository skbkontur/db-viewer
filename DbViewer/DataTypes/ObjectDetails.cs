using Newtonsoft.Json;

using SkbKontur.DbViewer.Helpers;

namespace SkbKontur.DbViewer.DataTypes
{
    public class ObjectDetails
    {
        [JsonProperty("object")]
        [JsonConverter(typeof(ObjectJsonSerializer))]
        public object Object { get; set; }

        [JsonProperty("meta")]
        public ObjectDescription Meta { get; set; }
    }
}