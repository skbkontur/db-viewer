using System;
using System.Reflection;

namespace Kontur.DBViewer.Core.TypeInformation
{
    public interface ICustomPropertyConfigurationProvider
    {
        CustomPropertyConfiguration TryGetConfiguration(PropertyInfo propertyInfo);
    }

    public class CustomPropertyConfiguration
    {
        public Type ResolvedType { get; set; }
        public Func<object, object> ExtractValue { get; set; }
        public Func<object, object> BuildValue { get; set; }
    }
}