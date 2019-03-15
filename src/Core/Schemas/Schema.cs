using Kontur.DBViewer.Core.Searcher;

namespace Kontur.DBViewer.Core.Schemas
{
    public class Schema
    {
        public SchemaDescription Description { get; set; }
        public IObjectsSearcherFactory SearcherFactory { get; set; }
        public ITypeInfoExtractor TypeInfoExtractor { get; set; }
        public TypeDescription[] Types { get; set; }
    }
}