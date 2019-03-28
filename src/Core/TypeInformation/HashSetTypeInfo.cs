namespace Kontur.DBViewer.Core.TypeInformation
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