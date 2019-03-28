using System;
using System.Linq;
using System.Reflection;
using Kontur.DBViewer.Core.TypeInformation;

namespace Kontur.DBViewer.Tests.TypeInfoExtractor
{
    public class CustomPropertyTypeResolver : ICustomPropertyTypeResolver
    {
        public Type TryResolvePropertyType(PropertyInfo propertyInfo)
        {
            var serializedAttribute = propertyInfo.GetCustomAttributes<SerializedAttribute>().SingleOrDefault();
            return serializedAttribute?.Type;
        }
    }
}