using System.Collections.Generic;
using System.Reflection;
using Kontur.DBViewer.Core.DTO;
using Kontur.DBViewer.Core.TypeInformation;
using Kontur.DBViewer.SampleApi.Impl.Attributes;
using TypeInfo = Kontur.DBViewer.Core.TypeInformation.TypeInfo;

namespace Kontur.DBViewer.SampleApi.Impl
{
    public class SamplePropertyDescriptionBuilder : IPropertyDescriptionBuilder
    {
        private static readonly Dictionary<PrimitiveType, FilterType[]> availableFilters =
            new Dictionary<PrimitiveType, FilterType[]>
            {
                {PrimitiveType.Bool, new[] {FilterType.No, FilterType.Equals, FilterType.NotEquals}},
                {PrimitiveType.String, new[] {FilterType.No, FilterType.Equals, FilterType.NotEquals}},
                {PrimitiveType.DateTime, new[] {FilterType.No, FilterType.Equals, FilterType.NotEquals}},
                {PrimitiveType.Enum, new[] {FilterType.No, FilterType.Equals, FilterType.NotEquals}},
                {
                    PrimitiveType.Int,
                    new[]
                    {
                        FilterType.No, FilterType.Equals, FilterType.NotEquals, FilterType.Less, FilterType.LessOrEqual,
                        FilterType.Greater, FilterType.GreaterOrEqual
                    }
                }
            };

        public PropertyDescription Build(PropertyInfo propertyInfo, TypeInfo typeInfo)
        {
            var result = new PropertyDescription
            {
                Name = propertyInfo.Name,
            };
            var indexed = propertyInfo.GetCustomAttribute(typeof(IndexedAttribute)) != null;
            var required = propertyInfo.GetCustomAttribute(typeof(RequiredAttribute)) != null;
            var identity = propertyInfo.GetCustomAttribute(typeof(IdentityAttribute)) != null;
            var sortable = propertyInfo.GetCustomAttribute(typeof(SortableAttribute)) != null;
            if (indexed || required)
            {
                result.IsSearchable = true;
                result.AvailableFilters = availableFilters[typeInfo.Type];
                if (required)
                {
                    result.IsRequired = true;
                }
            }

            if (sortable)
            {
                result.IsSortable = true;
            }

            if (identity)
            {
                result.IsIdentity = true;
            }

            return result;
        }
    }
}