using System.Reflection;

namespace SkbKontur.DbViewer.TypeAndObjectBuilding
{
    public interface ICustomPropertyConfigurationProvider
    {
        CustomPropertyConfiguration TryGetConfiguration(object @object, PropertyInfo propertyInfo);
        CustomPropertyConfiguration TryGetConfiguration(PropertyInfo propertyInfo);
    }
}