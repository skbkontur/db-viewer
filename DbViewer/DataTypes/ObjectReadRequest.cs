using Newtonsoft.Json;

namespace SkbKontur.DbViewer.DataTypes
{
    public class ObjectReadRequest
    {
        [JsonProperty("conditions")]
        public Condition[] Conditions { get; set; }
    }
}