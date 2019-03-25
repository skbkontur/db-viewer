namespace Kontur.DBViewer.Core.Schemas
{
    public class SchemaDescription
    {
        public string SchemaName { get; set; }
        public bool EnableDefaultSearch { get; set; }
        public bool Countable { get; set; }
        public int? DefaultCountLimit { get; set; }
        public int? MaxCountLimit { get; set; }
    }
}