using System;
using System.Linq;
using System.Reflection;

using Microsoft.EntityFrameworkCore.Metadata.Builders;

using SkbKontur.DbViewer.TestApi.Impl.Attributes;

namespace SkbKontur.DbViewer.TestApi.EntityFramework
{
    public static class EntityTypeBuilderExtensions
    {
        public static EntityTypeBuilder ApplyPrimaryKey(this EntityTypeBuilder entityTypeBuilder)
        {
            var keyProperties = ExtractPropertiesWithAttribute<IdentityAttribute>(entityTypeBuilder);
            entityTypeBuilder.HasKey(keyProperties.Select(x => x.Name).ToArray());
            return entityTypeBuilder;
        }

        public static EntityTypeBuilder ApplyIndices(this EntityTypeBuilder entityTypeBuilder)
        {
            var indexedProperties = ExtractPropertiesWithAttribute<IndexedAttribute>(entityTypeBuilder);
            indexedProperties = indexedProperties.Where(x => !x.GetCustomAttributes<IdentityAttribute>().Any()).ToArray();
            entityTypeBuilder.HasIndex(indexedProperties.Select(x => x.Name).ToArray());
            return entityTypeBuilder;
        }

        private static PropertyInfo[] ExtractPropertiesWithAttribute<TAttribute>(EntityTypeBuilder entityTypeBuilder)
            where TAttribute : Attribute
        {
            return entityTypeBuilder.Metadata.ClrType
                                    .GetProperties(BindingFlags.Public | BindingFlags.Instance)
                                    .Where(x => x.CanRead && x.CanWrite && x.GetCustomAttributes<TAttribute>().Any())
                                    .ToArray();
        }
    }
}