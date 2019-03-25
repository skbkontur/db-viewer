using System;
using System.Collections.Concurrent;
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
                        result.AvailableFilters = new[]{FilterType.Equals};
                    }

                    if(property.CustomAttributes.Any(x => x.AttributeType == typeof(ClusteringKeyAttribute)))
                    {
                        result.IsSearchable = true;
                        result.AvailableFilters = new[]{FilterType.Equals};
                    }

                    return result;
                });
        }

        private static readonly ConcurrentDictionary<Type, FieldInfo> configurations = new ConcurrentDictionary<Type, FieldInfo>();
    }
}