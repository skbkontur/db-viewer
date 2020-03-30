using System;

namespace SkbKontur.DbViewer.TypeAndObjectBuilding
{
    public class CustomPropertyConfiguration
    {
        public Type ResolvedType { get; set; }
        public Func<object, object> StoredToApi { get; set; }
        public Func<object, object> ApiToStored { get; set; }
    }
}