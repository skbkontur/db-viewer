namespace Kontur.DBViewer.Core.TypeInformation
{
    public class DictionaryFieldInfo : FieldInfo
    {
        public DictionaryFieldInfo(FieldInfo key, FieldInfo value)
        {
            Key = key;
            Value = value;
        }

        public DictionaryFieldInfo()
        {
        }

        public override FieldType Type => FieldType.Dictionary;
        public FieldInfo Key { get; set; }
        public FieldInfo Value { get; set; }
    }
}