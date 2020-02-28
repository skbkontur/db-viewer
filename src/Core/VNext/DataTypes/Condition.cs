namespace Kontur.DBViewer.Core.VNext.DataTypes
{
    public class Condition
    {
        public string Path { get; set; }
        public string Value { get; set; }
        public BusinessObjectFieldFilterOperator Operator { get; set; }
    }
}