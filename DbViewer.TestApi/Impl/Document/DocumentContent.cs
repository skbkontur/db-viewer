using System;

namespace SkbKontur.DbViewer.TestApi.Impl.Document
{
    public class DocumentContent
    {
        public Guid? OrderId { get; set; }
        public OrderStatus? OrderStatus { get; set; }
        public bool? WasRead { get; set; }
        public string? OrdersNumber { get; set; }
        public DateTime? DeliveryDate { get; set; }
        public decimal? TotalAmount { get; set; }
        public GoodItem[] GoodItems { get; set; }
    }
}