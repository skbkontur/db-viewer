using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;

using AutoFixture;

using GroBuf;
using GroBuf.DataMembersExtracters;

using SkbKontur.DbViewer.Cql.CustomPropertyConfigurations;
using SkbKontur.DbViewer.DataTypes;
using SkbKontur.DbViewer.Helpers;
using SkbKontur.DbViewer.TestApi.Impl.Attributes;
using SkbKontur.DbViewer.TestApi.Impl.Classes;

namespace SkbKontur.DbViewer.TestApi.Impl
{
    public interface ISampleDataBase
    {
        void Initialize();
        void Initialize(object[] data);
        object[] Find(Condition[] filters, Sort[] sorts, int from, int count);
        int? Count(Condition[] filters, int limit);
        object Read(Condition[] filters);
        void Delete(Condition[] filters);
        void Write(object @object);
        object[] GetContent();
    }

    public class SampleDataBase<T> : ISampleDataBase
    {
        public SampleDataBase()
        {
            serializer = new Serializer(new AllPropertiesExtractor());
            fixture = new Fixture();
            fixture.Register((DateTime date) => date.ToLocalDate());
            fixture.Register((DateTime time) => CassandraPrimitivesExtensions.ToLocalTime(time));
            fixture.Register((int i) => i % 2 == 0
                                            ? (BaseClass)new ChildClass {Int = i}
                                            : new ChildClass2
                                                {
                                                    String = i.ToString(),
                                                    Strings = Enumerable.Range(0, 10).Select(x => x.ToString()).ToArray()
                                                });
        }

        public void Initialize()
        {
            data = CreateData(fixture, serializer);
        }

        public void Initialize(object[] data)
        {
            this.data = data.Cast<T>().ToArray();
        }

        protected virtual T[] CreateData(Fixture fixture, ISerializer serializer)
        {
            return Enumerable.Range(0, 1000).Select(_ => fixture.Build<T>().Create()).ToArray();
        }

        public object[] Find(Condition[] filters, Sort[] sorts, int from, int count)
        {
            var result = data.Where(BuildCriterion(filters)).Skip(from).Take(count);
            return result.Cast<object>().ToArray();
        }

        private Func<T, bool> BuildCriterion(Condition[] filters)
        {
            return CriterionHelper.BuildPredicate<T>(filters).Compile();
        }

        public int? Count(Condition[] filters, int limit)
        {
            return Math.Min(limit, data.Count(BuildCriterion(filters)));
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

        public void Write(object @object)
        {
            for (var i = 0; i < data.Length; i++)
            {
                if (IdentityEquals(data[i], (T)@object))
                    data[i] = (T)@object;
            }
        }

        public object[] GetContent()
        {
            return data.Cast<object>().ToArray();
        }

        private bool IdentityEquals(T first, T second)
        {
            foreach (var property in typeof(T).GetProperties())
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

        private T[] data;
        private readonly ISerializer serializer;
        private readonly Fixture fixture;
    }

    public static class SampleDataBase
    {
        public static ISampleDataBase Get<T>()
        {
            if (!dataBases.TryGetValue(typeof(T), out var instance))
                lock (lockObject)
                    if (!dataBases.TryGetValue(typeof(T), out instance))
                    {
                        if (typeof(T) == typeof(TestClass))
                            instance = new TestClassDataBase();
                        else if (typeof(T) == typeof(RidiculousUseCasesClass))
                            instance = new RidiculousUseCasesClassDataBase();
                        else
                            throw new InvalidOperationException();
                        instance.Initialize();
                        dataBases[typeof(T)] = instance;
                    }

            return instance;
        }

        public static void Set<T>(ISampleDataBase instance)
        {
            lock (lockObject)
                dataBases[typeof(T)] = instance;
        }

        private static readonly Dictionary<Type, ISampleDataBase> dataBases = new Dictionary<Type, ISampleDataBase>();
        private static readonly object lockObject = new object();
    }
}