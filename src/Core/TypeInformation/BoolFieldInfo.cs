namespace Kontur.DBViewer.Core.TypeInformation
{
    public class BoolFieldInfo : FieldInfo
    {
        public BoolFieldInfo()
        {
        }

        public BoolFieldInfo(bool canBeNull, FieldMeta meta)
        {
            CanBeNull = canBeNull;
            Meta = meta;
        }

        public bool CanBeNull { get; set; }
        public override FieldType Type => FieldType.Bool;
    }
}