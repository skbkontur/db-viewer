using Newtonsoft.Json;

namespace Kontur.DBViewer.Core.VNext.DataTypes
{
    public class Sort
    {
        [JsonProperty("path")]
        public string Path { get; set; }

        [JsonProperty("sortOrder")]
        public ObjectFilterSortOrder SortOrder { get; set; }
    }
}