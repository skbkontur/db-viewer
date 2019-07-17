using System;
using System.Linq;
using Alko.Configuration.Settings;
using Kontur.DBViewer.Core.Schemas;
using Kontur.DBViewer.Recipes.CQL;
using Kontur.DBViewer.SampleApi.Controllers;
using Kontur.DBViewer.SampleApi.Impl;
using Kontur.DBViewer.SampleApi.Impl.Classes;
using Topshelf;

namespace Kontur.DBViewer.SampleApi
{
    public class Service : ServiceControl
    {
        private WebApiService service;

        public bool Start(HostControl hostControl)
        {
            try
            {
                var applicationSettings = ApplicationSettings.LoadDefault("sampleApi.csf");
                var port = applicationSettings.GetInt("ListeningPort");
                var schemaRegistry = new SchemaRegistry();
                schemaRegistry.Add(
                    new Schema
                    {
                        Description = new SchemaDescription
                        {
                            Countable = true,
                            SchemaName = "SampleSchema",
                            MaxCountLimit = 10_000,
                            DefaultCountLimit = 100,
                            EnableDefaultSearch = false,
                        },
                        Types = BuildTypeDescriptions(
                            typeof(TestClass)
                        ),
                        PropertyDescriptionBuilder = new SamplePropertyDescriptionBuilder(),
                        ConnectorsFactory = new SampleIdbConnectorFactory(),
                        CustomPropertyConfigurationProvider = new SampleCustomPropertyConfigurationProvider(),
                    }
                );

                schemaRegistry.Add(new Schema
                {
                    Description = new SchemaDescription
                    {
                        SchemaName = "CQL",
                    },
                    Types = BuildTypeDescriptions(typeof(SimpleCqlObject), typeof(NestedCqlObject)),
                    ConnectorsFactory = new CqlDbConnectorFactory(),
                    PropertyDescriptionBuilder = new CqlPropertyDescriptionBuilder(),
                    CustomPropertyConfigurationProvider = new CustomPropertyConfigurationProvider()
                });

                SchemaRegistryProvider.SetSchemaRegistry(schemaRegistry);
                service = new WebApiService();
                service.Start(port);
                Console.WriteLine("Service started (for service runner)");
                return true;
            }
            catch
            {
                return false;
            }
        }

        private TypeDescription[] BuildTypeDescriptions(params Type[] types)
        {
            return types.Select(type => new TypeDescription
            {
                Type = type,
                TypeIdentifier = type.Name,
            }).ToArray();
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
    }
}