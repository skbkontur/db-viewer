using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

using FluentAssertions;

using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

using NUnit.Framework;

using SkbKontur.DbViewer.DataTypes;

namespace SkbKontur.DbViewer.Tests.ApiTests
{
    public class ApiTests
    {
        [OneTimeSetUp]
        public void SetUp()
        {
            client = new ApiClient();
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
            var result = await client.Read("TestClass", new[]
                {
                    new Condition
                        {
                            Operator = ObjectFieldFilterOperator.Equals,
                            Path = "Id",
                            Value = "0",
                        }
                });

            testClassShape.Properties[5].Type = null;
            testClassShape.Properties[6].Type = null;

            result.Meta.TypeMetaInformation.Should().BeEquivalentTo(testClassShape, x => x.Excluding(y => y.Properties[5].Type)
                                                                                          .Excluding(y => y.Properties[6].Type)
                                                                                          .RespectingRuntimeTypes());

            var resultObject = JsonConvert.DeserializeObject<ExpandedTestClass>(((JObject)result.Object).ToString());
            resultObject.Id.Should().Be("0");

            resultObject.Content.String.Should().NotBeNullOrEmpty();
            resultObject.Content.Array.Should().HaveCount(3);

            resultObject.Serialized.Content.String.Should().NotBeNullOrEmpty();
            resultObject.Serialized.Content.List.Should().HaveCount(3);
            resultObject.Serialized.Content.Dictionary.Should().HaveCount(3);
            resultObject.Serialized.Content.HashSet.Should().HaveCount(3);
        }

        [Test]
        public async Task Test_Write()
        {
            var conditions = new[]
                {
                    new Condition
                        {
                            Operator = ObjectFieldFilterOperator.Equals,
                            Path = "Id",
                            Value = "999",
                        },
                };

            var oldObject = (JObject)(await client.Read("TestClass", conditions)).Object;

            var result = await Write("TestClass", new ObjectUpdateRequest
                {
                    Conditions = conditions,
                    Path = new[] {"Content", "String"},
                    Value = "qwer",
                });
            result["Content"]["String"].ToObject<string>().Should().Be("qwer");

            var key = oldObject["Content"]["Dictionary"].ToObject<Dictionary<string, int>>().Keys.First();
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

            oldObject["Content"]["String"] = "qwer";
            oldObject["Content"]["Dictionary"][key] = 12;
            oldObject["Serialized"]["Content"]["List"][0] = 132;
            oldObject["CustomContent"]["LocalTime"] = new DateTime(1, 1, 1, 12, 43, 12, 123, DateTimeKind.Utc);

            result.Should().BeEquivalentTo(oldObject);
        }

        [Test]
        public async Task Test_List()
        {
            var result = await client.GetTypesDescription();
            var schemaDescription = new SchemaDescription
                {
                    SchemaName = "SampleSchema",
                    DownloadLimit = 100_000,
                    DownloadLimitForSuperUser = 100_000,
                    CountLimit = 10_000,
                    CountLimitForSuperUser = 10_000,
                    AllowReadAll = true,
                    AllowDelete = false,
                    AllowEdit = true,
                };
            result.Should().ContainEquivalentOf(new ObjectIdentifier
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

        private ApiClient client;
        private TypeMetaInformation testClassShape;
    }
}