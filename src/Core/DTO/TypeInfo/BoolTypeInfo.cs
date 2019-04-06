namespace Kontur.DBViewer.Core.DTO.TypeInfo
{
    public class BoolTypeInfo : TypeInfo
    {
        public BoolTypeInfo(bool canBeNull)
        {
            CanBeNull = canBeNull;
        }

        public bool CanBeNull { get; }
        public override PrimitiveType Type => PrimitiveType.Bool;
    }
}