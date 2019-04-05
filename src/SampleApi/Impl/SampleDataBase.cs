using System;
using System.Linq;
using System.Linq.Expressions;
using System.Reflection;

using AutoFixture;

using Kontur.DBViewer.Core.DTO;
using Kontur.DBViewer.SampleApi.Impl.Attributes;
using Kontur.DBViewer.SampleApi.Impl.Utils;

namespace Kontur.DBViewer.SampleApi.Impl
{
    public class SampleDataBase<T>
        where T: class 
    {
        public SampleDataBase()
        {
            var fixture = new Fixture();
            data = Enumerable.Range(0, 1000).Select(x => fixture.Build<T>().Create()).ToArray();
        }

        public SampleDataBase(T[] data)
        {
            this.data = data;
        }

        public static SampleDataBase<T> Instance
        {
            get
            {
                if (instance == null)
                    lock(lockObject)
                        if(instance == null)
                            instance = new SampleDataBase<T>();
                return instance;
            }
            set => instance = value;
        }

        public T[] Find(Filter[] filters, Sort[] sorts, int @from, int count)
        {
            var result = data.Where(BuildCriterion(filters)).Skip(from).Take(count);
            return result.ToArray();
        }

        private Func<T, bool> BuildCriterion(Filter[] filters)
        {
            return ((Expression<Func<T, bool>>)CriterionHelper.BuildCriterion(typeof(T), filters)).Compile();
        }
        
        public int? Count(Filter[] filters, int? limit)
        {
            return Math.Min(limit ?? 0, data.Count(BuildCriterion(filters)));
        }

        public object Read(Filter[] filters)
        {
            return data.Single(BuildCriterion(filters));
        }

        public void Delete(T @object)
        {
            data = data.Where(x => !IdentityEquals(x, @object)).ToArray();
        }

        public T Write(T @object)
        {
            for(var i = 0; i < data.Length; i++)
            {
                if(IdentityEquals(data[i], @object))
                    data[i] = @object;
            }

            return @object;
        }

        public T[] GetContent()
        {
            return data;
        }

        private bool IdentityEquals(T first, T second)
        {
            foreach(var property in typeof(T).GetProperties())
            {
                if(property.GetCustomAttribute(typeof(IdentityAttribute)) != null)
                {
                    var firstPropertyValue = property.GetMethod.Invoke(first, null);
                    var secondPropertyValue = property.GetMethod.Invoke(second, null);
                    if(!firstPropertyValue.Equals(secondPropertyValue))
                        return false;
                }
            }

            return true;
        }

        private T[] data;
        private static SampleDataBase<T> instance;
        private static readonly object lockObject = new object();
    }
}