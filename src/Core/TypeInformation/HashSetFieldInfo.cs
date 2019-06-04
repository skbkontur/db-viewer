namespace Kontur.DBViewer.Core.TypeInformation
{
    public class HashSetFieldInfo : FieldInfo
    {
        public HashSetFieldInfo(FieldInfo underlyingType)
        {
            UnderlyingType = underlyingType;
        }

        public HashSetFieldInfo()
        {
        }

        public override FieldType Type => FieldType.HashSet;
        public FieldInfo UnderlyingType { get; set; }
    }
}