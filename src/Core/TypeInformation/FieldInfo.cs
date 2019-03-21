namespace Kontur.DBViewer.Core.TypeInformation
{
    public abstract class FieldInfo
    {
        public abstract FieldType Type { get; }
        public FieldMeta Meta { get; set; }
    }
}