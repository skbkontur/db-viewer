namespace Kontur.DBViewer.SampleApi.Impl.Classes
{
    public class TestObjectWithEnums
    {
        [Indexed, Identity]
        public string Id { get; set; }

        [Indexed]
        public TestEnum Indexed { get; set; }

        [Indexed]
        public TestEnum? IndexedNullable { get; set; }

        public TestEnum NotIndexed { get; set; }
    }
}