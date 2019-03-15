using Kontur.DBViewer.Core.Searcher;

namespace Kontur.DBViewer.Core.TypeInformation
{
    public abstract class FieldInfo
    {
        public abstract FieldType Type { get; }
        public FieldMeta Meta { get; set; }
    }

    public class FieldMeta
    {
        public FieldMeta(string name)
        {
            Name = name;
        }

        public string Name { get; set; }
        public bool IsIdentity { get; set; }
        public bool IsSearchable { get; set; }
        public bool IsRequired { get; set; }
        public FilterType[] AvailableFilters { get; set; }
    }
}