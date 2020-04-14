using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;

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
                result.AvailableFilters = availableFilters.ContainsKey(propertyInfo.PropertyType)
                                              ? availableFilters[propertyInfo.PropertyType]
                                              : new[] {ObjectFieldFilterOperator.Equals, ObjectFieldFilterOperator.DoesNotEqual};
            }

            return result;
        }

        private static readonly Dictionary<Type, ObjectFieldFilterOperator[]> availableFilters = new Dictionary<Type, ObjectFieldFilterOperator[]>
            {
                {
                    typeof(string), new[]
                        {
                            ObjectFieldFilterOperator.LessThan,
                            ObjectFieldFilterOperator.Equals,
                            ObjectFieldFilterOperator.GreaterThan,
                            ObjectFieldFilterOperator.DoesNotEqual,
                            ObjectFieldFilterOperator.LessThanOrEquals,
                            ObjectFieldFilterOperator.GreaterThanOrEquals,
                        }
                }
            };
    }
}