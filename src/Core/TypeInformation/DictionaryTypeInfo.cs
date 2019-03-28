namespace Kontur.DBViewer.Core.TypeInformation
{
    public class DictionaryTypeInfo : TypeInfo
    {
        public DictionaryTypeInfo(TypeInfo key, TypeInfo value)
        {
            Key = key;
            Value = value;
        }

        public override PrimitiveType Type => PrimitiveType.Dictionary;
        public TypeInfo Key { get; }
        public TypeInfo Value { get; }
    }
}