using System;
using System.Collections.Generic;
using System.Reflection;

using SkbKontur.DbViewer.Configuration;
using SkbKontur.DbViewer.DataTypes;
using SkbKontur.DbViewer.TestApi.Impl.Attributes;
using SkbKontur.DbViewer.TestApi.Impl.Classes;

namespace SkbKontur.DbViewer.TestApi.Impl
{
    public class SamplePropertyDescriptionBuilder : IPropertyDescriptionBuilder
    {
        public PropertyMetaInformation Build(PropertyInfo propertyInfo, Type typeInfo)
        {
            var result = new PropertyMetaInformation
                {
                    Name = propertyInfo.Name,
                    RequiredForFilter = Array.Empty<FilterRequirement>(),
                    RequiredForSort = new SortRequirements
                        {
                            RequiredFilters = Array.Empty<FilterRequirement>(),
                            RequiredSorts = Array.Empty<string>(),
                        }
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