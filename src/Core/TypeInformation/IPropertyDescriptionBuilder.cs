using System.Reflection;
using Kontur.DBViewer.Core.DTO.TypeInfo;
using TypeInfo = Kontur.DBViewer.Core.DTO.TypeInfo.TypeInfo;

namespace Kontur.DBViewer.Core.TypeInformation
{
    public interface IPropertyDescriptionBuilder
    {
        PropertyDescription Build(PropertyInfo propertyInfo, TypeInfo typeInfo);
    }
}