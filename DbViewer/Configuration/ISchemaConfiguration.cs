using System;
using System.Linq;

using SkbKontur.DbViewer.Connector;
using SkbKontur.DbViewer.DataTypes;
using SkbKontur.DbViewer.Schemas;

namespace SkbKontur.DbViewer.Configuration
{
    public interface ISchemaConfiguration
    {
        SchemaDescription Description { get; }
        TypeDescription[] Types { get; }
        IDbConnectorFactory ConnectorsFactory { get; }
        IPropertyDescriptionBuilder PropertyDescriptionBuilder { get; }
    }

    public static class SchemaConfiguratorExtensions
    {
        public static Schema GetSchema(this ISchemaConfiguration schemaConfiguration, ICustomPropertyConfigurationProvider customPropertyConfigurationProvider)
        {
            var description = schemaConfiguration.Description;
            if (description.CountLimit == 0)
                description.CountLimit = 1000;

            if (description.CountLimitForSuperUser == 0)
                description.CountLimitForSuperUser = description.CountLimit;

            if (description.DownloadLimit == 0)
                description.DownloadLimit = 10000;

            if (description.DownloadLimitForSuperUser == 0)
                description.DownloadLimitForSuperUser = description.DownloadLimit;

            return new Schema
                {
                    Description = description,
                    Types = schemaConfiguration.Types,
                    ConnectorsFactory = schemaConfiguration.ConnectorsFactory,
                    CustomPropertyConfigurationProvider = customPropertyConfigurationProvider,
                    PropertyDescriptionBuilder = schemaConfiguration.PropertyDescriptionBuilder,
                };
        }

        public static TypeDescription[] ToTypeDescriptions(this Type[] types)
        {
            return types.Select(x => new TypeDescription {Type = x, TypeIdentifier = x.Name}).ToArray();
        }
    }
}