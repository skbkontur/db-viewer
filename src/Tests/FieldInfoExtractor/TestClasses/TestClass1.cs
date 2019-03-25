namespace Kontur.DBViewer.Tests.FieldInfoExtractor.TestClasses
{
    public class TestClass1
    {
        public TestEnum NotNullable { get; set; }
        public TestEnum? Nullable { get; set; }
        public TestClass2 Nested { get; set; }
    }
}