namespace Kontur.DBViewer.Core.TypeInformation
{
    public class ByteFieldInfo : FieldInfo
    {
        public ByteFieldInfo(bool canBeNull, FieldMeta meta)
        {
            CanBeNull = canBeNull;
            Meta = meta;
        }

        public bool CanBeNull { get; }
        public override FieldType Type => FieldType.Byte;
    }
}