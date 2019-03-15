namespace Kontur.DBViewer.Core.TypeInformation
{
    public class EnumFieldInfo : FieldInfo
    {
        public EnumFieldInfo(bool canBeNull, string[] availableValues, FieldMeta meta)
        {
            CanBeNull = canBeNull;
            AvailableValues = availableValues;
            Meta = meta;
        }

        public bool CanBeNull { get; }
        public override FieldType Type => FieldType.Enum;
        public string[] AvailableValues { get; }
    }
}