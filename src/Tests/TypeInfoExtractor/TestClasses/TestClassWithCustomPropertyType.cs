namespace Kontur.DBViewer.Tests.TypeInfoExtractor.TestClasses
{
    public class TestClassWithCustomPropertyType
    {
        [Serialized(typeof(TestClass2))]
        public byte[] Property { get; set; }
    }
}