using System.Reflection;
using Kontur.DBViewer.Core.TypeInformation;
using TypeInfo = Kontur.DBViewer.Core.TypeInformation.TypeInfo;

namespace Kontur.DBViewer.Tests.ExtractorsTests
{
    public class SimplePropertyDescriptionBuilder : IPropertyDescriptionBuilder
    {
        public PropertyDescription Build(PropertyInfo propertyInfo, TypeInfo typeInfo)
        {
            return new PropertyDescription
            {
                Name = propertyInfo.Name,
            };
        }
    }
}