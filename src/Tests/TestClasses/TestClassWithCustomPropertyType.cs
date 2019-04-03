using Kontur.DBViewer.Tests.ExtractorsTests;

namespace Kontur.DBViewer.Tests.TestClasses
{
    public class TestClassWithCustomPropertyType
    {
        [Serialized(typeof(TestClass2))]
        public byte[] Property { get; set; }
    }
}