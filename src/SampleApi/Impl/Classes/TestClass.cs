using System;
using System.Reflection;
using Kontur.DBViewer.SampleApi.Impl.Attributes;
using Newtonsoft.Json.Linq;

namespace Kontur.DBViewer.SampleApi.Impl.Classes
{
    public class TestClass
    {
        [Identity, Indexed] public string Id { get; set; }
        
        public TestClassWithAllPrimitives Content { get; set; }

        [Serialized(typeof(ClassForSerialization))]
        public byte[] Serialized { get; set; }

        public byte[] File { get; set; }

        public DifficultEnum DifficultEnum { get; set; }

        [Serialized(typeof(TestClassResolver))]
        public byte[] DifficultSerialized { get; set; }

        public TestClassWithCustomPrimitives CustomContent { get; set; }
    }

    public enum DifficultEnum
    {
        A,
        B,
    }


    public class TestClassResolver : TypeResolverBase<TestClass>
    {
        protected override Type ResolveObject(TestClass @object, PropertyInfo propertyInfo)
        {
            return GetObjectType(@object.DifficultEnum);
        }

        protected override Type ResolveJson(JObject @object, PropertyInfo propertyInfo)
        {
            return GetObjectType(@object["DifficultEnum"].ToObject<DifficultEnum>());
        }

        private static Type GetObjectType(DifficultEnum difficultEnum)
        {
            switch (difficultEnum)
            {
                case DifficultEnum.A:
                    return typeof(A);
                case DifficultEnum.B:
                    return typeof(B);
                default:
                    throw new NotSupportedException();
            }
        }
    }

    public class A
    {
        public int Int { get; set; }
    }

    public class B
    {
        public string String { get; set; }
    }
}