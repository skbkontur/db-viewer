using System;
using System.Collections.Generic;

using Cassandra;

using FluentAssertions;

using GroBuf;
using GroBuf.DataMembersExtracters;

using NUnit.Framework;

using SkbKontur.DbViewer.Helpers;
using SkbKontur.DbViewer.TestApi.Controllers;
using SkbKontur.DbViewer.TestApi.Cql;
using SkbKontur.DbViewer.TestApi.Impl;
using SkbKontur.DbViewer.TestApi.Impl.Classes;

namespace SkbKontur.DbViewer.Tests.TypeHelperTests
{
    public class ObjectPropertyEditorTests
    {
        [Test]
        public void TestBuiltinTypes()
        {
            var obj = new CqlDocumentMeta
                {
                    FromId = "abc",
                    ToId = "def",
                    IsLargeDocument = false,
                    ShardNumber = 3,
                    DocumentPrice = 10,
                    DocumentLength = 100,
                    DocumentSendTime = DateTimeOffset.UtcNow,
                    DocumentTags = new[] {"a", "b"},
                    DocumentValues = new Dictionary<string, string>
                        {
                            {"key", "value"},
                            {"key2", "value2"},
                            {"complex.key", "val"},
                        },
                };

            var provider = new CustomPropertyConfigurationProvider();

            ObjectPropertyEditor.SetValue(obj, new[] {"FromId"}, "abc2", provider);
            obj.FromId.Should().Be("abc2");

            ObjectPropertyEditor.SetValue(obj, new[] {"IsLargeDocument"}, "true", provider);
            obj.IsLargeDocument.Should().BeTrue();

            ObjectPropertyEditor.SetValue(obj, new[] {"ShardNumber"}, "2", provider);
            obj.ShardNumber.Should().Be(2);

            ObjectPropertyEditor.SetValue(obj, new[] {"DocumentLength"}, "1000", provider);
            obj.DocumentLength.Should().Be(1000);

            ObjectPropertyEditor.SetValue(obj, new[] {"DocumentPrice"}, "100", provider);
            obj.DocumentPrice.Should().Be(100m);

            ObjectPropertyEditor.SetValue(obj, new[] {"DocumentSendTime"}, "2014-12-12", provider);
            obj.DocumentSendTime.Should().Be(new DateTimeOffset(2014, 12, 12, 0, 0, 0, TimeSpan.Zero));

            ObjectPropertyEditor.SetValue(obj, new[] {"DocumentTags", "0"}, "10", provider);
            obj.DocumentTags[0].Should().Be("10");

            ObjectPropertyEditor.SetValue(obj, new[] {"DocumentValues", "key2"}, "qwer", provider);
            obj.DocumentValues["key2"].Should().Be("qwer");

            ObjectPropertyEditor.SetValue(obj, new[] {"DocumentValues", "complex.key"}, "ty243", provider);
            obj.DocumentValues["complex.key"].Should().Be("ty243");
        }

        [Test]
        public void TestCustomTypes()
        {
            var meta = new DocumentBindingsMeta
                {
                    DocumentDate = new LocalDate(2014, 12, 13),
                    DocumentTime = new LocalTime(12, 12, 13, 0),
                    DocumentCirculationId = TimeUuid.NewId(),
                };

            var provider = new CustomPropertyConfigurationProvider();

            ObjectPropertyEditor.SetValue(meta, new[] {"DocumentDate"}, "2018-08-09T00:00:00.000Z", provider);
            meta.DocumentDate.Should().Be(new LocalDate(2018, 08, 09));

            ObjectPropertyEditor.SetValue(meta, new[] {"DocumentTime"}, "0001-01-01T14:15:18.342Z", provider);
            meta.DocumentTime.Should().Be(new LocalTime(14, 15, 18, 342_000_000));

            var timeUuid = TimeUuid.NewId();
            ObjectPropertyEditor.SetValue(meta, new[] {"DocumentCirculationId"}, timeUuid.ToString(), provider);
            meta.DocumentCirculationId.Should().Be(timeUuid);
        }

        [Test]
        public void TestSerializedTypes()
        {
            var serializer = new Serializer(new AllPropertiesExtractor());
            var data = new TestClass
                {
                    Serialized = serializer.Serialize(new ClassForSerialization
                        {
                            Content = new TestClassWithAllPrimitives
                                {
                                    String = "abc",
                                }
                        })
                };

            ObjectPropertyEditor.SetValue(data, new[] {"Serialized", "Content", "String"}, "def", new SampleCustomPropertyConfigurationProvider());
            serializer.Deserialize<ClassForSerialization>(data.Serialized).Content.String.Should().Be("def");
        }
    }
}