using Newtonsoft.Json;

namespace Kontur.DBViewer.Core.VNext.DataTypes
{
    public class SearchResult<T>
    {
        [NotNull, ItemNotNull]
        [JsonProperty("items")]
        public T[] Items { get; set; }

        [JsonProperty("count")]
        public int Count { get; set; }
        
        [JsonProperty("countLimit")]
        public int CountLimit { get; set; }
    }
}