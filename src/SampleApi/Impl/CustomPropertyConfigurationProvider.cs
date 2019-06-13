using System.Reflection;
using Cassandra;
using GroBuf;
using Kontur.DBViewer.Core.TypeAndObjectBulding;
using Kontur.DBViewer.Recipes.CQL;
using Kontur.DBViewer.SampleApi.Impl.Attributes;

namespace Kontur.DBViewer.SampleApi.Impl
{
    public class SampleCustomPropertyConfigurationProvider : ICustomPropertyConfigurationProvider
    {
        private readonly ISerializer serializer;

        public SampleCustomPropertyConfigurationProvider(ISerializer serializer)
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

            if (propertyInfo.PropertyType == typeof(LocalTime))
                return CqlCustomPropertyConfiguration.LocalTime;

            return null;
        }
    }
}