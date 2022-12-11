using System;
using System.Linq;
using System.Reflection;

using SkbKontur.DbViewer.Configuration;
using SkbKontur.DbViewer.DataTypes;

namespace SkbKontur.DbViewer.EntityFramework
{
    public class EntityFrameworkPropertyDescriptionBuilder<TPrimaryKey, TIndex> : IPropertyDescriptionBuilder
        where TPrimaryKey : Attribute
        where TIndex : Attribute
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
                        },
                };

            if (propertyInfo.CustomAttributes.Any(x => x.AttributeType == typeof(TPrimaryKey)))
            {
                result.IsSearchable = true;
                result.IsIdentity = true;
                result.IsSortable = true;
                result.AvailableFilters = specialTypes.Contains(propertyInfo.PropertyType)
                                              ? new[] {ObjectFieldFilterOperator.Equals, ObjectFieldFilterOperator.DoesNotEqual}
                                              : defaultFilters;
            }

            if (propertyInfo.CustomAttributes.Any(x => x.AttributeType == typeof(TIndex)))
            {
                result.IsSearchable = true;
                result.IsSortable = true;
                result.AvailableFilters = specialTypes.Contains(propertyInfo.PropertyType)
                                              ? new[] {ObjectFieldFilterOperator.Equals, ObjectFieldFilterOperator.DoesNotEqual}
                                              : defaultFilters;
            }

            return result;
        }

        private readonly Type[] specialTypes = {typeof(bool)};

        private readonly ObjectFieldFilterOperator[] defaultFilters =
            {
                ObjectFieldFilterOperator.LessThan,
                ObjectFieldFilterOperator.Equals,
                ObjectFieldFilterOperator.GreaterThan,
                ObjectFieldFilterOperator.DoesNotEqual,
                ObjectFieldFilterOperator.LessThanOrEquals,
                ObjectFieldFilterOperator.GreaterThanOrEquals,
            };
    }
}