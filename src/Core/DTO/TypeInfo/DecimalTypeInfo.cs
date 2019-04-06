namespace Kontur.DBViewer.Core.DTO.TypeInfo
{
    public class DecimalTypeInfo : TypeInfo
    {
        public DecimalTypeInfo(bool canBeNull)
        {
            CanBeNull = canBeNull;
        }

        public bool CanBeNull { get; }
        public override PrimitiveType Type => PrimitiveType.Decimal;
    }
}