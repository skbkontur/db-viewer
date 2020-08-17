using System;
using System.ComponentModel.DataAnnotations.Schema;

using SkbKontur.DbViewer.TestApi.Impl.Attributes;

namespace SkbKontur.DbViewer.TestApi.EntityFramework
{
    public class TestTable
    {
        [Identity]
        public int Id { get; set; }

        [Identity]
        public string CompositeKey { get; set; }

        [Indexed]
        public bool Boolean { get; set; }

        [Indexed]
        public int Integer { get; set; }

        [Indexed]
        public string String { get; set; }

        [Indexed]
        public DateTime DateTime { get; set; }

        [Indexed]
        public DateTimeOffset DateTimeOffset { get; set; }

        [Column(TypeName = "jsonb")]
        public Customer Customer { get; set; }

        [Serialized(typeof(Customer))]
        public byte[] CustomerSerialized { get; set; }
    }

    public class Customer
    {
        public string Name { get; set; }
        public int Age { get; set; }
        public Order[] Orders { get; set; }
    }

    public class Order
    {
        public decimal Price { get; set; }
        public string ShippingAddress { get; set; }
    }
}