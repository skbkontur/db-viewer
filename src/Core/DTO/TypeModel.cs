using Kontur.DBViewer.Core.Schemas;

namespace Kontur.DBViewer.Core.DTO
{
    public class TypeModel
    {
        public string Name { get; set; }
        public SchemaDescription SchemaDescription { get; set; }
        public TypeInfo.TypeInfo Shape { get; set; }
    }
}