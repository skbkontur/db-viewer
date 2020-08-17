using System;
using System.Linq;
using System.Text;

using AutoFixture;

using GroBuf;

using SkbKontur.DbViewer.TestApi.Impl.Classes;

namespace SkbKontur.DbViewer.TestApi.Impl
{
    public class TestClassDataBase : SampleDataBase<TestClass>
    {
        protected override TestClass[] CreateData(Fixture fixture, ISerializer serializer)
        {
            var data = Enumerable.Range(0, 1000).Select(
                i => fixture.Build<TestClass>()
                            .With(x => x.Id, i.ToString())
                            .With(x => x.Serialized, serializer.Serialize(fixture.Create<ClassForSerialization>()))
                            .Create()
            ).ToArray();
            FillDifficultSerialized(serializer, data);
            return data;
        }

        private static void FillDifficultSerialized(ISerializer serializer, TestClass[] data)
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
    }
}