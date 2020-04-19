namespace SkbKontur.DbViewer.TestApi.Impl.Classes
{
    public abstract class BaseClass
    {
    }

    public class ChildClass : BaseClass
    {
        public int Int { get; set; }
    }

    public class ChildClass2 : BaseClass
    {
        public string String { get; set; }
        public string[] Strings { get; set; }
    }
}