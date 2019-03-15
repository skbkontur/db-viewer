namespace Kontur.DBViewer.Core.TypeInformation
{
    public class EnumerableFieldInfo : FieldInfo
    {
        public EnumerableFieldInfo(FieldInfo underlyingType)
        {
            UnderlyingType = underlyingType;
        }

        public override FieldType Type => FieldType.Enumerable;
        public FieldInfo UnderlyingType { get; }
    }
}