namespace Kontur.DBViewer.Core.TypeInformation
{
    public class StringFieldInfo : FieldInfo
    {
        public StringFieldInfo(FieldMeta meta)
        {
            Meta = meta;
        }

        public StringFieldInfo()
        {
        }

        public override FieldType Type => FieldType.String;
    }
}