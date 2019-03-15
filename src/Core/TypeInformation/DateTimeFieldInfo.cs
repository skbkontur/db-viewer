namespace Kontur.DBViewer.Core.TypeInformation
{
    public class DateTimeFieldInfo : FieldInfo
    {
        public DateTimeFieldInfo(bool canBeNull, FieldMeta meta)
        {
            CanBeNull = canBeNull;
            Meta = meta;
        }

        public bool CanBeNull { get; }
        public override FieldType Type => FieldType.DateTime;
    }
}