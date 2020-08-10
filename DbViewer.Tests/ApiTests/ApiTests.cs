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
using SkbKontur.DbViewer.TestApi.Impl;
using SkbKontur.DbViewer.TestApi.Impl.Classes;

namespace SkbKontur.DbViewer.Tests.ApiTests
{
    public class ApiTests
    {
        [OneTimeSetUp]
        public void SetUp()
        {
            client = new ApiClient();
            serializer = new Serializer(new AllPropertiesExtractor());
            fixture = new Fixture();
            fixture.Register(TimeUuid.NewId);
            fixture.Register((DateTime dt) => dt.ToLocalDate());
            fixture.Register((ChildClass c) => (BaseClass)c);
            var testClassWithCustomPrimitivesShape = GetTestClassWithCustomPrimitivesShape();
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
                                    IsEditable = true,
                                    AvailableValues = new string[0],
                                },
                            new PropertyMetaInformation
                                {
                                    Type = TypeMetaInformation.ForSimpleType("Guid"),
                                    Name = "Guid",
                                    IsEditable = true,
                                    AvailableValues = new string[0],
                                },
                            new PropertyMetaInformation
                                {
                                    Type = TypeMetaInformation.ForSimpleType("Guid", isNullable : true),
                                    Name = "NullableGuid",
                                    IsEditable = true,
                                    AvailableValues = new string[0],
                                },
                            new PropertyMetaInformation
                                {
                                    Type = TypeMetaInformation.ForSimpleType("Boolean"),
                                    Name = "Bool",
                                    IsEditable = true,
                                    AvailableValues = new string[0],
                                },
                            new PropertyMetaInformation
                                {
                                    Type = TypeMetaInformation.ForSimpleType("Boolean", isNullable : true),
                                    Name = "NullableBool",
                                    IsEditable = true,
                                    AvailableValues = new string[0],
                                },
                            new PropertyMetaInformation
                                {
                                    Type = TypeMetaInformation.ForSimpleType("Byte"),
                                    Name = "Byte",
                                    IsEditable = true,
                                    AvailableValues = new string[0],
                                },
                            new PropertyMetaInformation
                                {
                                    Type = TypeMetaInformation.ForSimpleType("Byte", isNullable : true),
                                    Name = "NullableByte",
                                    IsEditable = true,
                                    AvailableValues = new string[0],
                                },
                            new PropertyMetaInformation
                                {
                                    Type = TypeMetaInformation.ForSimpleType("Char"),
                                    Name = "Char",
                                    IsEditable = true,
                                    AvailableValues = new string[0],
                                },
                            new PropertyMetaInformation
                                {
                                    Type = TypeMetaInformation.ForSimpleType("Char", isNullable : true),
                                    Name = "NullableChar",
                                    IsEditable = true,
                                    AvailableValues = new string[0],
                                },
                            new PropertyMetaInformation
                                {
                                    Type = TypeMetaInformation.ForSimpleType("Int16"),
                                    Name = "Short",
                                    IsEditable = true,
                                    AvailableValues = new string[0],
                                },
                            new PropertyMetaInformation
                                {
                                    Type = TypeMetaInformation.ForSimpleType("Int16", isNullable : true),
                                    Name = "NullableShort",
                                    IsEditable = true,
                                    AvailableValues = new string[0],
                                },
                            new PropertyMetaInformation
                                {
                                    Type = TypeMetaInformation.ForSimpleType("Int32"),
                                    Name = "Int",
                                    IsEditable = true,
                                    AvailableValues = new string[0],
                                },
                            new PropertyMetaInformation
                                {
                                    Type = TypeMetaInformation.ForSimpleType("Int32", isNullable : true),
                                    Name = "NullableInt",
                                    IsEditable = true,
                                    AvailableValues = new string[0],
                                },
                            new PropertyMetaInformation
                                {
                                    Type = TypeMetaInformation.ForSimpleType("Int64"),
                                    Name = "Long",
                                    IsEditable = true,
                                    AvailableValues = new string[0],
                                },
                            new PropertyMetaInformation
                                {
                                    Type = TypeMetaInformation.ForSimpleType("Int64", isNullable : true),
                                    Name = "NullableLong",
                                    IsEditable = true,
                                    AvailableValues = new string[0],
                                },
                            new PropertyMetaInformation
                                {
                                    Type = TypeMetaInformation.ForSimpleType("Decimal"),
                                    Name = "Decimal",
                                    IsEditable = true,
                                    AvailableValues = new string[0],
                                },
                            new PropertyMetaInformation
                                {
                                    Type = TypeMetaInformation.ForSimpleType("Decimal", isNullable : true),
                                    Name = "NullableDecimal",
                                    IsEditable = true,
                                    AvailableValues = new string[0],
                                },
                            new PropertyMetaInformation
                                {
                                    Type = TypeMetaInformation.ForSimpleType("DateTime"),
                                    Name = "DateTime",
                                    IsEditable = true,
                                    AvailableValues = new string[0],
                                },
                            new PropertyMetaInformation
                                {
                                    Type = TypeMetaInformation.ForSimpleType("DateTime", isNullable : true),
                                    Name = "NullableDateTime",
                                    IsEditable = true,
                                    AvailableValues = new string[0],
                                },
                            new PropertyMetaInformation
                                {
                                    Type = TypeMetaInformation.ForSimpleType("DateTimeOffset"),
                                    Name = "DateTimeOffset",
                                    IsEditable = true,
                                    AvailableValues = new string[0],
                                },
                            new PropertyMetaInformation
                                {
                                    Type = TypeMetaInformation.ForSimpleType("DateTimeOffset", isNullable : true),
                                    Name = "NullableDateTimeOffset",
                                    IsEditable = true,
                                    AvailableValues = new string[0],
                                },
                            new PropertyMetaInformation
                                {
                                    Type = TypeMetaInformation.ForSimpleType("TestEnum"),
                                    Name = "Enum",
                                    IsEditable = true,
                                    AvailableValues = new[] {"FirstValue", "SecondValue"},
                                },
                            new PropertyMetaInformation
                                {
                                    Type = TypeMetaInformation.ForSimpleType("TestEnum", isNullable : true),
                                    Name = "NullableEnum",
                                    IsEditable = true,
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
                                    IsEditable = true,
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
                                    IsEditable = true,
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
                                    IsEditable = true,
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
                                    IsEditable = true,
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
                                    IsEditable = true,
                                    IsIdentity = true,
                                    IsSearchable = true,
                                    AvailableFilters = new[] {ObjectFieldFilterOperator.Equals, ObjectFieldFilterOperator.DoesNotEqual},
                                    AvailableValues = new string[0],
                                },
                            new PropertyMetaInformation
                                {
                                    Type = testClassWithAllPrimitivesShape,
                                    Name = "Content",
                                    IsEditable = true,
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
                                                            IsEditable = true,
                                                            AvailableValues = new string[0],
                                                        }
                                                }
                                        },
                                    Name = "Serialized",
                                    IsEditable = true,
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
                                    IsEditable = true,
                                    AvailableValues = new string[0],
                                },
                            new PropertyMetaInformation
                                {
                                    Type = TypeMetaInformation.ForSimpleType("DifficultEnum"),
                                    Name = "DifficultEnum",
                                    IsEditable = true,
                                    AvailableValues = new[] {"A", "B"}
                                },
                            new PropertyMetaInformation
                                {
                                    Type = null,
                                    Name = "DifficultSerialized",
                                    IsEditable = true,
                                    AvailableValues = new string[0],
                                },
                            new PropertyMetaInformation
                                {
                                    Type = testClassWithCustomPrimitivesShape,
                                    Name = "CustomContent",
                                    IsEditable = true,
                                    AvailableValues = new string[0],
                                },
                            new PropertyMetaInformation
                                {
                                    Name = "GenericIntValues",
                                    IsEditable = true,
                                    AvailableValues = new string[0],
                                    Type = GetGenericTypeMeta(TypeMetaInformation.ForSimpleType("Int32"))
                                },
                            new PropertyMetaInformation
                                {
                                    Name = "GenericStringValues",
                                    IsEditable = true,
                                    AvailableValues = new string[0],
                                    Type = GetGenericTypeMeta(TypeMetaInformation.ForSimpleType("String"))
                                },
                            new PropertyMetaInformation
                                {
                                    Name = "BaseClass",
                                    IsEditable = true,
                                    AvailableValues = new string[0],
                                    Type = new TypeMetaInformation
                                        {
                                            TypeName = "BaseClass[]",
                                            IsArray = true,
                                            Properties = new PropertyMetaInformation[0],
                                            GenericTypeArguments = new[] {TypeMetaInformation.ForSimpleType("BaseClass")},
                                        }
                                },
                            new PropertyMetaInformation
                                {
                                    Name = "NotEditable",
                                    Type = TypeMetaInformation.ForSimpleType("DifficultEnum"),
                                    AvailableValues = new[] {"A", "B"}
                                }
                        },
                };
        }

        private static TypeMetaInformation GetTestClassWithCustomPrimitivesShape()
        {
            return new TypeMetaInformation
                {
                    TypeName = "TestClassWithCustomPrimitives",
                    GenericTypeArguments = new TypeMetaInformation[0],
                    Properties = new[]
                        {
                            new PropertyMetaInformation
                                {
                                    Type = null,
                                    Name = "BaseClass",
                                    IsEditable = true,
                                    AvailableValues = new string[0],
                                },
                            new PropertyMetaInformation
                                {
                                    Type = TypeMetaInformation.ForSimpleType("DateTime", isNullable : true),
                                    Name = "LocalTime",
                                    IsEditable = true,
                                    AvailableValues = new string[0],
                                },
                            new PropertyMetaInformation
                                {
                                    Type = TypeMetaInformation.ForSimpleType("String"),
                                    Name = "TimeUuid",
                                    IsEditable = true,
                                    AvailableValues = new string[0],
                                },
                            new PropertyMetaInformation
                                {
                                    Type = TypeMetaInformation.ForSimpleType("String"),
                                    Name = "NullableTimeUuid",
                                    IsEditable = true,
                                    AvailableValues = new string[0],
                                },
                        }
                };
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
                                    IsEditable = true,
                                    AvailableValues = new string[0],
                                    Type = TypeMetaInformation.ForSimpleType("String")
                                },
                            new PropertyMetaInformation
                                {
                                    Name = "Value",
                                    IsEditable = true,
                                    AvailableValues = new string[0],
                                    Type = typeParameter,
                                },
                            new PropertyMetaInformation
                                {
                                    Name = "Values",
                                    IsEditable = true,
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
                                    IsEditable = true,
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
                                    IsEditable = true,
                                    AvailableValues = new string[0],
                                    Type = TypeMetaInformation.ForSimpleType("Int32")
                                }
                        }
                };

            testClassShape.Properties[6].Type = GetTestClassWithCustomPrimitivesShape();
            testClassShape.Properties[6].Type.Properties[0].Type = new TypeMetaInformation
                {
                    TypeName = "ChildClass",
                    Properties = new[]
                        {
                            new PropertyMetaInformation
                                {
                                    Name = "Int",
                                    IsEditable = true,
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
            testClassShape.Properties[6].Type.Properties[1].Type = new TypeMetaInformation
                {
                    TypeName = "LocalTime",
                    GenericTypeArguments = new TypeMetaInformation[0],
                    Properties = new[]
                        {
                            new PropertyMetaInformation
                                {
                                    Name = "TotalNanoseconds",
                                    IsEditable = true,
                                    AvailableValues = new string[0],
                                    Type = TypeMetaInformation.ForSimpleType("Int64")
                                },
                            new PropertyMetaInformation
                                {
                                    Name = "Hour",
                                    AvailableValues = new string[0],
                                    Type = TypeMetaInformation.ForSimpleType("Int32")
                                },
                            new PropertyMetaInformation
                                {
                                    Name = "Minute",
                                    AvailableValues = new string[0],
                                    Type = TypeMetaInformation.ForSimpleType("Int32")
                                },
                            new PropertyMetaInformation
                                {
                                    Name = "Second",
                                    AvailableValues = new string[0],
                                    Type = TypeMetaInformation.ForSimpleType("Int32")
                                },
                            new PropertyMetaInformation
                                {
                                    Name = "Nanoseconds",
                                    AvailableValues = new string[0],
                                    Type = TypeMetaInformation.ForSimpleType("Int32")
                                },
                        }
                };
            testClassShape.Properties[6].Type.Properties[2].Type.TypeName = "TimeUuid";
            testClassShape.Properties[6].Type.Properties[3].Type.TypeName = "TimeUuid";
            testClassShape.Properties[6].Type.Properties[3].Type.IsNullable = true;

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
            var db = new TestClassDataBase();
            db.Initialize(objects.Cast<object>().ToArray());
            SampleDataBase.Set<TestClass>(db);
        }

        private void CheckDataBaseContent(params TestClass[] objects)
        {
            SampleDataBase.Get<TestClass>().GetContent().Should().BeEquivalentTo(objects);
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

        private ApiClient client;
        private TypeMetaInformation testClassShape;
        private ISerializer serializer;
        private Fixture fixture;
    }
}