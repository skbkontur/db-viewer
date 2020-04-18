using System.Collections.Generic;

namespace SkbKontur.DbViewer.TestApi.Impl.Classes
{
    public class GenericClass<T>
    {
        public string String { get; set; }
        public T Value { get; set; }
        public List<T> Values { get; set; }
        public Dictionary<string, T> MoreValues { get; set; }
    }
}