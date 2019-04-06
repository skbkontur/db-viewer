using System.Reflection;
using GroBuf;
using Kontur.DBViewer.Core.TypeAndObjectBulding;
using Kontur.DBViewer.SampleApi.Impl.Attributes;

namespace Kontur.DBViewer.Tests.ExtractorsTests
{
    public class CustomPropertyConfigurationProvider : ICustomPropertyConfigurationProvider
    {
        private readonly ISerializer serializer;

        public CustomPropertyConfigurationProvider(ISerializer serializer)
        {
            this.serializer = serializer;
        }

        public CustomPropertyConfiguration TryGetConfiguration(PropertyInfo propertyInfo)
        {
            var serializedAttribute = propertyInfo.GetCustomAttribute<SerializedAttribute>();
            if (serializedAttribute != null)
            {
                return new CustomPropertyConfiguration
                {
                    ResolvedType = serializedAttribute.Type,
                    StoredToApi = @object => serializer.Deserialize(serializedAttribute.Type, (byte[]) @object),
                    ApiToStored = @object => serializer.Serialize(serializedAttribute.Type, @object),
                };
            }

            return null;
        }
    }
}