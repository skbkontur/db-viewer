namespace Kontur.DBViewer.Core.TypeInformation
{
    public class IntFieldInfo : FieldInfo
    {
        public IntFieldInfo(bool canBeNull, FieldMeta meta)
        {
            CanBeNull = canBeNull;
            Meta = meta;
        }

        public bool CanBeNull { get; }
        public override FieldType Type => FieldType.Int;
    }
}