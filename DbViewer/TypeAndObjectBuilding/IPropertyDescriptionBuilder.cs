using System;
using System.Reflection;

using SkbKontur.DbViewer.DataTypes;

namespace SkbKontur.DbViewer.TypeAndObjectBuilding
{
    public interface IPropertyDescriptionBuilder
    {
        PropertyMetaInformation Build(PropertyInfo propertyInfo, Type typeInfo);
    }
}