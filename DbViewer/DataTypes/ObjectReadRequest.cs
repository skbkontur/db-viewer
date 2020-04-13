using Newtonsoft.Json;

namespace SkbKontur.DbViewer.DataTypes
{
    public class ObjectReadRequest
    {
        [NotNull, ItemNotNull]
        [JsonProperty("conditions")]
        public Condition[] Conditions { get; set; }
    }
}