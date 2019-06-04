namespace Kontur.DBViewer.Core.TypeInformation
{
    public class ByteFieldInfo : FieldInfo
    {
        public ByteFieldInfo(bool canBeNull, FieldMeta meta)
        {
            CanBeNull = canBeNull;
            Meta = meta;
        }

        public ByteFieldInfo()
        {
        }

        public bool CanBeNull { get; set; }
        public override FieldType Type => FieldType.Byte;
    }
}