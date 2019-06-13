using System.Reflection;
using Kontur.DBViewer.Core.DTO.TypeInfo;
using TypeInfo = Kontur.DBViewer.Core.DTO.TypeInfo.TypeInfo;

namespace Kontur.DBViewer.Core.TypeAndObjectBulding
{
    public interface IPropertyDescriptionBuilder
    {
        PropertyDescription Build(PropertyInfo propertyInfo, TypeInfo typeInfo);
    }
}