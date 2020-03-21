using Newtonsoft.Json;

namespace Kontur.DBViewer.Core.VNext.DataTypes
{
    public class Sort
    {
        [JsonProperty("path")]
        public string Path { get; set; }

        [JsonProperty("sortOrder")]
        public BusinessObjectFilterSortOrder SortOrder { get; set; }
    }
}