using Newtonsoft.Json;

namespace SkbKontur.DbViewer.DataTypes
{
    public class ObjectDetails
    {
        [JsonProperty("object")]
        public object Object { get; set; }

        [NotNull]
        [JsonProperty("meta")]
        public ObjectDescription Meta { get; set; }
    }
}