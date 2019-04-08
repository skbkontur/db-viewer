using Kontur.DBViewer.SampleApi.Impl.Attributes;

namespace Kontur.DBViewer.SampleApi.Impl.Classes
{
    public class TestClass
    {
        [Identity, Indexed]
        public string Id { get; set; }
        
        public TestClassWithAllPrimitives Content { get; set; }
        
        [Serialized(typeof(ClassForSerialization))]
        public byte[] Serialized { get; set; }
    }
}