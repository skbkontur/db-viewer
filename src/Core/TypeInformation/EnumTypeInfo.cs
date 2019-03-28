namespace Kontur.DBViewer.Core.TypeInformation
{
    public class EnumTypeInfo : TypeInfo
    {
        public EnumTypeInfo(bool canBeNull, string[] availableValues)
        {
            CanBeNull = canBeNull;
            AvailableValues = availableValues;
        }

        public bool CanBeNull { get; }
        public override PrimitiveType Type => PrimitiveType.Enum;
        public string[] AvailableValues { get; }
    }
}