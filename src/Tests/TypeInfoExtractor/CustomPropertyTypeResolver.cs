using System;
using System.Linq;
using System.Reflection;
using GroBuf;
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

    public class CustomPropertyValueExtractor : ICustomPropertyValueExtractor
    {
        private readonly ISerializer serializer;

        public CustomPropertyValueExtractor(ISerializer serializer)
        {
            this.serializer = serializer;
        }
        
        public bool TryGetPropertyValue(object propertyValue, PropertyInfo propertyInfo, out object result)
        {
            result = null;
            var serializedAttribute = propertyInfo.GetCustomAttributes<SerializedAttribute>().SingleOrDefault();
            if (serializedAttribute != null)
            {
                result = serializer.Deserialize(serializedAttribute.Type, (byte[]) propertyValue);
                return true;
            }

            return false;
        }
    }
}