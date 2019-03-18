using System;
using System.Collections.Generic;

using FluentAssertions;
using FluentAssertions.Equivalency;

using Kontur.DBViewer.Core.TypeInformation;
using Kontur.DBViewer.Tests.TestClasses;

using NUnit.Framework;

namespace Kontur.DBViewer.Tests
{
    [TestFixture]
    public class FieldInfoExtractorTests
    {
        [Test]
        public void Test_EndToEnd()
        {
            var enumValues = new[] {"FirstValue", "SecondValue"};
            FieldInfoExtractor.Extract(typeof(TestClass1), (info, type) => null)
                              .Should().BeEquivalentTo(new ClassFieldInfo
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
                                  }, x => x.RespectingRuntimeTypes());
        }

        [Test]
        public void Test_Enum()
        {
            var enumValues = new[] {"FirstValue", "SecondValue"};
            FieldInfoExtractor.Extract(typeof(TestEnum), (info, type) => null).Should()
                              .BeEquivalentTo(new EnumFieldInfo(false, enumValues, null), x => x.RespectingRuntimeTypes());
            FieldInfoExtractor.Extract(typeof(TestEnum?), (info, type) => null).Should()
                              .BeEquivalentTo(new EnumFieldInfo(true, enumValues, null), x => x.RespectingRuntimeTypes());
        }

        [Test]
        public void Test_Enumerable_NestedEnumerable_Complex()
        {
            FieldInfoExtractor.Extract(typeof(List<TestClass2[]>[]), (info, type) => null).Should().BeEquivalentTo(
                new EnumerableFieldInfo(
                    new EnumerableFieldInfo(
                        new EnumerableFieldInfo(
                            new ClassFieldInfo
                                {
                                    Fields = new Dictionary<string, FieldInfo>
                                        {
                                            {"String", new StringFieldInfo(null)},
                                            {"Decimal", new DecimalFieldInfo(false, null)},
                                        }
                                }
                        )
                    )
                ), x => x.RespectingRuntimeTypes()
            );
        }

        [Test]
        public void Test_Enumerable_Primitive()
        {
            FieldInfoExtractor.Extract(typeof(string[]), (info, type) => null).Should()
                              .BeEquivalentTo(new EnumerableFieldInfo(new StringFieldInfo(null)), x => x.RespectingRuntimeTypes());
            FieldInfoExtractor.Extract(typeof(List<int?>), (info, type) => null).Should()
                              .BeEquivalentTo(new EnumerableFieldInfo(new IntFieldInfo(true, null)), x => x.RespectingRuntimeTypes());
        }

        [Test]
        public void Test_Primitives()
        {
            FieldInfoExtractor.Extract(typeof(int), (info, type) => null).Should()
                              .BeEquivalentTo(new IntFieldInfo(false, null), x => x.RespectingRuntimeTypes());
            FieldInfoExtractor.Extract(typeof(int?), (info, type) => null).Should()
                              .BeEquivalentTo(new IntFieldInfo(true, null), x => x.RespectingRuntimeTypes());
            FieldInfoExtractor.Extract(typeof(long), (info, type) => null).Should()
                              .BeEquivalentTo(new LongFieldInfo(false, null), x => x.RespectingRuntimeTypes());
            FieldInfoExtractor.Extract(typeof(long?), (info, type) => null).Should()
                              .BeEquivalentTo(new LongFieldInfo(true, null), x => x.RespectingRuntimeTypes());
            FieldInfoExtractor.Extract(typeof(decimal), (info, type) => null).Should()
                              .BeEquivalentTo(new DecimalFieldInfo(false, null), x => x.RespectingRuntimeTypes());
            FieldInfoExtractor.Extract(typeof(decimal?), (info, type) => null).Should()
                              .BeEquivalentTo(new DecimalFieldInfo(true, null), x => x.RespectingRuntimeTypes());
            FieldInfoExtractor.Extract(typeof(bool), (info, type) => null).Should()
                              .BeEquivalentTo(new BoolFieldInfo(false, null), x => x.RespectingRuntimeTypes());
            FieldInfoExtractor.Extract(typeof(bool?), (info, type) => null).Should()
                              .BeEquivalentTo(new BoolFieldInfo(true, null), x => x.RespectingRuntimeTypes());
            FieldInfoExtractor.Extract(typeof(DateTime), (info, type) => null).Should()
                              .BeEquivalentTo(new DateTimeFieldInfo(false, null), x => x.RespectingRuntimeTypes());
            FieldInfoExtractor.Extract(typeof(DateTime?), (info, type) => null).Should()
                              .BeEquivalentTo(new DateTimeFieldInfo(true, null), x => x.RespectingRuntimeTypes());
            FieldInfoExtractor.Extract(typeof(string), (info, type) => null).Should()
                              .BeEquivalentTo(new StringFieldInfo(null), x => x.RespectingRuntimeTypes());
        }
    }
}