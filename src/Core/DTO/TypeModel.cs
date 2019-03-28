using Kontur.DBViewer.Core.Schemas;
using Kontur.DBViewer.Core.TypeInformation;

namespace Kontur.DBViewer.Core.DTO
{
    public class TypeModel
    {
        public string Name { get; set; }
        public SchemaDescription SchemaDescription { get; set; }
        public TypeInfo Shape { get; set; }
    }
}