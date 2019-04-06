namespace Kontur.DBViewer.Core.DTO.TypeInfo
{
    public class EnumerableTypeInfo : TypeInfo
    {
        public EnumerableTypeInfo(TypeInfo underlyingType)
        {
            UnderlyingType = underlyingType;
        }

        public override PrimitiveType Type => PrimitiveType.Enumerable;
        public TypeInfo UnderlyingType { get; }
    }
}