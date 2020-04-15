using Newtonsoft.Json;

namespace SkbKontur.DbViewer.DataTypes
{
    public class ObjectUpdateRequest
    {
        [NotNull, ItemNotNull]
        [JsonProperty("conditions")]
        public Condition[] Conditions { get; set; }

        [NotNull, ItemNotNull]
        [JsonProperty("path")]
        public string[] Path { get; set; }

        [CanBeNull]
        [JsonProperty("value")]
        public string Value { get; set; }
    }
}