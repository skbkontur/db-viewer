namespace Kontur.DBViewer.SampleApi.Impl.Classes
{
    public class TestObjectWithRequiredField
    {
        [Identity, Indexed]
        public string Id { get; set; }

        [Required]
        public TestEnum Enum { get; set; }
    }
}