using System;
using System.Linq.Expressions;

using FluentAssertions;

using NUnit.Framework;
using NUnit.Framework.Constraints;

using SkbKontur.DbViewer.Helpers;

namespace SkbKontur.DbViewer.Tests.TypeHelperTests
{
    public class ObjectParserTests
    {
        [Test]
        public void TestParseInt()
        {
            var type = typeof(int);

            Assert.That(ObjectParser.Parse(type, "2"), Is.EqualTo(2));
            Assert.That(ObjectParser.Parse(type, "0"), Is.EqualTo(0));
            Assert.That(ObjectParser.Parse(type, "-1"), Is.EqualTo(-1));
            Assert.That(ObjectParser.Parse(type, "-2147483648"), Is.EqualTo(-2147483648));
            Assert.That(ObjectParser.Parse(type, "2147483647"), Is.EqualTo(2147483647));

            Assert.Throws<OverflowException>(() => ObjectParser.Parse(type, "-2147483649"));
            Assert.Throws<OverflowException>(() => ObjectParser.Parse(type, "2147483648"));
            Assert.Throws<FormatException>(() => ObjectParser.Parse(type, "xxx"));
            Assert.Throws<FormatException>(() => ObjectParser.Parse(type, "19.0"));
            Assert.Throws<FormatException>(() => ObjectParser.Parse(type, "19."));
            Assert.Throws<ArgumentNullException>(() => ObjectParser.Parse(type, null));
        }

        [Test]
        public void TestParseByte()
        {
            var type = typeof(byte);

            Assert.That(ObjectParser.Parse(type, "2"), Is.EqualTo(2));
            Assert.That(ObjectParser.Parse(type, "0"), Is.EqualTo(0));
            Assert.That(ObjectParser.Parse(type, "255"), Is.EqualTo(255));

            Assert.Throws<OverflowException>(() => ObjectParser.Parse(type, "-1"));
            Assert.Throws<OverflowException>(() => ObjectParser.Parse(type, "256"));
            Assert.Throws<FormatException>(() => ObjectParser.Parse(type, "xxx"));
            Assert.Throws<FormatException>(() => ObjectParser.Parse(type, "19.0"));
            Assert.Throws<FormatException>(() => ObjectParser.Parse(type, "19."));
            Assert.Throws<ArgumentNullException>(() => ObjectParser.Parse(type, null));
        }

        [Test]
        public void TestParseLong()
        {
            var type = typeof(long);
            Assert.That(ObjectParser.Parse(type, "2"), Is.EqualTo(2));
            Assert.That(ObjectParser.Parse(type, "0"), Is.EqualTo(0));
            Assert.That(ObjectParser.Parse(type, "9223372036854775807"), Is.EqualTo(9223372036854775807L));
            Assert.That(ObjectParser.Parse(type, "-9223372036854775808"), Is.EqualTo(-9223372036854775808L));

            Assert.Throws<OverflowException>(() => ObjectParser.Parse(type, "9223372036854775808"));
            Assert.Throws<OverflowException>(() => ObjectParser.Parse(type, "-9223372036854775809"));
            Assert.Throws<FormatException>(() => ObjectParser.Parse(type, "19.0"));
            Assert.Throws<FormatException>(() => ObjectParser.Parse(type, "19."));
            Assert.Throws<ArgumentNullException>(() => ObjectParser.Parse(type, null));
        }

        [Test]
        public void TestParseString()
        {
            var type = typeof(string);
            Assert.That(ObjectParser.Parse(type, "a"), Is.EqualTo("a"));
            Assert.That(ObjectParser.Parse(type, "TestParseString"), Is.EqualTo("TestParseString"));
            Assert.That(ObjectParser.Parse(type, ""), Is.EqualTo(""));
            Assert.That(ObjectParser.Parse(type, null), Is.EqualTo(null));
        }

        [Test]
        public void TestParseBool()
        {
            var type = typeof(bool);

            Assert.That(ObjectParser.Parse(type, "true"), Is.EqualTo(true));
            Assert.That(ObjectParser.Parse(type, "True"), Is.EqualTo(true));
            Assert.That(ObjectParser.Parse(type, "false"), Is.EqualTo(false));
            Assert.That(ObjectParser.Parse(type, "False"), Is.EqualTo(false));

            Assert.Throws<FormatException>(() => ObjectParser.Parse(type, "фалс"));
            Assert.Throws<FormatException>(() => ObjectParser.Parse(type, "1"));
            Assert.Throws<FormatException>(() => ObjectParser.Parse(type, "0"));
            Assert.Throws<FormatException>(() => ObjectParser.Parse(type, ""));
            Assert.Throws<ArgumentNullException>(() => ObjectParser.Parse(type, null));
        }

        [Test]
        public void TestParseGuid()
        {
            var type = typeof(Guid);

            Assert.That(ObjectParser.Parse(type, "4552F34E-0164-429E-8B1C-22E69254D556"), Is.EqualTo(new Guid("4552F34E-0164-429E-8B1C-22E69254D556")));
            Assert.That(ObjectParser.Parse(type, "{15B8BBF5-3E61-4D41-B6C8-F36AEB822F02}"), Is.EqualTo(new Guid("{15B8BBF5-3E61-4D41-B6C8-F36AEB822F02}")));
            Assert.That(ObjectParser.Parse(type, "5D26A5040B1440548C1AE5CC4F56BC0F"), Is.EqualTo(new Guid("5D26A5040B1440548C1AE5CC4F56BC0F")));
            Assert.That(ObjectParser.Parse(type, "1c5652cf-c9c4-4e6c-b2f7-dec3fbce09fd"), Is.EqualTo(new Guid("1c5652cf-c9c4-4e6c-b2f7-dec3fbce09fd")));
            Assert.That(ObjectParser.Parse(type, "{3127fa5d-6a89-4fa3-8686-0696fb30eea5}"), Is.EqualTo(new Guid("{3127fa5d-6a89-4fa3-8686-0696fb30eea5}")));
            Assert.That(ObjectParser.Parse(type, "b39552405bdb4b08868578cf77f1ca8d"), Is.EqualTo(new Guid("b39552405bdb4b08868578cf77f1ca8d")));

            Assert.Throws<FormatException>(() => ObjectParser.Parse(type, ""));
            Assert.Throws<ArgumentNullException>(() => ObjectParser.Parse(type, null));
        }

        [Test]
        public void TestParseDouble()
        {
            var type = typeof(double);
            Assert.That(ObjectParser.Parse(type, "1.1"), Is.EqualTo(1.1));
            Assert.That(ObjectParser.Parse(type, "0.999"), Is.EqualTo(0.999));
            Assert.That(ObjectParser.Parse(type, "-345345.435"), Is.EqualTo(-345345.435));
            Assert.That(ObjectParser.Parse(type, "1,1"), Is.EqualTo(11));

            Assert.Throws<ArgumentNullException>(() => ObjectParser.Parse(type, null));
        }

        [Test]
        public void TestParseFloat()
        {
            var type = typeof(float);
            Assert.That(ObjectParser.Parse(type, "1.1"), ApproximatelyEqualTo(1.1));
            Assert.That(ObjectParser.Parse(type, "0.999"), ApproximatelyEqualTo(0.999));
            Assert.That(ObjectParser.Parse(type, "-3545.435"), ApproximatelyEqualTo(-3545.435, 1e-2));
            Assert.That(ObjectParser.Parse(type, "1,1"), ApproximatelyEqualTo(11));

            Assert.Throws<ArgumentNullException>(() => ObjectParser.Parse(type, null));
        }

        [Test]
        public void TestParseEnum()
        {
            ObjectParser.Parse(typeof(ExpressionType), "Dynamic").Should().Be(ExpressionType.Dynamic);
            ObjectParser.Parse(typeof(ExpressionType), "42").Should().Be(ExpressionType.Subtract);

            ObjectParser.Parse(typeof(OurEnum), "1").Should().Be(OurEnum.One);
            ObjectParser.Parse(typeof(OurEnum), "3").Should().Be((OurEnum)3);
            ObjectParser.Parse(typeof(OurEnum), "11").Should().Be((OurEnum)11);
            ObjectParser.Parse(typeof(OurEnum), "-1").Should().Be((OurEnum)(-1));

            Assert.Throws<ArgumentException>(() => ObjectParser.Parse(typeof(ExpressionType), "dynamic"));
            Assert.Throws<ArgumentException>(() => ObjectParser.Parse(typeof(ExpressionType), "xyu"));
            Assert.Throws<ArgumentException>(() => ObjectParser.Parse(typeof(ExpressionType), ""));
            Assert.Throws<ArgumentNullException>(() => ObjectParser.Parse(typeof(ExpressionType), null));
        }

        [Test]
        public void TestParseNullableInt()
        {
            var type = typeof(int?);
            ObjectParser.Parse(type, null).Should().BeNull();
            ObjectParser.Parse(type, "2").Should().Be(2);

            Assert.Throws<FormatException>(() => ObjectParser.Parse(type, "19.0"));
        }

        [Test]
        public void TestParseNullableEnum()
        {
            ObjectParser.Parse(typeof(ExpressionType?), "").Should().BeNull();
            ObjectParser.Parse(typeof(ExpressionType?), null).Should().BeNull();

            ObjectParser.Parse(typeof(ExpressionType?), "Dynamic").Should().Be(ExpressionType.Dynamic);

            Assert.Throws<ArgumentException>(() => ObjectParser.Parse(typeof(ExpressionType?), "xyu"));
        }

        [Test]
        public void TestParseDateTime()
        {
            ObjectParser.Parse(typeof(DateTime), "635488416000000000").Should().Be(new DateTime(2014, 10, 14, 0, 0, 0, 0, DateTimeKind.Utc));
            ObjectParser.Parse(typeof(DateTime), "2014-10-14T12:11:00.0000000Z").Should().Be(new DateTime(2014, 10, 14, 12, 11, 0, 0, DateTimeKind.Utc));
            ObjectParser.Parse(typeof(DateTime), "2014-10-14T12:11:00.0000000").Should().Be(new DateTime(2014, 10, 14, 12, 11, 0, 0, DateTimeKind.Utc));
            ObjectParser.Parse(typeof(DateTime), "2014-10-15T13:12:00.00000Z").Should().Be(new DateTime(2014, 10, 15, 13, 12, 0, 0, DateTimeKind.Utc));
            ObjectParser.Parse(typeof(DateTime), "2014-10-15T13:12:00.00000").Should().Be(new DateTime(2014, 10, 15, 13, 12, 0, 0, DateTimeKind.Utc));
            ObjectParser.Parse(typeof(DateTime), "2014-10-16T14:13:00.000Z").Should().Be(new DateTime(2014, 10, 16, 14, 13, 0, 0, DateTimeKind.Utc));
            ObjectParser.Parse(typeof(DateTime), "2014-10-16T14:13:00.000").Should().Be(new DateTime(2014, 10, 16, 14, 13, 0, 0, DateTimeKind.Utc));
            ObjectParser.Parse(typeof(DateTime), "2014-10-16T14:13:00").Should().Be(new DateTime(2014, 10, 16, 14, 13, 0, 0, DateTimeKind.Utc));

            Assert.Throws<FormatException>(() => ObjectParser.Parse(typeof(DateTime), "2014-10-14"));
            Assert.Throws<FormatException>(() => ObjectParser.Parse(typeof(DateTime), "14.10.2014"));
            Assert.Throws<FormatException>(() => ObjectParser.Parse(typeof(DateTime), "14.10.2014"));
            Assert.Throws<FormatException>(() => ObjectParser.Parse(typeof(DateTime), "14.10.2014 10:10:10.000"));
            Assert.Throws<FormatException>(() => ObjectParser.Parse(typeof(DateTime), "14.10.2014 10:10:10"));
            Assert.Throws<FormatException>(() => ObjectParser.Parse(typeof(DateTime), "14.10.2014 10:10"));
            Assert.Throws<FormatException>(() => ObjectParser.Parse(typeof(DateTime), "2014-10-14 10:10:10.000"));
            Assert.Throws<FormatException>(() => ObjectParser.Parse(typeof(DateTime), "2014-10-14 10:10:10"));
            Assert.Throws<FormatException>(() => ObjectParser.Parse(typeof(DateTime), "2014-10-14 10:10"));
            Assert.Throws<FormatException>(() => ObjectParser.Parse(typeof(DateTime), "14 октября 2014"));
            Assert.Throws<FormatException>(() => ObjectParser.Parse(typeof(DateTime), "5 февраля 2013"));
            Assert.Throws<FormatException>(() => ObjectParser.Parse(typeof(DateTime), "14.10.2014 34"));
            Assert.Throws<FormatException>(() => ObjectParser.Parse(typeof(DateTime), "48.10.2014"));
            Assert.Throws<FormatException>(() => ObjectParser.Parse(typeof(DateTime), "29.02.2014"));
            Assert.Throws<FormatException>(() => ObjectParser.Parse(typeof(DateTime), "2014-31-03"));
            Assert.Throws<FormatException>(() => ObjectParser.Parse(typeof(DateTime), "дата"));
        }

        [Test]
        public void TestParseNullableDateTime()
        {
            ObjectParser.Parse(typeof(DateTime?), "").Should().BeNull();
            ObjectParser.Parse(typeof(DateTime?), null).Should().BeNull();

            ObjectParser.Parse(typeof(DateTime?), "2014-10-16T14:13:00").Should().Be(new DateTime(2014, 10, 16, 14, 13, 0, 0, DateTimeKind.Utc));

            Assert.Throws<FormatException>(() => ObjectParser.Parse(typeof(DateTime?), "2014-10-14"));
        }

        private static ComparisonConstraint ApproximatelyEqualTo(double value, double accuracy = 1e-6)
        {
            return Is.GreaterThan(value - accuracy).And.LessThan(value + accuracy);
        }
    }

    public enum OurEnum
    {
        One = 1,
        Two = 2,
        Ten = 10
    }
}