using Newtonsoft.Json;

namespace SkbKontur.DbViewer.Dto
{
    public class TypesListModel
    {
        [JsonProperty("types")]
        public TypeModel[] Types { get; set; }
    }
}