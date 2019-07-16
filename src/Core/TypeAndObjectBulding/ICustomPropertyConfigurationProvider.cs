using System.Reflection;

namespace Kontur.DBViewer.Core.TypeAndObjectBulding
{
    public interface ICustomPropertyConfigurationProvider
    {
        CustomPropertyConfiguration TryGetConfiguration(object @object, PropertyInfo propertyInfo);
        CustomPropertyConfiguration TryGetConfiguration(PropertyInfo propertyInfo);
    }
}