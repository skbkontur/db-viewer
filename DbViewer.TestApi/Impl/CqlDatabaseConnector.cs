using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;

using Cassandra;

using SkbKontur.DbViewer.Connector;
using SkbKontur.DbViewer.Cql.Utils;
using SkbKontur.DbViewer.Dto;
using SkbKontur.DbViewer.TestApi.Cql;
using SkbKontur.DbViewer.TestApi.Impl.Classes;

namespace SkbKontur.DbViewer.TestApi.Impl
{
    public class CqlDatabaseConnector<T> : IDbConnector<T> where T : class
    {
        public Task<object[]> Search(Filter[] filters, Sort[] sorts, int from, int count)
        {
            if (typeof(T) == typeof(SimpleCqlObject))
                return Task.FromResult(Search(filters, simpleObjects, from, count).Cast<object>().ToArray());
            return Task.FromResult(Search(filters, nestedObjects, from, count).Cast<object>().ToArray());
        }

        public Task<int?> Count(Filter[] filters, int? limit)
        {
            if (typeof(T) == typeof(SimpleCqlObject))
                return Task.FromResult(Count(filters, simpleObjects));
            return Task.FromResult(Count(filters, nestedObjects));
        }

        public Task<object> Read(Filter[] filters)
        {
            if (typeof(T) == typeof(SimpleCqlObject))
                return Task.FromResult((object)Read(filters, simpleObjects));
            return Task.FromResult((object)Read(filters, nestedObjects));
        }

        public Task Delete(object @object)
        {
            if (typeof(T) == typeof(SimpleCqlObject))
                return Delete(simpleObjects, x => simpleObjects = x, @object);
            return Delete(nestedObjects, x => nestedObjects = x, @object);
        }

        public Task<object> Write(object @object)
        {
            if (typeof(T) == typeof(SimpleCqlObject))
                return Write(simpleObjects, x => simpleObjects = x, (SimpleCqlObject)@object);
            return Write(nestedObjects, x => nestedObjects = x, (NestedCqlObject)@object);
        }

        private static T1[] Search<T1>(Filter[] filters, T1[] arr, int from, int count)
        {
            var expr = (Expression<Func<T1, bool>>)CriterionHelper.BuildPredicate(typeof(T1), filters);
            return arr.AsQueryable().Where(expr).Skip(from).Take(count).ToArray();
        }

        private static int? Count<T1>(Filter[] filters, T1[] arr)
        {
            var expr = (Expression<Func<T1, bool>>)CriterionHelper.BuildPredicate(typeof(T1), filters);
            return arr.AsQueryable().Where(expr).Count();
        }

        private static T1 Read<T1>(Filter[] filters, T1[] arr)
        {
            var expr = (Expression<Func<T1, bool>>)CriterionHelper.BuildPredicate(typeof(T1), filters);
            return arr.AsQueryable().Where(expr).SingleOrDefault();
        }

        private static Task Delete<T1>(T1[] objects, Action<T1[]> setObjects, object @object)
        {
            var expr = (Expression<Func<T1, bool>>)CriterionHelper.BuildSameIdentitiesPredicate(typeof(T1), @object);
            if (objects.AsQueryable().SingleOrDefault(expr) == null)
                throw new Exception();
            var fn = expr.Compile();
            setObjects(objects.Where(x => !fn(x)).ToArray());
            return Task.CompletedTask;
        }

        private static Task<object> Write<T1>(T1[] objects, Action<T1[]> setObjects, T1 @object)
        {
            var expr = (Expression<Func<T1, bool>>)CriterionHelper.BuildSameIdentitiesPredicate(typeof(T1), @object);
            if (objects.AsQueryable().SingleOrDefault(expr) == null)
                throw new Exception();
            var fn = expr.Compile();
            setObjects(new List<T1>(objects.Where(x => !fn(x))) {@object}.ToArray());
            return Task.FromResult<object>(@object);
        }

        private static SimpleCqlObject[] simpleObjects =
            {
                new SimpleCqlObject
                    {
                        FileExtension = ".ext",
                        FileId = "FileId",
                        FileNameWithoutExtension = "FileName",
                        Id = Guid.Empty,
                        PartyId = "PartyId",
                        Status = DocumentPrintingStatus.Finished,
                        Timestamp = DateTimeOffset.Now
                    },
                new SimpleCqlObject
                    {
                        FileExtension = ".txt",
                        FileId = Guid.NewGuid().ToString(),
                        FileNameWithoutExtension = "name",
                        Id = Guid.NewGuid(),
                        PartyId = Guid.NewGuid().ToString(),
                        Status = DocumentPrintingStatus.Pending,
                        Timestamp = DateTimeOffset.Now,
                    }
            };

        private static NestedCqlObject[] nestedObjects =
            {
                new NestedCqlObject
                    {
                        BindingType = DocumentBindingType.ByPriceList,
                        DocumentCirculationId = TimeUuid.NewId(),
                        DocumentDate = new LocalDate(2018, 10, 10),
                        DocumentTime = new LocalTime(01, 10, 10, 100000000),
                        DocumentType = "DocumentType",
                        DocumentNumber = "0",
                        EntityMetaBytes = new byte[0],
                        DocumentWithoutGoodItemsBytes = new byte[0],
                        FirstPartnerPartyId = "FirstPartnerPartyId",
                        SecondPartnerPartyId = "SecondPartnerPartyId",
                    },
            };
    }
}