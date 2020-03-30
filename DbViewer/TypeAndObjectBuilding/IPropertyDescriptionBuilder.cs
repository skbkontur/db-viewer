using System;
using System.Reflection;

using SkbKontur.DbViewer.Dto.TypeInfo;

namespace SkbKontur.DbViewer.TypeAndObjectBuilding
{
    public interface IPropertyDescriptionBuilder
    {
        PropertyDescription Build(PropertyInfo propertyInfo, Type typeInfo);
    }
}