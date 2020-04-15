using System;
using System.Linq;
using System.Linq.Expressions;
using System.Reflection;
using System.Text;

using AutoFixture;

using GroBuf;
using GroBuf.DataMembersExtracters;

using SkbKontur.DbViewer.DataTypes;
using SkbKontur.DbViewer.TestApi.Impl.Attributes;
using SkbKontur.DbViewer.TestApi.Impl.Classes;
using SkbKontur.DbViewer.TestApi.Impl.Utils;

namespace SkbKontur.DbViewer.TestApi.Impl
{
    public class SampleDataBase
    {
        public SampleDataBase()
        {
            var serializer = new Serializer(new AllPropertiesExtractor());
            var fixture = new Fixture();
            data = Enumerable.Range(0, 1000).Select(
                _ => fixture.Build<TestClass>()
                            .With(x => x.Serialized, serializer.Serialize(fixture.Create<ClassForSerialization>()))
                            .Create()
            ).ToArray();
            FillDifficultSerialized(serializer);
        }

        public SampleDataBase(TestClass[] data)
        {
            this.data = data;
        }

        private void FillDifficultSerialized(ISerializer serializer)
        {
            var random = new Random();
            foreach (var testClass in data)
            {
                testClass.File = Encoding.UTF8.GetBytes(string.Join(",", GetRandomBytes(random)));
                if (random.Next(0, 2) == 0)
                {
                    testClass.DifficultEnum = DifficultEnum.A;
                    testClass.DifficultSerialized = serializer.Serialize(new A {Int = random.Next()});
                }
                else
                {
                    testClass.DifficultEnum = DifficultEnum.B;
                    testClass.DifficultSerialized = serializer.Serialize(new B {String = Convert.ToBase64String(GetRandomBytes(random))});
                }
            }
        }

        private static byte[] GetRandomBytes(Random random)
        {
            var b = new byte[100];
            random.NextBytes(b);
            return b;
        }

        public static SampleDataBase Instance
        {
            get
            {
                if (instance == null)
                    lock (lockObject)
                        if (instance == null)
                            instance = new SampleDataBase();
                return instance;
            }
            set => instance = value;
        }

        public TestClass[] Find(Condition[] filters, Sort[] sorts, int from, int count)
        {
            var result = data.Where(BuildCriterion(filters)).Skip(from).Take(count);
            return result.ToArray();
        }

        private Func<TestClass, bool> BuildCriterion(Condition[] filters)
        {
            return ((Expression<Func<TestClass, bool>>)CriterionHelper.BuildCriterion(typeof(TestClass), filters))
                .Compile();
        }

        public int? Count(Condition[] filters, int? limit)
        {
            return Math.Min(limit ?? 0, data.Count(BuildCriterion(filters)));
        }

        public object Read(Condition[] filters)
        {
            return data.Single(BuildCriterion(filters));
        }

        public void Delete(Condition[] filters)
        {
            var f = BuildCriterion(filters);
            data = data.Where(x => !f(x)).ToArray();
        }

        public TestClass Write(TestClass @object)
        {
            for (var i = 0; i < data.Length; i++)
            {
                if (IdentityEquals(data[i], @object))
                    data[i] = @object;
            }

            return @object;
        }

        public TestClass[] GetContent()
        {
            return data;
        }

        private bool IdentityEquals(TestClass first, TestClass second)
        {
            foreach (var property in typeof(TestClass).GetProperties())
            {
                if (property.GetCustomAttribute(typeof(IdentityAttribute)) != null)
                {
                    var firstPropertyValue = property.GetMethod.Invoke(first, null);
                    var secondPropertyValue = property.GetMethod.Invoke(second, null);
                    if (!firstPropertyValue.Equals(secondPropertyValue))
                        return false;
                }
            }

            return true;
        }

        private TestClass[] data;
        private static SampleDataBase instance;
        private static readonly object lockObject = new object();
    }
}