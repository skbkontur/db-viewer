namespace Kontur.DBViewer.Core.TypeInformation
{
    public class LongFieldInfo : FieldInfo
    {
        public LongFieldInfo(bool canBeNull, FieldMeta meta)
        {
            CanBeNull = canBeNull;
            Meta = meta;
        }

        public LongFieldInfo()
        {
        }

        public bool CanBeNull { get; set; }
        public override FieldType Type => FieldType.Long;
    }
}