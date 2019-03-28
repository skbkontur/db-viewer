namespace Kontur.DBViewer.Core.TypeInformation
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