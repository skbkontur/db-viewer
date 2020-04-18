using Newtonsoft.Json;

namespace SkbKontur.DbViewer.DataTypes
{
    public class ObjectUpdateRequest
    {
        [JsonProperty("conditions")]
        public Condition[] Conditions { get; set; }

        [JsonProperty("path")]
        public string[] Path { get; set; }

        [JsonProperty("value")]
        public string? Value { get; set; }
    }
}