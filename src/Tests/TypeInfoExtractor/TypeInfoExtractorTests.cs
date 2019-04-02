using System;
using System.Collections.Generic;
using System.Dynamic;
using FluentAssertions;
using GroBuf;
using GroBuf.DataMembersExtracters;
using Kontur.DBViewer.Core.TypeInformation;
using Kontur.DBViewer.Tests.TypeInfoExtractor.TestClasses;
using NUnit.Framework;
using NUnit.Framework.Interfaces;

namespace Kontur.DBViewer.Tests.TypeInfoExtractor
{
    [TestFixture]
    public class ValueExtractorTests
    {
        [Test]
        public void Test()
        {
            var serializer = new Serializer(new AllPropertiesExtractor());
            var customPropertyConfigurationProvider = new CustomPropertyConfigurationProvider(serializer);
            var typeInfo1 =
                Core.TypeInformation.TypeInfoExtractor.Extract(typeof(TestClass1), null,
                    customPropertyConfigurationProvider);
            ValueExtractor.ExtractValue(typeInfo1, typeof(TestClass1), new TestClass1
            {
                NotNullable = TestEnum.FirstValue,
                Nullable = null,
                Nested = new TestClass2
                {
                    String = "asdf",
                    Decimal = 1.5555m,
                }
            }, customPropertyConfigurationProvider).Should().BeEquivalentTo(new Dictionary<string, object>
            {
                {"NotNullable", TestEnum.FirstValue},
                {"Nullable", null},
                {
                    "Nested", new Dictionary<string, object>
                    {
                        {"String", "asdf"},
                        {"Decimal", 1.5555m}
                    }
                }
            });
            
            var typeInfo2 =
                Core.TypeInformation.TypeInfoExtractor.Extract(typeof(TestClassWithCustomPropertyType), null,
                    customPropertyConfigurationProvider);
            ValueExtractor.ExtractValue(typeInfo2, typeof(TestClassWithCustomPropertyType), new TestClassWithCustomPropertyType
            {
                Property = serializer.Serialize(new TestClass2
                {
                    String = "asdf",
                    Decimal = 1.5555m,
                }),
            }, customPropertyConfigurationProvider).Should().BeEquivalentTo(new Dictionary<string, object>
            {
                {
                    "Property", new Dictionary<string, object>
                    {
                        {"String", "asdf"},
                        {"Decimal", 1.5555m}
                    }
                }
            });
        }
    }

    [TestFixture]
    public class TypeInfoExtractorTests
    {
        [Test]
        public void Test_EndToEnd()
        {
            var enumValues = new[] {"FirstValue", "SecondValue"};
            CheckResult(
                Core.TypeInformation.TypeInfoExtractor.Extract(typeof(TestClass1), new SimplePropertyDescriptionBuilder(), null),
                new ClassTypeInfo
                {
                    Properties = new[]
                    {
                        new Property
                        {
                            TypeInfo = new EnumTypeInfo(false, enumValues),
                            Description = new PropertyDescription
                            {
                                Name = "NotNullable",
                            },
                        },
                        new Property
                        {
                            TypeInfo = new EnumTypeInfo(true, enumValues),
                            Description = new PropertyDescription
                            {
                                Name = "Nullable",
                            },
                        },
                        new Property
                        {
                            TypeInfo = new ClassTypeInfo
                            {
                                Properties = new[]
                                {
                                    new Property
                                    {
                                        TypeInfo = new StringTypeInfo(),
                                        Description = new PropertyDescription
                                        {
                                            Name = "String",
                                        },
                                    },
                                    new Property
                                    {
                                        TypeInfo = new DecimalTypeInfo(false),
                                        Description = new PropertyDescription
                                        {
                                            Name = "Decimal",
                                        },
                                    },
                                }
                            },
                            Description = new PropertyDescription
                            {
                                Name = "Nested",
                            },
                        }
                    }
                });
        }

        [TestCaseSource(nameof(EnumTestCasesProvider))]
        public void Test_Enum(Type type, TypeInfo expected)
        {
            CheckResult(Core.TypeInformation.TypeInfoExtractor.Extract(type, new SimplePropertyDescriptionBuilder(), null), expected);
        }

        [TestCaseSource(nameof(EnumerableTestCasesProvider))]
        public void Test_Enumerable(Type type, TypeInfo expected)
        {
            CheckResult(Core.TypeInformation.TypeInfoExtractor.Extract(type, new SimplePropertyDescriptionBuilder(), null), expected);
        }

        [TestCaseSource(nameof(PrimitivesTestCasesProvider))]
        public void Test_Primitives(Type type, TypeInfo expected)
        {
            CheckResult(Core.TypeInformation.TypeInfoExtractor.Extract(type, new SimplePropertyDescriptionBuilder(), null), expected);
        }

        [Test]
        public void Test_CustomPropertyTypeResolver()
        {
            CheckResult(
                Core.TypeInformation.TypeInfoExtractor.Extract(typeof(TestClassWithCustomPropertyType), new SimplePropertyDescriptionBuilder(), new CustomPropertyConfigurationProvider(new Serializer(new AllPropertiesExtractor()))),
                new ClassTypeInfo
                {
                    Properties = new[]
                    {
                        new Property
                        {
                            TypeInfo = new ClassTypeInfo
                            {
                                Properties = new[]
                                {
                                    new Property
                                    {
                                        TypeInfo = new StringTypeInfo(),
                                        Description = new PropertyDescription
                                        {
                                            Name = "String",
                                        },
                                    },
                                    new Property
                                    {
                                        TypeInfo = new DecimalTypeInfo(false),
                                        Description = new PropertyDescription
                                        {
                                            Name = "Decimal",
                                        },
                                    },
                                }
                            },
                            Description = new PropertyDescription
                            {
                                Name = "Property",
                            },
                        }
                    }
                }
            );
        }

        private static IEnumerable<ITestCaseData> EnumTestCasesProvider()
        {
            var enumValues = new[] {"FirstValue", "SecondValue"};
            yield return CreateTestCase(typeof(TestEnum), new EnumTypeInfo(false, enumValues), "Enum");
            yield return CreateTestCase(typeof(TestEnum?), new EnumTypeInfo(true, enumValues), "NullableEnum");
        }

        private static IEnumerable<ITestCaseData> EnumerableTestCasesProvider()
        {
            yield return CreateTestCase(typeof(string[]), new EnumerableTypeInfo(new StringTypeInfo()),
                "ArrayOfStrings");
            yield return CreateTestCase(typeof(List<int?>), new EnumerableTypeInfo(new IntTypeInfo(true)),
                "ArrayOfNullableInts");
            yield return CreateTestCase(typeof(HashSet<Guid>), new HashSetTypeInfo(new StringTypeInfo()),
                "HashSetOfStrings");
            yield return CreateTestCase(
                typeof(Dictionary<string, decimal>),
                new DictionaryTypeInfo(new StringTypeInfo(), new DecimalTypeInfo(false)), "Dictionary<string, decimal>"
            );
        }

        private static IEnumerable<ITestCaseData> PrimitivesTestCasesProvider()
        {
            yield return CreateTestCase(typeof(int), new IntTypeInfo(false), "Int");
            yield return CreateTestCase(typeof(int?), new IntTypeInfo(true), "NullableInt");
            yield return CreateTestCase(typeof(long), new LongTypeInfo(false), "Long");
            yield return CreateTestCase(typeof(long?), new LongTypeInfo(true), "NullableLong");
            yield return CreateTestCase(typeof(decimal), new DecimalTypeInfo(false), "Decimal");
            yield return CreateTestCase(typeof(decimal?), new DecimalTypeInfo(true), "NullableDecimal");
            yield return CreateTestCase(typeof(byte), new ByteTypeInfo(false), "Byte");
            yield return CreateTestCase(typeof(byte?), new ByteTypeInfo(true), "NullableByte");
            yield return CreateTestCase(typeof(char), new CharTypeInfo(false), "Char");
            yield return CreateTestCase(typeof(char?), new CharTypeInfo(true), "NullableChar");
            yield return CreateTestCase(typeof(bool), new BoolTypeInfo(false), "Bool");
            yield return CreateTestCase(typeof(bool?), new BoolTypeInfo(true), "NullableBool");
            yield return CreateTestCase(typeof(DateTime), new DateTimeTypeInfo(false), "DateTime");
            yield return CreateTestCase(typeof(DateTime?), new DateTimeTypeInfo(true), "NullableDateTime");
            yield return CreateTestCase(typeof(Guid), new StringTypeInfo(), "Guid");
            yield return CreateTestCase(typeof(Guid?), new StringTypeInfo(), "NullableGuid");
            yield return CreateTestCase(typeof(string), new StringTypeInfo(), "String");
        }

        private void CheckResult(TypeInfo actual, TypeInfo expected)
        {
            actual.Should().BeEquivalentTo(expected, x => x.RespectingRuntimeTypes());
        }

        private static TestCaseData CreateTestCase(Type type, TypeInfo expected, string testName)
        {
            return new TestCaseData(type, expected)
            {
                TestName = testName,
            };
        }
    }
}