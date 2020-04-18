using System;
using System.Reflection;

using GroBuf;
using GroBuf.DataMembersExtracters;

using SkbKontur.DbViewer.Configuration;
using SkbKontur.DbViewer.Cql.CustomPropertyConfigurations;
using SkbKontur.DbViewer.TestApi.Impl.Attributes;

namespace SkbKontur.DbViewer.TestApi.Impl
{
    public class SampleCustomPropertyConfigurationProvider : ICustomPropertyConfigurationProvider
    {
        public CustomPropertyConfiguration? TryGetConfiguration(object @object, PropertyInfo propertyInfo)
        {
            return LocalTimeCustomPropertyConfiguration.TryGetConfiguration(propertyInfo)
                   ?? TimeUuidCustomPropertyConfiguration.TryGetConfiguration(propertyInfo)
                   ?? CustomTypeConfiguration.TryGetConfiguration(@object, propertyInfo);
        }

        public CustomPropertyConfiguration? TryGetConfiguration(PropertyInfo propertyInfo)
        {
            return LocalTimeCustomPropertyConfiguration.TryGetConfiguration(propertyInfo)
                   ?? TimeUuidCustomPropertyConfiguration.TryGetConfiguration(propertyInfo)
                   ?? CustomTypeConfiguration.TryGetConfiguration(propertyInfo);
        }
    }

    public static class CustomTypeConfiguration
    {
        public static CustomPropertyConfiguration? TryGetConfiguration(object @object, PropertyInfo propertyInfo)
        {
            var serializedAttribute = propertyInfo.GetCustomAttribute<SerializedAttribute>();
            if (serializedAttribute == null)
                return null;

            if (!typeof(ITypeResolver).IsAssignableFrom(serializedAttribute.Type))
                return GetConfiguration(serializedAttribute.Type);

            var resolver = (ITypeResolver)Activator.CreateInstance(serializedAttribute.Type);
            return GetConfiguration(resolver.ResolveType(@object, propertyInfo));
        }

        public static CustomPropertyConfiguration? TryGetConfiguration(PropertyInfo propertyInfo)
        {
            var serializedAttribute = propertyInfo.GetCustomAttribute<SerializedAttribute>();
            if (serializedAttribute == null)
                return null;

            if (!typeof(ITypeResolver).IsAssignableFrom(serializedAttribute.Type))
                return GetConfiguration(serializedAttribute.Type);

            return GetDummyConfiguration();
        }

        private static CustomPropertyConfiguration GetConfiguration(Type type)
        {
            return new CustomPropertyConfiguration
                {
                    ResolvedType = type,
                    StoredToApi = @object => serializer.Deserialize(type, (byte[]?)@object),
                    ApiToStored = @object => serializer.Serialize(type, @object),
                };
        }

        private static CustomPropertyConfiguration GetDummyConfiguration()
        {
            return new CustomPropertyConfiguration
                {
                    ResolvedType = typeof(object),
                    StoredToApi = @object => throw new NotSupportedException(),
                    ApiToStored = @object => throw new NotSupportedException(),
                };
        }

        private static readonly ISerializer serializer = new Serializer(new AllPropertiesExtractor());
    }
}