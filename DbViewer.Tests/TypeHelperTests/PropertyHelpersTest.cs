using System;
using System.Collections.Generic;

using FluentAssertions;

using NUnit.Framework;
using NUnit.Framework.Interfaces;

using SkbKontur.DbViewer.DataTypes;
using SkbKontur.DbViewer.Helpers;
using SkbKontur.DbViewer.TestApi;
using SkbKontur.DbViewer.TestApi.Impl;
using SkbKontur.DbViewer.TestApi.Impl.Classes;

namespace SkbKontur.DbViewer.Tests.TypeHelperTests
{
    public class PropertyHelpersTests
    {
        [TestCaseSource(nameof(EnumTestCasesProvider))]
        public void Test_Enum(Type type, TypeMetaInformation expected)
        {
            CheckResult(PropertyHelpers.BuildTypeMetaInformation(null, type, new SamplePropertyDescriptionBuilder(), new CustomPropertyConfigurationProvider()), expected);
        }

        [TestCaseSource(nameof(EnumerableTestCasesProvider))]
        public void Test_Enumerable(Type type, TypeMetaInformation expected)
        {
            CheckResult(PropertyHelpers.BuildTypeMetaInformation(null, type, new SamplePropertyDescriptionBuilder(), new CustomPropertyConfigurationProvider()), expected);
        }

        [TestCaseSource(nameof(PrimitivesTestCasesProvider))]
        public void Test_Primitives(Type type, TypeMetaInformation expected)
        {
            CheckResult(PropertyHelpers.BuildTypeMetaInformation(null, type, new SamplePropertyDescriptionBuilder(), new CustomPropertyConfigurationProvider()), expected);
        }

        private static IEnumerable<ITestCaseData> EnumTestCasesProvider()
        {
            yield return CreateTestCase(typeof(TestEnum), TypeMetaInformation.ForSimpleType("TestEnum"), "Enum");
            yield return CreateTestCase(typeof(TestEnum?), TypeMetaInformation.ForSimpleType("TestEnum", isNullable : true), "NullableEnum");
        }

        private static IEnumerable<ITestCaseData> EnumerableTestCasesProvider()
        {
            yield return CreateTestCase(typeof(string[]),
                                        new TypeMetaInformation
                                            {
                                                TypeName = "String[]",
                                                IsArray = true,
                                                Properties = new PropertyMetaInformation[0],
                                                GenericTypeArguments = new[] {TypeMetaInformation.ForSimpleType("String")}
                                            },
                                        "ArrayOfStrings");

            yield return CreateTestCase(typeof(List<int?>),
                                        new TypeMetaInformation
                                            {
                                                TypeName = "List",
                                                IsArray = true,
                                                Properties = new PropertyMetaInformation[0],
                                                GenericTypeArguments = new[] {TypeMetaInformation.ForSimpleType("Int32", isNullable : true)},
                                            },
                                        "ArrayOfNullableInts");

            yield return CreateTestCase(typeof(HashSet<Guid>),
                                        new TypeMetaInformation
                                            {
                                                TypeName = "HashSet",
                                                IsArray = true,
                                                Properties = new PropertyMetaInformation[0],
                                                GenericTypeArguments = new[] {TypeMetaInformation.ForSimpleType("Guid")},
                                            },
                                        "HashSetOfStrings");

            yield return CreateTestCase(typeof(Dictionary<string, decimal>),
                                        new TypeMetaInformation
                                            {
                                                TypeName = "Dictionary",
                                                IsArray = true,
                                                Properties = new PropertyMetaInformation[0],
                                                GenericTypeArguments = new[] {TypeMetaInformation.ForSimpleType("String"), TypeMetaInformation.ForSimpleType("Decimal")},
                                            },
                                        "Dictionary<string, decimal>");
        }

        private static IEnumerable<ITestCaseData> PrimitivesTestCasesProvider()
        {
            yield return CreateTestCase(typeof(int), TypeMetaInformation.ForSimpleType("Int32"), "Int");
            yield return CreateTestCase(typeof(int?), TypeMetaInformation.ForSimpleType("Int32", isNullable : true), "NullableInt");
            yield return CreateTestCase(typeof(long), TypeMetaInformation.ForSimpleType("Int64"), "Long");
            yield return CreateTestCase(typeof(long?), TypeMetaInformation.ForSimpleType("Int64", isNullable : true), "NullableLong");
            yield return CreateTestCase(typeof(decimal), TypeMetaInformation.ForSimpleType("Decimal"), "Decimal");
            yield return CreateTestCase(typeof(decimal?), TypeMetaInformation.ForSimpleType("Decimal", isNullable : true), "NullableDecimal");
            yield return CreateTestCase(typeof(byte), TypeMetaInformation.ForSimpleType("Byte"), "Byte");
            yield return CreateTestCase(typeof(byte?), TypeMetaInformation.ForSimpleType("Byte", isNullable : true), "NullableByte");
            yield return CreateTestCase(typeof(char), TypeMetaInformation.ForSimpleType("Char"), "Char");
            yield return CreateTestCase(typeof(char?), TypeMetaInformation.ForSimpleType("Char", isNullable : true), "NullableChar");
            yield return CreateTestCase(typeof(bool), TypeMetaInformation.ForSimpleType("Boolean"), "Bool");
            yield return CreateTestCase(typeof(bool?), TypeMetaInformation.ForSimpleType("Boolean", isNullable : true), "NullableBool");
            yield return CreateTestCase(typeof(DateTime), TypeMetaInformation.ForSimpleType("DateTime"), "DateTime");
            yield return CreateTestCase(typeof(DateTime?), TypeMetaInformation.ForSimpleType("DateTime", isNullable : true), "NullableDateTime");
            yield return CreateTestCase(typeof(Guid), TypeMetaInformation.ForSimpleType("Guid"), "Guid");
            yield return CreateTestCase(typeof(Guid?), TypeMetaInformation.ForSimpleType("Guid", isNullable : true), "NullableGuid");
            yield return CreateTestCase(typeof(string), TypeMetaInformation.ForSimpleType("String"), "String");
        }

        private void CheckResult(TypeMetaInformation actual, TypeMetaInformation expected)
        {
            actual.Should().BeEquivalentTo(expected, x => x.RespectingRuntimeTypes());
        }

        private static TestCaseData CreateTestCase(Type type, TypeMetaInformation expected, string testName)
        {
            return new TestCaseData(type, expected) {TestName = testName};
        }
    }
}