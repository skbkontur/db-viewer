namespace Kontur.DBViewer.Core.DTO.TypeInfo
{
    public class PropertyDescription
    {
        public string Name { get; set; }
        public bool IsIdentity { get; set; }
        public bool IsSearchable { get; set; }
        public bool IsSortable { get; set; }
        public bool IsRequired { get; set; }
        public FilterType[] AvailableFilters { get; set; }
    }
}