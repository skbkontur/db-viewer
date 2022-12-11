using System;
using System.Linq;
using System.Reflection;

using Cassandra;
using Cassandra.Mapping;
using Cassandra.Mapping.Attributes;

using SkbKontur.DbViewer.Configuration;
using SkbKontur.DbViewer.DataTypes;

namespace SkbKontur.DbViewer.Cql
{
    public class CqlPropertyDescriptionBuilder : IPropertyDescriptionBuilder
    {
        private string PrettyPrintPropertyCqlAttributes(PropertyInfo propertyInfo)
        {
            var columnMeta = $"Тип: {propertyInfo.PropertyType.Name}\n";

            var columnAttribute = propertyInfo.GetCustomAttribute<ColumnAttribute>();
            if (columnAttribute != null)
            {
                var type = columnAttribute.Type == null ? string.Empty : $", Type = typeof({columnAttribute.Type.Name})";
                columnMeta += $"[Column(\"{columnAttribute.Name}\"{type})]\n";
            }

            var partitionKeyAttribute = propertyInfo.GetCustomAttribute<PartitionKeyAttribute>();
            if (partitionKeyAttribute != null)
            {
                columnMeta += $"[PartitionKey({partitionKeyAttribute.Index})]";
            }

            var clusteringKeyAttribute = propertyInfo.GetCustomAttribute<ClusteringKeyAttribute>();
            if (clusteringKeyAttribute != null)
            {
                var sort = clusteringKeyAttribute.ClusteringSortOrder == SortOrder.Unspecified ? null : $", SortOrder.{clusteringKeyAttribute.ClusteringSortOrder}";
                var name = string.IsNullOrEmpty(clusteringKeyAttribute.Name) ? null : $", Name = \"{clusteringKeyAttribute.Name}\"";
                columnMeta += $"[ClusteringKey({clusteringKeyAttribute.Index}{sort}{name})]";
            }

            return columnMeta;
        }

        public PropertyMetaInformation Build(PropertyInfo propertyInfo, Type typeInfo)
        {
            var result = new PropertyMetaInformation
                {
                    Name = propertyInfo.Name,
                    Meta = PrettyPrintPropertyCqlAttributes(propertyInfo),
                    RequiredForFilter = Array.Empty<FilterRequirement>(),
                    RequiredForSort = new SortRequirements
                        {
                            RequiredFilters = Array.Empty<FilterRequirement>(),
                            RequiredSorts = Array.Empty<string>(),
                        },
                };

            var partitionKeys = propertyInfo.ReflectedType
                                            .GetProperties(BindingFlags.Public | BindingFlags.Instance)
                                            .Select(x => (Property : x, Attribute : x.GetCustomAttribute<PartitionKeyAttribute>()))
                                            .Where(x => x.Attribute != null)
                                            .OrderBy(x => x.Attribute.Index)
                                            .ToArray();
            var partitionKeyAttribute = propertyInfo.GetCustomAttribute<PartitionKeyAttribute>();
            if (partitionKeyAttribute != null)
            {
                result.IsSearchable = true;
                result.IsIdentity = true;
                result.IsRequired = true;
                result.AvailableFilters = equals;
            }

            var clusteringKeys = propertyInfo.ReflectedType
                                             .GetProperties(BindingFlags.Public | BindingFlags.Instance)
                                             .Select(x => (Property : x, Attribute : x.GetCustomAttribute<ClusteringKeyAttribute>()))
                                             .Where(x => x.Attribute != null)
                                             .OrderBy(x => x.Attribute.Index)
                                             .ToArray();
            var clusteringKeyAttribute = propertyInfo.GetCustomAttribute<ClusteringKeyAttribute>();
            if (clusteringKeyAttribute != null)
            {
                result.IsSearchable = true;
                result.IsIdentity = true;
                result.IsSortable = true;
                result.AvailableFilters = specialTypes.Contains(propertyInfo.PropertyType) ? equals : defaultFilters;

                result.RequiredForFilter =
                    partitionKeys
                        .Select(x => new FilterRequirement {AvailableFilters = equals, PropertyName = x.Property.Name})
                        .Concat(
                            clusteringKeys
                                .Where(x => x.Attribute.Index < clusteringKeyAttribute.Index)
                                .Select(x => new FilterRequirement {AvailableFilters = equals, PropertyName = x.Property.Name})
                        )
                        .ToArray();

                result.RequiredForSort = new SortRequirements
                    {
                        RequiredFilters =
                            partitionKeys
                                .Select(x => new FilterRequirement {AvailableFilters = equals, PropertyName = x.Property.Name})
                                .ToArray(),
                        OneDirectionSort = true,
                        RequiredSorts =
                            clusteringKeys
                                .Where(x => x.Attribute.Index < clusteringKeyAttribute.Index)
                                .Select(x => x.Property.Name)
                                .ToArray(),
                    };
            }

            return result;
        }

        private static readonly Type[] specialTypes = {typeof(TimeUuid), typeof(bool)};
        private static readonly ObjectFieldFilterOperator[] equals = {ObjectFieldFilterOperator.Equals};

        private static readonly ObjectFieldFilterOperator[] defaultFilters =
            {
                ObjectFieldFilterOperator.LessThan,
                ObjectFieldFilterOperator.Equals,
                ObjectFieldFilterOperator.GreaterThan,
                ObjectFieldFilterOperator.LessThanOrEquals,
                ObjectFieldFilterOperator.GreaterThanOrEquals,
            };
    }
}