namespace Kontur.DBViewer.Core.DTO.TypeInfo
{
    public class IntTypeInfo : TypeInfo
    {
        public IntTypeInfo(bool canBeNull)
        {
            CanBeNull = canBeNull;
        }

        public bool CanBeNull { get; }
        public override PrimitiveType Type => PrimitiveType.Int;
    }
}