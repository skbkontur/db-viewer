namespace Kontur.DBViewer.Core.TypeInformation
{
    public class CharTypeInfo : TypeInfo
    {
        public CharTypeInfo(bool canBeNull)
        {
            CanBeNull = canBeNull;
        }

        public bool CanBeNull { get; }
        public override PrimitiveType Type => PrimitiveType.Char;
    }
}