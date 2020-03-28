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
                result.AvailableFilters = new[] {BusinessObjectFieldFilterOperator.Equals};
            }

            if(propertyInfo.CustomAttributes.Any(x => x.AttributeType == typeof(ClusteringKeyAttribute)))
            {
                result.IsSearchable = true;
                result.IsIdentity = true;
                result.IsSortable = true;
                result.AvailableFilters = availableFilters.ContainsKey(propertyInfo.PropertyType) ? availableFilters[propertyInfo.PropertyType] : new[] {BusinessObjectFieldFilterOperator.Equals, BusinessObjectFieldFilterOperator.DoesNotEqual};
            }

            return result;
        }

        private static readonly Dictionary<Type, BusinessObjectFieldFilterOperator[]> availableFilters = new Dictionary<Type, BusinessObjectFieldFilterOperator[]>
        {
            {
                typeof(string), new[]
                {
                    BusinessObjectFieldFilterOperator.LessThan,
                    BusinessObjectFieldFilterOperator.Equals,
                    BusinessObjectFieldFilterOperator.GreaterThan,
                    BusinessObjectFieldFilterOperator.DoesNotEqual,
                    BusinessObjectFieldFilterOperator.LessThanOrEquals,
                    BusinessObjectFieldFilterOperator.GreaterThanOrEquals,
                }
            }
        };
    }
}