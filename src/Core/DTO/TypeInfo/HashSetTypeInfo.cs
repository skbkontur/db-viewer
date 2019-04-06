namespace Kontur.DBViewer.Core.DTO.TypeInfo
{
    public class HashSetTypeInfo : TypeInfo
    {
        public HashSetTypeInfo(TypeInfo underlyingType)
        {
            UnderlyingType = underlyingType;
        }
        
        public override PrimitiveType Type => PrimitiveType.HashSet;
        public TypeInfo UnderlyingType { get; }
    }
}