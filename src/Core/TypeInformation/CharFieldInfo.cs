namespace Kontur.DBViewer.Core.TypeInformation
{
    public class CharFieldInfo : FieldInfo
    {
        public CharFieldInfo(bool canBeNull, FieldMeta meta)
        {
            CanBeNull = canBeNull;
            Meta = meta;
        }

        public CharFieldInfo()
        {
        }

        public bool CanBeNull { get; set; }
        public override FieldType Type => FieldType.Char;
    }
}