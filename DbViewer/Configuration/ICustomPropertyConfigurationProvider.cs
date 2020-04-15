using System.Reflection;

namespace SkbKontur.DbViewer.Configuration
{
    public interface ICustomPropertyConfigurationProvider
    {
        CustomPropertyConfiguration TryGetConfiguration(object @object, PropertyInfo propertyInfo);
        CustomPropertyConfiguration TryGetConfiguration(PropertyInfo propertyInfo);
    }
}