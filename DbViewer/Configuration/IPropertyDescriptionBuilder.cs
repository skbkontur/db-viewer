using System;
using System.Reflection;

using SkbKontur.DbViewer.DataTypes;

namespace SkbKontur.DbViewer.Configuration
{
    public interface IPropertyDescriptionBuilder
    {
        PropertyMetaInformation Build(PropertyInfo propertyInfo, Type typeInfo);
    }
}