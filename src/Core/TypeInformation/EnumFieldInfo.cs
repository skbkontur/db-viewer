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

        public EnumFieldInfo()
        {
        }

        public bool CanBeNull { get; set; }
        public override FieldType Type => FieldType.Enum;
        public string[] AvailableValues { get; set; }
    }
}