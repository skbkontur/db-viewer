using System;
using System.Collections.Generic;
using System.Reflection;

using Kontur.DBViewer.Core.Searcher;
using Kontur.DBViewer.Core.TypeInformation;
using Kontur.DBViewer.SampleApi.Impl.Classes;

using FieldInfo = Kontur.DBViewer.Core.TypeInformation.FieldInfo;

namespace Kontur.DBViewer.SampleApi.Impl
{
    public class SampleTypeInfoExtractor : ITypeInfoExtractor
    {
        public FieldInfo GetShape(Type type)
        {
            return FieldInfoExtractor.Extract(type, (property, currentType) =>
                {
                    var result = new FieldMeta(property.Name);
                    if(currentType == type)
                    {
                        var indexed = property.GetCustomAttribute(typeof(IndexedAttribute)) != null;
                        var required = property.GetCustomAttribute(typeof(RequiredAttribute)) != null;
                        var identity = property.GetCustomAttribute(typeof(IdentityAttribute)) != null;
                        if(indexed || required)
                        {
                            result.IsSearchable = true;
                            result.AvailableFilters = availableFilters[TypeToFieldTypeResolver.Resolve(property.PropertyType)];
                            if(required)
                                result.IsRequired = true;
                        }

                        if(identity)
                        {
                            result.IsIdentity = true;
                        }
                    }

                    return result;
                });
        }

        private static readonly Dictionary<FieldType, FilterType[]> availableFilters = new Dictionary<FieldType, FilterType[]>
            {
                {FieldType.Bool, new[] {FilterType.No, FilterType.Equals, FilterType.NotEquals}},
                {FieldType.String, new[] {FilterType.No, FilterType.Equals, FilterType.NotEquals}},
                {FieldType.DateTime, new[] {FilterType.No, FilterType.Equals, FilterType.NotEquals}},
                {FieldType.Enum, new[] {FilterType.No, FilterType.Equals, FilterType.NotEquals}},
                {FieldType.Int, new[] {FilterType.No, FilterType.Equals, FilterType.NotEquals, FilterType.Less, FilterType.LessOrEqual, FilterType.Greater, FilterType.GreaterOrEqual}}
            };
    }
}