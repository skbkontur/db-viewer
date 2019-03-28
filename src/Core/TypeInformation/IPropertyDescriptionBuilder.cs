using System.Reflection;

namespace Kontur.DBViewer.Core.TypeInformation
{
    public interface IPropertyDescriptionBuilder
    {
        PropertyDescription Build(PropertyInfo propertyInfo, TypeInfo typeInfo);
    }
}