namespace Kontur.DBViewer.Core.TypeInformation
{
    public class DateTimeTypeInfo : TypeInfo
    {
        public DateTimeTypeInfo(bool canBeNull)
        {
            CanBeNull = canBeNull;
        }

        public bool CanBeNull { get; }
        public override PrimitiveType Type => PrimitiveType.DateTime;
    }
}