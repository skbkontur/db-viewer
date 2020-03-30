using Newtonsoft.Json;

namespace SkbKontur.DbViewer.VNext.DataTypes
{
    public class Sort
    {
        [JsonProperty("path")]
        public string Path { get; set; }

        [JsonProperty("sortOrder")]
        public ObjectFilterSortOrder SortOrder { get; set; }
    }
}