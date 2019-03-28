namespace Kontur.DBViewer.Core.TypeInformation
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