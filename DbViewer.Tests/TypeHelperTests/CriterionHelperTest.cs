using System.Linq;

using FluentAssertions;

using NUnit.Framework;

using SkbKontur.DbViewer.DataTypes;
using SkbKontur.DbViewer.Helpers;

namespace SkbKontur.DbViewer.Tests.TypeHelperTests
{
    public class CriterionHelperTest
    {
        [Test]
        public void BuildCriterionTestWithOperators()
        {
            var where = CriterionHelper.BuildPredicate<Party>(new[]
                {
                    new Condition {Path = "Gln", Value = "glnValue", Operator = ObjectFieldFilterOperator.Equals},
                    new Condition {Path = "Id", Value = "10", Operator = ObjectFieldFilterOperator.LessThan},
                    new Condition {Path = "Address.City", Value = "cityValue", Operator = ObjectFieldFilterOperator.Equals}
                });

            var sort1 = CriterionHelper.BuildSort<Party, int>(new Sort {Path = "Id", SortOrder = ObjectFilterSortOrder.Ascending});
            var sort2 = CriterionHelper.BuildSort<Party, string>(new Sort {Path = "Address.City", SortOrder = ObjectFilterSortOrder.Ascending});

            var entries = new[]
                {
                    new Party {Gln = "213", Id = 10, Address = new Address {City = "abc"}},
                    new Party {Gln = "glnValue", Id = 9, Address = new Address {City = "cityValue"}},
                    new Party {Gln = "glnValue", Id = 10, Address = new Address {City = "cityValue"}},
                    new Party {Gln = "215", Id = 11, Address = new Address {City = "cbc"}},
                    new Party {Gln = "glnValue", Id = 8, Address = new Address {City = "cityValue"}},
                    new Party {Gln = "qwret", Id = 6, Address = new Address {City = "cityValue"}},
                    new Party {Gln = "glnValue", Id = 7, Address = new Address {City = "zbx"}},
                    new Party {Gln = "215", Id = 8, Address = new Address {City = "qwc"}},
                };

            var query = entries.AsQueryable().Where(where).OrderBy(sort1).ThenBy(sort2).ToArray();
            query.Should().BeEquivalentTo(entries.Where(x => x.Gln == "glnValue" && x.Id < 10 && x.Address.City == "cityValue").OrderBy(x => x.Id).ThenBy(x => x.Address), x => x.WithStrictOrdering());

            var query2 = entries.AsQueryable().OrderBy(sort1).ThenBy(sort2).ToArray();
            query2.Should().BeEquivalentTo(entries.OrderBy(x => x.Id).ThenBy(x => x.Address.City), x => x.WithStrictOrdering());
        }

        private class Party
        {
            public int Id { get; set; }
            public string Gln { get; set; }
            public Address Address { get; set; }
        }

        private class Address
        {
            public string City { get; set; }
        }
    }
}