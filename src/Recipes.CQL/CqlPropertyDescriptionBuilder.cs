using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using Cassandra.Mapping.Attributes;

using Kontur.DBViewer.Core.DTO;
using Kontur.DBViewer.Core.DTO.TypeInfo;
using Kontur.DBViewer.Core.TypeAndObjectBulding;
using Kontur.DBViewer.Core.VNext.DataTypes;
using TypeInfo = Kontur.DBViewer.Core.DTO.TypeInfo.TypeInfo;

namespace Kontur.DBViewer.Recipes.CQL
{
    public class CqlPropertyDescriptionBuilder : IPropertyDescriptionBuilder
    {
        public PropertyDescription Build(PropertyInfo propertyInfo, Type typeInfo)
        {
            var result = new PropertyDescription
            {
                Name = propertyInfo.Name,
            };

            if(propertyInfo.CustomAttributes.Any(x => x.AttributeType == typeof(PartitionKeyAttribute)))
            {
                result.IsSearchable = true;
                result.IsIdentity = true;
                result.IsRequired = true;
                result.AvailableFilters = new[] {ObjectFieldFilterOperator.Equals};
            }

            if(propertyInfo.CustomAttributes.Any(x => x.AttributeType == typeof(ClusteringKeyAttribute)))
            {
                result.IsSearchable = true;
                result.IsIdentity = true;
                result.IsSortable = true;
                result.AvailableFilters = availableFilters.ContainsKey(propertyInfo.PropertyType) ? availableFilters[propertyInfo.PropertyType] : new[] {ObjectFieldFilterOperator.Equals, ObjectFieldFilterOperator.DoesNotEqual};
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