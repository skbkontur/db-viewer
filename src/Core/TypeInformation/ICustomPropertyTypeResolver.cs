using System;
using System.Reflection;

namespace Kontur.DBViewer.Core.TypeInformation
{
    public interface ICustomPropertyTypeResolver
    {
        Type TryResolvePropertyType(PropertyInfo propertyInfo);
    }
}