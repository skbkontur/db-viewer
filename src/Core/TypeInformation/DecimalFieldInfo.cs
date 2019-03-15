namespace Kontur.DBViewer.Core.TypeInformation
{
    public class DecimalFieldInfo : FieldInfo
    {
        public DecimalFieldInfo(bool canBeNull, FieldMeta meta)
        {
            CanBeNull = canBeNull;
            Meta = meta;
        }

        public bool CanBeNull { get; }
        public override FieldType Type => FieldType.Decimal;
    }
}