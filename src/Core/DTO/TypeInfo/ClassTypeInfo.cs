namespace Kontur.DBViewer.Core.DTO.TypeInfo
{
    public class ClassTypeInfo : TypeInfo
    {
        public override PrimitiveType Type => PrimitiveType.Class;
        public Property[] Properties { get; set; }
    }
}