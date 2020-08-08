using System;
using System.Collections.Generic;
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
                };

            if (propertyInfo.CustomAttributes.Any(x => x.AttributeType == typeof(TPrimaryKey)))
            {
                result.IsSearchable = true;
                result.IsIdentity = true;
                result.IsSortable = true;
                result.AvailableFilters = new[] {ObjectFieldFilterOperator.Equals, ObjectFieldFilterOperator.DoesNotEqual};
            }

            if (propertyInfo.CustomAttributes.Any(x => x.AttributeType == typeof(TIndex)))
            {
                result.IsSearchable = true;
                result.IsIdentity = true;
                result.IsSortable = true;
                result.AvailableFilters = availableFilters.ContainsKey(propertyInfo.PropertyType)
                                              ? availableFilters[propertyInfo.PropertyType]
                                              : new[] {ObjectFieldFilterOperator.Equals, ObjectFieldFilterOperator.DoesNotEqual};
            }

            return result;
        }

        private readonly Dictionary<Type, ObjectFieldFilterOperator[]> availableFilters = new Dictionary<Type, ObjectFieldFilterOperator[]>
            {
                {
                    typeof(string), new[]
                        {
                            ObjectFieldFilterOperator.LessThan,
                            ObjectFieldFilterOperator.Equals,
                            ObjectFieldFilterOperator.GreaterThan,
                            ObjectFieldFilterOperator.DoesNotEqual,
                            ObjectFieldFilterOperator.LessThanOrEquals,
                            ObjectFieldFilterOperator.GreaterThanOrEquals,
                        }
                }
            };
    }
}