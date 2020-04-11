using System;
using System.Linq;

using SkbKontur.DbViewer.Cql;
using SkbKontur.DbViewer.Schemas;
using SkbKontur.DbViewer.TestApi.Controllers;
using SkbKontur.DbViewer.TestApi.Cql;
using SkbKontur.DbViewer.TestApi.Impl;
using SkbKontur.DbViewer.TestApi.Impl.Classes;

using Topshelf;

namespace SkbKontur.DbViewer.TestApi
{
    public class Service : ServiceControl
    {
        public bool Start(HostControl hostControl)
        {
            var schemaRegistry = new SchemaRegistry();
            schemaRegistry.Add(
                new Schema
                    {
                        Description = new SchemaDescription
                            {
                                SchemaName = "SampleSchema",
                                DownloadLimit = 100_000,
                                CountLimit = 10_000,
                                AllowReadAll = true,
                                AllowEdit = true,
                            },
                        Types = BuildTypeDescriptions(typeof(TestClass)),
                        PropertyDescriptionBuilder = new SamplePropertyDescriptionBuilder(),
                        ConnectorsFactory = new SampleIdbConnectorFactory(),
                        CustomPropertyConfigurationProvider = new SampleCustomPropertyConfigurationProvider(),
                    }
            );

            schemaRegistry.Add(new Schema
                {
                    Description = new SchemaDescription
                        {
                            AllowReadAll = true,
                            CountLimit = 10_000,
                            DownloadLimit = 100_000,
                            SchemaName = "CQL Objects",
                            AllowDelete = true,
                            AllowEdit = true,
                        },
                    Types = BuildTypeDescriptions(typeof(CqlDocumentMeta),
                                                  typeof(CqlOrganizationInfo),
                                                  typeof(CqlUserInfo),
                                                  typeof(DocumentBindingsMeta),
                                                  typeof(DocumentPrintingInfo),
                                                  typeof(DocumentStorageElement)),
                    ConnectorsFactory = new Cql.CqlDbConnectorFactory(),
                    PropertyDescriptionBuilder = new CqlPropertyDescriptionBuilder(),
                    CustomPropertyConfigurationProvider = new CustomPropertyConfigurationProvider()
                });

            SchemaRegistryProvider.SetSchemaRegistry(schemaRegistry);
            service = new WebApiService();
            service.Start(5555);
            Console.WriteLine("Service started (for service runner)");
            return true;
        }

        private static TypeDescription[] BuildTypeDescriptions(params Type[] types)
        {
            return types.Select(type => new TypeDescription {Type = type, TypeIdentifier = type.Name,}).ToArray();
        }

        public bool Stop(HostControl hostControl)
        {
            try
            {
                service.Stop();
                return true;
            }
            catch
            {
                return false;
            }
        }

        private WebApiService service;
    }
}