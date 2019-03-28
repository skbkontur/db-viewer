using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using Cassandra.Mapping.Attributes;

using Kontur.DBViewer.Core.DTO;
using Kontur.DBViewer.Core.TypeInformation;
using TypeInfo = Kontur.DBViewer.Core.TypeInformation.TypeInfo;

namespace Kontur.DBViewer.Recipes.CQL
{
    public class CqlPropertyDescriptionBuilder : IPropertyDescriptionBuilder
    {
        public PropertyDescription Build(PropertyInfo propertyInfo, TypeInfo typeInfo)
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
                result.AvailableFilters = new[] {FilterType.Equals};
            }

            if(propertyInfo.CustomAttributes.Any(x => x.AttributeType == typeof(ClusteringKeyAttribute)))
            {
                result.IsSearchable = true;
                result.AvailableFilters = availableFilters.ContainsKey(propertyInfo.PropertyType) ? availableFilters[propertyInfo.PropertyType] : new[] {FilterType.Equals, FilterType.No};
            }

            return result;
        }

        private static readonly Dictionary<Type, FilterType[]> availableFilters = new Dictionary<Type, FilterType[]>
        {
            {
                typeof(string), new[]
                {
                    FilterType.No,
                    FilterType.Less,
                    FilterType.Equals,
                    FilterType.Greater,
                    FilterType.NotEquals,
                    FilterType.LessOrEqual,
                    FilterType.GreaterOrEqual,
                }
            }
        };
    }
}