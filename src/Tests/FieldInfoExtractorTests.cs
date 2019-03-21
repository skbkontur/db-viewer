using System;
using System.Collections.Generic;

using FluentAssertions;

using Kontur.DBViewer.Core.TypeInformation;
using Kontur.DBViewer.Tests.TestClasses;

using NUnit.Framework;
using NUnit.Framework.Interfaces;

namespace Kontur.DBViewer.Tests
{
    [TestFixture]
    public class FieldInfoExtractorTests
    {
        [Test]
        public void Test_EndToEnd()
        {
            var enumValues = new[] {"FirstValue", "SecondValue"};
            CheckResult(
                FieldInfoExtractor.Extract(typeof(TestClass1), (info, type) => null),
                new ClassFieldInfo
                    {
                        Fields = new Dictionary<string, FieldInfo>
                            {
                                {
                                    "NotNullable",
                                    new EnumFieldInfo(false, enumValues, null)
                                },
                                {
                                    "Nullable",
                                    new EnumFieldInfo(true, enumValues, null)
                                },
                                {
                                    "Nested",
                                    new ClassFieldInfo
                                        {
                                            Fields = new Dictionary<string, FieldInfo>
                                                {
                                                    {"String", new StringFieldInfo(null)},
                                                    {"Decimal", new DecimalFieldInfo(false, null)}
                                                }
                                        }
                                }
                            }
                    });
        }

        [TestCaseSource(nameof(EnumTestCasesProvider))]
        public void Test_Enum(Type type, FieldInfo expected)
        {
            CheckResult(FieldInfoExtractor.Extract(type, (i, t) => null), expected);
        }

        [TestCaseSource(nameof(EnumerableTestCasesProvider))]
        public void Test_Enumerable(Type type, FieldInfo expected)
        {
            CheckResult(FieldInfoExtractor.Extract(type, (i, t) => null), expected);
        }

        [TestCaseSource(nameof(PrimitivesTestCasesProvider))]
        public void Test_Primitives(Type type, FieldInfo expected)
        {
            CheckResult(FieldInfoExtractor.Extract(type, (i, t) => null), expected);
        }

        private static IEnumerable<ITestCaseData> EnumTestCasesProvider()
        {
            var enumValues = new[] {"FirstValue", "SecondValue"};
            yield return CreateTestCase(typeof(TestEnum), new EnumFieldInfo(false, enumValues, null), "Enum");
            yield return CreateTestCase(typeof(TestEnum?), new EnumFieldInfo(true, enumValues, null), "NullableEnum");
        }

        private static IEnumerable<ITestCaseData> EnumerableTestCasesProvider()
        {
            yield return CreateTestCase(typeof(string[]), new EnumerableFieldInfo(new StringFieldInfo(null)), "ArrayOfStrings");
            yield return CreateTestCase(typeof(List<int?>), new EnumerableFieldInfo(new IntFieldInfo(true, null)), "ArrayOfNullableInts");
            yield return CreateTestCase(typeof(HashSet<Guid>), new HashSetFieldInfo(new StringFieldInfo(null)), "HashSetOfStrings");
            yield return CreateTestCase(
                typeof(Dictionary<string, decimal>),
                new DictionaryFieldInfo(new StringFieldInfo(null), new DecimalFieldInfo(false, null)), "Dictionary<string, decimal>"
            );
        }

        private static IEnumerable<ITestCaseData> PrimitivesTestCasesProvider()
        {
            yield return CreateTestCase(typeof(int), new IntFieldInfo(false, null), "Int");
            yield return CreateTestCase(typeof(int?), new IntFieldInfo(true, null), "NullableInt");
            yield return CreateTestCase(typeof(long), new LongFieldInfo(false, null), "Long");
            yield return CreateTestCase(typeof(long?), new LongFieldInfo(true, null), "NullableLong");
            yield return CreateTestCase(typeof(decimal), new DecimalFieldInfo(false, null), "Decimal");
            yield return CreateTestCase(typeof(decimal?), new DecimalFieldInfo(true, null), "NullableDecimal");
            yield return CreateTestCase(typeof(byte), new ByteFieldInfo(false, null), "Byte");
            yield return CreateTestCase(typeof(byte?), new ByteFieldInfo(true, null), "NullableByte");
            yield return CreateTestCase(typeof(char), new CharFieldInfo(false, null), "Char");
            yield return CreateTestCase(typeof(char?), new CharFieldInfo(true, null), "NullableChar");
            yield return CreateTestCase(typeof(bool), new BoolFieldInfo(false, null), "Bool");
            yield return CreateTestCase(typeof(bool?), new BoolFieldInfo(true, null), "NullableBool");
            yield return CreateTestCase(typeof(DateTime), new DateTimeFieldInfo(false, null), "DateTime");
            yield return CreateTestCase(typeof(DateTime?), new DateTimeFieldInfo(true, null), "NullableDateTime");
            yield return CreateTestCase(typeof(Guid), new StringFieldInfo(null), "Guid");
            yield return CreateTestCase(typeof(Guid?), new StringFieldInfo(null), "NullableGuid");
            yield return CreateTestCase(typeof(string), new StringFieldInfo(null), "String");
        }

        private void CheckResult(FieldInfo actual, FieldInfo expected)
        {
            actual.Should().BeEquivalentTo(expected, x => x.RespectingRuntimeTypes());
        }

        private static TestCaseData CreateTestCase(Type type, FieldInfo expected, string testName)
        {
            return new TestCaseData(type, expected)
                {
                    TestName = testName,
                };
        }
    }
}