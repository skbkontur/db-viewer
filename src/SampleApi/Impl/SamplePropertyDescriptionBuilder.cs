using System;
using System.Collections.Generic;
using System.Reflection;
using Kontur.DBViewer.Core.DTO.TypeInfo;
using Kontur.DBViewer.Core.TypeAndObjectBulding;
using Kontur.DBViewer.Core.VNext.DataTypes;
using Kontur.DBViewer.SampleApi.Impl.Attributes;
using Kontur.DBViewer.SampleApi.Impl.Classes;

namespace Kontur.DBViewer.SampleApi.Impl
{
    public class SamplePropertyDescriptionBuilder : IPropertyDescriptionBuilder
    {
        private static readonly Dictionary<Type, ObjectFieldFilterOperator[]> availableFilters =
            new Dictionary<Type, ObjectFieldFilterOperator[]>
            {
                {
                    typeof(bool),
                    new[] {ObjectFieldFilterOperator.Equals, ObjectFieldFilterOperator.DoesNotEqual}
                },
                {
                    typeof(string),
                    new[] {ObjectFieldFilterOperator.Equals, ObjectFieldFilterOperator.DoesNotEqual}
                },
                {
                    typeof(DateTime),
                    new[] {ObjectFieldFilterOperator.Equals, ObjectFieldFilterOperator.DoesNotEqual}
                },
                {
                    typeof(TestEnum),
                    new[] {ObjectFieldFilterOperator.Equals, ObjectFieldFilterOperator.DoesNotEqual}
                },
                {
                    typeof(int),
                    new[]
                    {
                        ObjectFieldFilterOperator.Equals,
                        ObjectFieldFilterOperator.DoesNotEqual,
                        ObjectFieldFilterOperator.LessThan,
                        ObjectFieldFilterOperator.LessThanOrEquals,
                        ObjectFieldFilterOperator.GreaterThan,
                        ObjectFieldFilterOperator.GreaterThanOrEquals
                    }
                }
            };

        public PropertyDescription Build(PropertyInfo propertyInfo, Type typeInfo)
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
                result.AvailableFilters = availableFilters[typeInfo];
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