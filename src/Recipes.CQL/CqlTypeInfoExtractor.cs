using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;

using Cassandra.Mapping.Attributes;

using Kontur.DBViewer.Core.Connector;
using Kontur.DBViewer.Core.DTO;
using Kontur.DBViewer.Core.TypeInformation;

namespace Kontur.DBViewer.Recipes.CQL
{
    public class CqlTypeInfoExtractor : ITypeInfoExtractor
    {
        public FieldInfo GetShape(Type type)
        {
            return configurations.GetOrAdd(type, InnerGetTypeInfo);
        }

        private FieldInfo InnerGetTypeInfo(Type type)
        {
            return FieldInfoExtractor.Extract(type, (property, currentType) =>
                {
                    var result = new FieldMeta(property.Name);

                    if(property.CustomAttributes.Any(x => x.AttributeType == typeof(PartitionKeyAttribute)))
                    {
                        result.IsSearchable = true;
                        result.IsIdentity = true;
                        result.IsRequired = true;
                        result.AvailableFilters = new[] {FilterType.Equals};
                    }

                    if(property.CustomAttributes.Any(x => x.AttributeType == typeof(ClusteringKeyAttribute)))
                    {
                        result.IsSearchable = true;
                        result.AvailableFilters = availableFilters.ContainsKey(property.PropertyType) ? availableFilters[property.PropertyType] : new[] {FilterType.Equals, FilterType.No};
                    }

                    return result;
                });
        }

        private static readonly ConcurrentDictionary<Type, FieldInfo> configurations = new ConcurrentDictionary<Type, FieldInfo>();

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