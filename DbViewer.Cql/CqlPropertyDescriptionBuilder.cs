using System;
using System.Linq;
using System.Reflection;

using Cassandra;
using Cassandra.Mapping.Attributes;

using SkbKontur.DbViewer.Configuration;
using SkbKontur.DbViewer.DataTypes;

namespace SkbKontur.DbViewer.Cql
{
    public class CqlPropertyDescriptionBuilder : IPropertyDescriptionBuilder
    {
        public PropertyMetaInformation Build(PropertyInfo propertyInfo, Type typeInfo)
        {
            var result = new PropertyMetaInformation
                {
                    Name = propertyInfo.Name,
                };

            if (propertyInfo.CustomAttributes.Any(x => x.AttributeType == typeof(PartitionKeyAttribute)))
            {
                result.IsSearchable = true;
                result.IsIdentity = true;
                result.IsRequired = true;
                result.AvailableFilters = new[] {ObjectFieldFilterOperator.Equals};
            }

            if (propertyInfo.CustomAttributes.Any(x => x.AttributeType == typeof(ClusteringKeyAttribute)))
            {
                result.IsSearchable = true;
                result.IsIdentity = true;
                result.IsSortable = true;
                result.AvailableFilters = specialTypes.Contains(propertyInfo.PropertyType)
                                              ? new[] {ObjectFieldFilterOperator.Equals}
                                              : defaultFilters;
            }

            return result;
        }

        private static readonly Type[] specialTypes = {typeof(TimeUuid), typeof(bool)};

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