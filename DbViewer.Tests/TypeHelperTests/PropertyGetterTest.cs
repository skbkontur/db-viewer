using System;
using System.Collections.Generic;
using System.Linq;

using FluentAssertions;

using NUnit.Framework;

using SkbKontur.DbViewer.Helpers;
using SkbKontur.DbViewer.TestApi;

namespace SkbKontur.DbViewer.Tests.TypeHelperTests
{
    public class PropertyGetterTest
    {
        [Test]
        public void Test()
        {
            var items = new[]
                {
                    new PartySettings
                        {
                            Id = Guid.NewGuid().ToString(),
                            ScopeId = Guid.NewGuid().ToString(),
                            LastModificationDateTime = DateTime.UtcNow,
                        },
                    new PartySettings
                        {
                            Id = Guid.NewGuid().ToString(), ScopeId = Guid.NewGuid().ToString(),
                            PartyBoxesSettings = new PartyBoxesSettings {SupplierBoxSelectionStrategy = SupplierBoxSelectionStrategy.ShipperField},
                        }
                };

            var properties = new List<string>();
            var gettersList = new List<Func<object?, object?>>();

            PropertyHelpers.BuildGettersForProperties(typeof(PartySettings), "", x => x, properties, gettersList, new CustomPropertyConfigurationProvider());

            var getters = properties.Zip(gettersList, (name, getter) => (name, getter)).ToDictionary(x => x.name, x => x.getter);

            getters["Id"](items[0]).Should().Be(items[0].Id);
            getters["ScopeId"](items[0]).Should().Be(items[0].ScopeId);
            getters["PartyBoxesSettings.SupplierBoxSelectionStrategy"](items[0]).Should().BeNull();
            getters["LastModificationDateTime"](items[0]).Should().Be(items[0].LastModificationDateTime);

            getters["Id"](items[1]).Should().Be(items[1].Id);
            getters["ScopeId"](items[1]).Should().Be(items[1].ScopeId);
            getters["PartyBoxesSettings.SupplierBoxSelectionStrategy"](items[1]).Should().Be(SupplierBoxSelectionStrategy.ShipperField);
        }

        public enum SupplierBoxSelectionStrategy
        {
            None,
            ShipperField,
        }

        public class PartySettings
        {
            public string Id { get; set; }
            public string ScopeId { get; set; }
            public DateTime LastModificationDateTime { get; set; }
            public PartyBoxesSettings PartyBoxesSettings { get; set; }
        }

        public class PartyBoxesSettings
        {
            public SupplierBoxSelectionStrategy SupplierBoxSelectionStrategy { get; set; }
        }
    }
}