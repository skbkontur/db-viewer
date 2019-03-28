namespace Kontur.DBViewer.Core.TypeInformation
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