namespace Kontur.DBViewer.Core.TypeInformation
{
    public class LongFieldInfo : FieldInfo
    {
        public LongFieldInfo(bool canBeNull, FieldMeta meta)
        {
            CanBeNull = canBeNull;
            Meta = meta;
        }

        public bool CanBeNull { get; }
        public override FieldType Type => FieldType.Long;
    }
}