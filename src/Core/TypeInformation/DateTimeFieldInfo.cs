namespace Kontur.DBViewer.Core.TypeInformation
{
    public class DateTimeFieldInfo : FieldInfo
    {
        public DateTimeFieldInfo(bool canBeNull, FieldMeta meta)
        {
            CanBeNull = canBeNull;
            Meta = meta;
        }

        public DateTimeFieldInfo()
        {
        }

        public bool CanBeNull { get; set; }
        public override FieldType Type => FieldType.DateTime;
    }
}