namespace Kontur.DBViewer.Core.TypeInformation
{
    public class ClassTypeInfo : TypeInfo
    {
        public override PrimitiveType Type => PrimitiveType.Class;
        public Property[] Properties { get; set; }
    }
}