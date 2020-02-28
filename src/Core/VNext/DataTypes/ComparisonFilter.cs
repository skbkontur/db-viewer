namespace Kontur.DBViewer.Core.VNext.DataTypes
{
    public class ComparisonFilter
    {
        public ComparisonFilter(string path, string value, BusinessObjectFieldFilterOperator @operator)
        {
            Path = path;
            Value = value;
            Operator = @operator;
        }

        public string Path { get; }
        public string Value { get; }
        public BusinessObjectFieldFilterOperator Operator { get; }
    }
}