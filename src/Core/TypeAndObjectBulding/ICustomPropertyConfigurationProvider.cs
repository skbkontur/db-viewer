using System.Reflection;

namespace Kontur.DBViewer.Core.TypeAndObjectBulding
{
    public interface ICustomPropertyConfigurationProvider
    {
        CustomPropertyConfiguration TryGetConfiguration(PropertyInfo propertyInfo);
    }
}