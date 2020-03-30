using System;
using System.Collections.Generic;
using System.Reflection;

using SkbKontur.DbViewer.Dto.TypeInfo;
using SkbKontur.DbViewer.TestApi.Impl.Attributes;
using SkbKontur.DbViewer.TestApi.Impl.Classes;
using SkbKontur.DbViewer.TypeAndObjectBuilding;
using SkbKontur.DbViewer.VNext.DataTypes;

namespace SkbKontur.DbViewer.TestApi.Impl
{
    public class SamplePropertyDescriptionBuilder : IPropertyDescriptionBuilder
    {
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
    }
}