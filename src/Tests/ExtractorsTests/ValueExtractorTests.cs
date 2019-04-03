using System.Collections.Generic;
using FluentAssertions;
using GroBuf;
using GroBuf.DataMembersExtracters;
using Kontur.DBViewer.Core.TypeInformation;
using Kontur.DBViewer.Tests.TestClasses;
using NUnit.Framework;

namespace Kontur.DBViewer.Tests.ExtractorsTests
{
    [TestFixture]
    public class ValueExtractorTests
    {
        [Test]
        public void Test_CustomProperty()
        {
            var serializer = new Serializer(new AllPropertiesExtractor());
            var customPropertyConfigurationProvider = new CustomPropertyConfigurationProvider(serializer);
            var typeInfo =
                TypeInfoExtractor.Extract(typeof(TestClassWithCustomPropertyType), null,
                    customPropertyConfigurationProvider);
            ValueExtractor.ExtractValue(typeInfo, typeof(TestClassWithCustomPropertyType),
                new TestClassWithCustomPropertyType
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

        [Test]
        public void Test_SimpleClassWithNestedObject()
        {
            var typeInfo =
                TypeInfoExtractor.Extract(typeof(TestClass1), null,
                    null);
            ValueExtractor.ExtractValue(typeInfo, typeof(TestClass1), new TestClass1
            {
                NotNullable = TestEnum.FirstValue,
                Nullable = null,
                Nested = new TestClass2
                {
                    String = "asdf",
                    Decimal = 1.5555m,
                }
            }, null).Should().BeEquivalentTo(new Dictionary<string, object>
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
        }
    }
}