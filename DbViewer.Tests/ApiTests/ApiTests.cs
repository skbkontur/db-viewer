using System;
using System.Linq;
using System.Threading.Tasks;

using AutoFixture;

using Cassandra;

using FluentAssertions;

using GroBuf;
using GroBuf.DataMembersExtracters;

using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

using NUnit.Framework;

using SkbKontur.DbViewer.Cql.CustomPropertyConfigurations;
using SkbKontur.DbViewer.DataTypes;
using SkbKontur.DbViewer.Schemas;
using SkbKontur.DbViewer.TestApi;
using SkbKontur.DbViewer.TestApi.Controllers;
using SkbKontur.DbViewer.TestApi.Impl;
using SkbKontur.DbViewer.TestApi.Impl.Classes;

namespace SkbKontur.DbViewer.Tests.ApiTests
{
    public class ApiTests
    {
        [OneTimeSetUp]
        public void SetUp()
        {
            service = new WebApiService();
            client = new ApiClient();
            serializer = new Serializer(new AllPropertiesExtractor());
            fixture = new Fixture();
            fixture.Register(TimeUuid.NewId);
            fixture.Register((DateTime dt) => dt.ToLocalDate());
            fixture.Register((ChildClass c) => (BaseClass)c);
            var schemaRegistry = new SchemaRegistry();
            schemaRegistry.Add(
                new Schema
                    {
                        Description = new SchemaDescription
                            {
                                SchemaName = "SampleSchema",
                                DownloadLimit = 10_000,
                                CountLimit = 100,
                                AllowReadAll = false,
                            },
                        Types = new[]
                            {
                                new TypeDescription
                                    {
                                        Type = typeof(TestClass),
                                        TypeIdentifier = "TestClass",
                                    },
                            },
                        PropertyDescriptionBuilder = new SamplePropertyDescriptionBuilder(),
                        ConnectorsFactory = new SampleIdbConnectorFactory(),
                        CustomPropertyConfigurationProvider = new SampleCustomPropertyConfigurationProvider(),
                    }
            );
            var testClassWithCustomPrimitivesShape = new TypeMetaInformation
                {
                    TypeName = "TestClassWithCustomPrimitives",
                    GenericTypeArguments = new TypeMetaInformation[0],
                    Properties = new[]
                        {
                            new PropertyMetaInformation
                                {
                                    Type = null,
                                    Name = "BaseClass",
                                    AvailableValues = new string[0],
                                },
                            new PropertyMetaInformation
                                {
                                    Type = TypeMetaInformation.ForSimpleType("DateTime", isNullable : true),
                                    Name = "LocalTime",
                                    AvailableValues = new string[0],
                                },
                            new PropertyMetaInformation
                                {
                                    Type = TypeMetaInformation.ForSimpleType("String"),
                                    Name = "TimeUuid",
                                    AvailableValues = new string[0],
                                },
                            new PropertyMetaInformation
                                {
                                    Type = TypeMetaInformation.ForSimpleType("String"),
                                    Name = "NullableTimeUuid",
                                    AvailableValues = new string[0],
                                },
                        }
                };
            var testClassWithAllPrimitivesShape = new TypeMetaInformation
                {
                    TypeName = "TestClassWithAllPrimitives",
                    GenericTypeArguments = new TypeMetaInformation[0],
                    Properties = new[]
                        {
                            new PropertyMetaInformation
                                {
                                    Type = TypeMetaInformation.ForSimpleType("String"),
                                    Name = "String",
                                    AvailableValues = new string[0],
                                },
                            new PropertyMetaInformation
                                {
                                    Type = TypeMetaInformation.ForSimpleType("Guid"),
                                    Name = "Guid",
                                    AvailableValues = new string[0],
                                },
                            new PropertyMetaInformation
                                {
                                    Type = TypeMetaInformation.ForSimpleType("Guid", isNullable : true),
                                    Name = "NullableGuid",
                                    AvailableValues = new string[0],
                                },
                            new PropertyMetaInformation
                                {
                                    Type = TypeMetaInformation.ForSimpleType("Boolean"),
                                    Name = "Bool",
                                    AvailableValues = new string[0],
                                },
                            new PropertyMetaInformation
                                {
                                    Type = TypeMetaInformation.ForSimpleType("Boolean", isNullable : true),
                                    Name = "NullableBool",
                                    AvailableValues = new string[0],
                                },
                            new PropertyMetaInformation
                                {
                                    Type = TypeMetaInformation.ForSimpleType("Byte"),
                                    Name = "Byte",
                                    AvailableValues = new string[0],
                                },
                            new PropertyMetaInformation
                                {
                                    Type = TypeMetaInformation.ForSimpleType("Byte", isNullable : true),
                                    Name = "NullableByte",
                                    AvailableValues = new string[0],
                                },
                            new PropertyMetaInformation
                                {
                                    Type = TypeMetaInformation.ForSimpleType("Char"),
                                    Name = "Char",
                                    AvailableValues = new string[0],
                                },
                            new PropertyMetaInformation
                                {
                                    Type = TypeMetaInformation.ForSimpleType("Char", isNullable : true),
                                    Name = "NullableChar",
                                    AvailableValues = new string[0],
                                },
                            new PropertyMetaInformation
                                {
                                    Type = TypeMetaInformation.ForSimpleType("Int16"),
                                    Name = "Short",
                                    AvailableValues = new string[0],
                                },
                            new PropertyMetaInformation
                                {
                                    Type = TypeMetaInformation.ForSimpleType("Int16", isNullable : true),
                                    Name = "NullableShort",
                                    AvailableValues = new string[0],
                                },
                            new PropertyMetaInformation
                                {
                                    Type = TypeMetaInformation.ForSimpleType("Int32"),
                                    Name = "Int",
                                    AvailableValues = new string[0],
                                },
                            new PropertyMetaInformation
                                {
                                    Type = TypeMetaInformation.ForSimpleType("Int32", isNullable : true),
                                    Name = "NullableInt",
                                    AvailableValues = new string[0],
                                },
                            new PropertyMetaInformation
                                {
                                    Type = TypeMetaInformation.ForSimpleType("Int64"),
                                    Name = "Long",
                                    AvailableValues = new string[0],
                                },
                            new PropertyMetaInformation
                                {
                                    Type = TypeMetaInformation.ForSimpleType("Int64", isNullable : true),
                                    Name = "NullableLong",
                                    AvailableValues = new string[0],
                                },
                            new PropertyMetaInformation
                                {
                                    Type = TypeMetaInformation.ForSimpleType("Decimal"),
                                    Name = "Decimal",
                                    AvailableValues = new string[0],
                                },
                            new PropertyMetaInformation
                                {
                                    Type = TypeMetaInformation.ForSimpleType("Decimal", isNullable : true),
                                    Name = "NullableDecimal",
                                    AvailableValues = new string[0],
                                },
                            new PropertyMetaInformation
                                {
                                    Type = TypeMetaInformation.ForSimpleType("DateTime"),
                                    Name = "DateTime",
                                    AvailableValues = new string[0],
                                },
                            new PropertyMetaInformation
                                {
                                    Type = TypeMetaInformation.ForSimpleType("DateTime", isNullable : true),
                                    Name = "NullableDateTime",
                                    AvailableValues = new string[0],
                                },
                            new PropertyMetaInformation
                                {
                                    Type = TypeMetaInformation.ForSimpleType("DateTimeOffset"),
                                    Name = "DateTimeOffset",
                                    AvailableValues = new string[0],
                                },
                            new PropertyMetaInformation
                                {
                                    Type = TypeMetaInformation.ForSimpleType("DateTimeOffset", isNullable : true),
                                    Name = "NullableDateTimeOffset",
                                    AvailableValues = new string[0],
                                },
                            new PropertyMetaInformation
                                {
                                    Type = TypeMetaInformation.ForSimpleType("TestEnum"),
                                    Name = "Enum",
                                    AvailableValues = new[] {"FirstValue", "SecondValue"},
                                },
                            new PropertyMetaInformation
                                {
                                    Type = TypeMetaInformation.ForSimpleType("TestEnum", isNullable : true),
                                    Name = "NullableEnum",
                                    AvailableValues = new[] {"FirstValue", "SecondValue"},
                                },
                            new PropertyMetaInformation
                                {
                                    Type = new TypeMetaInformation
                                        {
                                            TypeName = "Int32[]",
                                            IsArray = true,
                                            GenericTypeArguments = new[] {TypeMetaInformation.ForSimpleType("Int32")},
                                            Properties = new PropertyMetaInformation[0],
                                        },
                                    Name = "Array",
                                    AvailableValues = new string[0],
                                },
                            new PropertyMetaInformation
                                {
                                    Type = new TypeMetaInformation
                                        {
                                            TypeName = "List",
                                            IsArray = true,
                                            GenericTypeArguments = new[] {TypeMetaInformation.ForSimpleType("Int32")},
                                            Properties = new PropertyMetaInformation[0],
                                        },
                                    Name = "List",
                                    AvailableValues = new string[0],
                                },
                            new PropertyMetaInformation
                                {
                                    Type = new TypeMetaInformation
                                        {
                                            TypeName = "Dictionary",
                                            IsArray = true,
                                            GenericTypeArguments = new[] {TypeMetaInformation.ForSimpleType("String"), TypeMetaInformation.ForSimpleType("Int32")},
                                            Properties = new PropertyMetaInformation[0],
                                        },
                                    Name = "Dictionary",
                                    AvailableValues = new string[0],
                                },
                            new PropertyMetaInformation
                                {
                                    Type = new TypeMetaInformation
                                        {
                                            TypeName = "HashSet",
                                            IsArray = true,
                                            GenericTypeArguments = new[] {TypeMetaInformation.ForSimpleType("String")},
                                            Properties = new PropertyMetaInformation[0],
                                        },
                                    Name = "HashSet",
                                    AvailableValues = new string[0],
                                },
                        }
                };
            testClassShape = new TypeMetaInformation
                {
                    TypeName = "TestClass",
                    GenericTypeArguments = new TypeMetaInformation[0],
                    Properties = new[]
                        {
                            new PropertyMetaInformation
                                {
                                    Type = TypeMetaInformation.ForSimpleType("String"),
                                    Name = "Id",
                                    IsIdentity = true,
                                    IsSearchable = true,
                                    AvailableFilters = new[] {ObjectFieldFilterOperator.Equals, ObjectFieldFilterOperator.DoesNotEqual},
                                    AvailableValues = new string[0],
                                },
                            new PropertyMetaInformation
                                {
                                    Type = testClassWithAllPrimitivesShape,
                                    Name = "Content",
                                    AvailableValues = new string[0],
                                },
                            new PropertyMetaInformation
                                {
                                    Type = new TypeMetaInformation
                                        {
                                            TypeName = "ClassForSerialization",
                                            GenericTypeArguments = new TypeMetaInformation[0],
                                            Properties = new[]
                                                {
                                                    new PropertyMetaInformation
                                                        {
                                                            Type = testClassWithAllPrimitivesShape,
                                                            Name = "Content",
                                                            AvailableValues = new string[0],
                                                        }
                                                }
                                        },
                                    Name = "Serialized",
                                    AvailableValues = new string[0],
                                },
                            new PropertyMetaInformation
                                {
                                    Type = new TypeMetaInformation
                                        {
                                            TypeName = "Byte[]",
                                            IsArray = true,
                                            GenericTypeArguments = new[] {TypeMetaInformation.ForSimpleType("Byte")},
                                            Properties = new PropertyMetaInformation[0],
                                        },
                                    Name = "File",
                                    AvailableValues = new string[0],
                                },
                            new PropertyMetaInformation
                                {
                                    Type = TypeMetaInformation.ForSimpleType("DifficultEnum"),
                                    Name = "DifficultEnum",
                                    AvailableValues = new[] {"A", "B"}
                                },
                            new PropertyMetaInformation
                                {
                                    Type = null,
                                    Name = "DifficultSerialized",
                                    AvailableValues = new string[0],
                                },
                            new PropertyMetaInformation
                                {
                                    Type = testClassWithCustomPrimitivesShape,
                                    Name = "CustomContent",
                                    AvailableValues = new string[0],
                                },
                            new PropertyMetaInformation
                                {
                                    Name = "GenericIntValues",
                                    AvailableValues = new string[0],
                                    Type = GetGenericTypeMeta(TypeMetaInformation.ForSimpleType("Int32"))
                                },
                            new PropertyMetaInformation
                                {
                                    Name = "GenericStringValues",
                                    AvailableValues = new string[0],
                                    Type = GetGenericTypeMeta(TypeMetaInformation.ForSimpleType("String"))
                                },
                            new PropertyMetaInformation
                                {
                                    Name = "BaseClass",
                                    AvailableValues = new string[0],
                                    Type = new TypeMetaInformation
                                        {
                                            TypeName = "BaseClass[]",
                                            IsArray = true,
                                            Properties = new PropertyMetaInformation[0],
                                            GenericTypeArguments = new[] {TypeMetaInformation.ForSimpleType("BaseClass")},
                                        }
                                }
                        },
                };
            SchemaRegistryProvider.SetSchemaRegistry(schemaRegistry);
            service.Start(7777);
        }

        private static TypeMetaInformation GetGenericTypeMeta(TypeMetaInformation typeParameter)
        {
            return new TypeMetaInformation
                {
                    TypeName = "GenericClass",
                    GenericTypeArguments = new[] {typeParameter},
                    Properties = new[]
                        {
                            new PropertyMetaInformation
                                {
                                    Name = "String",
                                    AvailableValues = new string[0],
                                    Type = TypeMetaInformation.ForSimpleType("String")
                                },
                            new PropertyMetaInformation
                                {
                                    Name = "Value",
                                    AvailableValues = new string[0],
                                    Type = typeParameter,
                                },
                            new PropertyMetaInformation
                                {
                                    Name = "Values",
                                    AvailableValues = new string[0],
                                    Type = new TypeMetaInformation
                                        {
                                            TypeName = "List",
                                            IsArray = true,
                                            Properties = new PropertyMetaInformation[0],
                                            GenericTypeArguments = new[] {typeParameter}
                                        }
                                },
                            new PropertyMetaInformation
                                {
                                    Name = "MoreValues",
                                    AvailableValues = new string[0],
                                    Type = new TypeMetaInformation
                                        {
                                            TypeName = "Dictionary",
                                            IsArray = true,
                                            Properties = new PropertyMetaInformation[0],
                                            GenericTypeArguments = new[] {TypeMetaInformation.ForSimpleType("String"), typeParameter}
                                        }
                                },
                        }
                };
        }

        [OneTimeTearDown]
        public void TearDown()
        {
            try
            {
                service.Stop();
            }
            catch
            {
                // ignored
            }
        }

        [Test]
        public async Task Test_Read()
        {
            var customPropertyContent = fixture.Create<ClassForSerialization>();
            var @object = fixture.Build<TestClass>()
                                 .With(x => x.Serialized, serializer.Serialize(customPropertyContent))
                                 .With(x => x.DifficultEnum, DifficultEnum.A)
                                 .With(x => x.DifficultSerialized, serializer.Serialize(new A {Int = 1}))
                                 .Create();
            FillDataBase(@object);
            var result = await client.Read("TestClass", new[]
                {
                    new Condition
                        {
                            Operator = ObjectFieldFilterOperator.Equals,
                            Path = "Id",
                            Value = @object.Id,
                        }
                });
            testClassShape.Properties[5].Type = new TypeMetaInformation
                {
                    TypeName = "A",
                    GenericTypeArguments = new TypeMetaInformation[0],
                    Properties = new[]
                        {
                            new PropertyMetaInformation
                                {
                                    Name = "Int",
                                    AvailableValues = new string[0],
                                    Type = TypeMetaInformation.ForSimpleType("Int32")
                                }
                        }
                };
            testClassShape.Properties[6].Type.Properties[0].Type = new TypeMetaInformation
                {
                    TypeName = "ChildClass",
                    Properties = new[]
                        {
                            new PropertyMetaInformation
                                {
                                    Name = "Int",
                                    AvailableValues = new string[0],
                                    Type = TypeMetaInformation.ForSimpleType("Int32")
                                }
                        },
                    GenericTypeArguments = new TypeMetaInformation[0],
                };

            CheckShape(result.Meta.TypeMetaInformation, testClassShape);
            var localTime = @object.CustomContent.LocalTime;
            CheckObject(result.Object, new ExpandedTestClass
                {
                    Id = @object.Id,
                    Content = @object.Content,
                    Serialized = customPropertyContent,
                    DifficultSerialized = new A {Int = 1},
                    CustomContent = new ExpandedTestClassWithAllPrimitives
                        {
                            LocalTime = new DateTime(1, 1, 1, localTime.Hour, localTime.Minute, localTime.Second, localTime.Nanoseconds / 1000, DateTimeKind.Utc),
                            TimeUuid = @object.CustomContent.TimeUuid.ToString(),
                            NullableTimeUuid = @object.CustomContent.NullableTimeUuid.ToString(),
                        },
                });
        }

        [Test]
        public async Task Test_Write()
        {
            var oldCustomPropertyContent = fixture.Create<ClassForSerialization>();
            var oldObject = fixture.Build<TestClass>()
                                   .With(x => x.Serialized, serializer.Serialize(oldCustomPropertyContent))
                                   .With(x => x.DifficultEnum, DifficultEnum.A)
                                   .With(x => x.DifficultSerialized, serializer.Serialize(new A {Int = 1}))
                                   .Create();

            FillDataBase(oldObject);

            var conditions = new[]
                {
                    new Condition
                        {
                            Operator = ObjectFieldFilterOperator.Equals,
                            Path = "Id",
                            Value = oldObject.Id,
                        },
                };
            var result = await Write("TestClass", new ObjectUpdateRequest
                {
                    Conditions = conditions,
                    Path = new[] {"Content", "String"},
                    Value = "qwer",
                });
            result["Content"]["String"].ToObject<string>().Should().Be("qwer");

            var key = oldObject.Content.Dictionary.Keys.First();
            result = await Write("TestClass", new ObjectUpdateRequest
                {
                    Conditions = conditions,
                    Path = new[] {"Content", "Dictionary", key},
                    Value = "12",
                });
            result["Content"]["Dictionary"][key].ToObject<int>().Should().Be(12);

            result = await Write("TestClass", new ObjectUpdateRequest
                {
                    Conditions = conditions,
                    Path = new[] {"Serialized", "Content", "List", "0"},
                    Value = "132",
                });
            result["Serialized"]["Content"]["List"][0].ToObject<int>().Should().Be(132);

            result = await Write("TestClass", new ObjectUpdateRequest
                {
                    Conditions = conditions,
                    Path = new[] {"CustomContent", "LocalTime"},
                    Value = "0001-01-01T12:43:12.123000Z",
                });
            result["CustomContent"]["LocalTime"].ToObject<DateTime>().Should().Be(new DateTime(0001, 01, 01, 12, 43, 12, 123, DateTimeKind.Utc));

            oldObject.Content.String = "qwer";
            oldObject.Content.Dictionary[key] = 12;
            oldCustomPropertyContent.Content.List[0] = 132;
            oldObject.Serialized = serializer.Serialize(oldCustomPropertyContent);
            oldObject.CustomContent.LocalTime = new LocalTime(12, 43, 12, 123_000_000);

            CheckDataBaseContent(oldObject);
        }

        [Test]
        public async Task Test_List()
        {
            var result = await client.GetTypesDescription();
            var schemaDescription = new SchemaDescription
                {
                    SchemaName = "SampleSchema",
                    DownloadLimit = 10_000,
                    CountLimit = 100,
                    AllowReadAll = false,
                };
            result.Should().BeEquivalentTo(new ObjectIdentifier
                {
                    Identifier = "TestClass",
                    SchemaDescription = schemaDescription,
                });

            var meta = await client.GetTypeMeta("TestClass");

            testClassShape.Properties[5].Type = new TypeMetaInformation
                {
                    TypeName = "Object",
                    Properties = new PropertyMetaInformation[0],
                    GenericTypeArguments = new TypeMetaInformation[0],
                };
            testClassShape.Properties[6].Type.Properties[0].Type = new TypeMetaInformation
                {
                    TypeName = "BaseClass",
                    Properties = new PropertyMetaInformation[0],
                    GenericTypeArguments = new TypeMetaInformation[0],
                };

            meta.Should().BeEquivalentTo(new ObjectDescription
                {
                    Identifier = "TestClass",
                    SchemaDescription = schemaDescription,
                    TypeMetaInformation = testClassShape,
                });
        }

        private async Task<JObject> Write(string objectIdentifier, ObjectUpdateRequest query)
        {
            await client.Write(objectIdentifier, query);
            return (JObject)(await client.Read(objectIdentifier, query.Conditions)).Object;
        }

        private void FillDataBase(params TestClass[] objects)
        {
            SampleDataBase.Instance = new SampleDataBase(objects);
        }

        private void CheckDataBaseContent(params TestClass[] objects)
        {
            SampleDataBase.Instance.GetContent().Should().BeEquivalentTo(objects);
        }

        private void CheckObject<T>(object actual, T expected)
        {
            JsonConvert.DeserializeObject<T>(((JObject)actual).ToString()).Should()
                       .BeEquivalentTo(expected);
        }

        private void CheckShape(TypeMetaInformation actual, TypeMetaInformation expected)
        {
            actual.Should().BeEquivalentTo(expected, x => x.RespectingRuntimeTypes());
        }

        private WebApiService service;
        private ApiClient client;
        private TypeMetaInformation testClassShape;
        private ISerializer serializer;
        private Fixture fixture;
    }
}