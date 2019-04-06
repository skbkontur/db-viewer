namespace Kontur.DBViewer.Core.DTO.TypeInfo
{
    public class LongTypeInfo : TypeInfo
    {
        public LongTypeInfo(bool canBeNull)
        {
            CanBeNull = canBeNull;
        }

        public bool CanBeNull { get; }
        public override PrimitiveType Type => PrimitiveType.Long;
    }
}