using System;
using System.Threading.Tasks;
using Cassandra;
using Kontur.DBViewer.Core.Connector;
using Kontur.DBViewer.Core.DTO;
using Kontur.DBViewer.SampleApi.Impl.Classes;

namespace Kontur.DBViewer.SampleApi.Impl.Utils
{
    public class CqlDatabaseConnector<T> : IDBConnector<T> where T : class
    {
        public Task<object[]> Search(Filter[] filters, Sort[] sorts, int @from, int count)
        {
            if (typeof(T) == typeof(SimpleCqlObject))
            {
                return Task.FromResult(new object[]
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
                    }
                });    
            }
            else
            {
                return Task.FromResult(new object[]
                {
                    new NestedCqlObject
                    {
                        BindingType = BindingType.ByPriceList,
                        DocumentCirculationId = TimeUuid.NewId(),
                        DocumentDate = new LocalDate(2018, 10, 10),
                        DocumentType = "DocumentType",
                        DocumentNumber = "0",
                        EntityMetaBytes = new byte[0],
                        DocumentWithoutGoodItemsBytes = new byte[0],
                        FirstPartnerPartyId = "FirstPartnerPartyId",
                        SecondPartnerPartyId = "SecondPartnerPartyId",
                    },
                });
            }
            
        }

        public Task<int?> Count(Filter[] filters, int? limit)
        {
            return Task.FromResult((int?)0);
        }

        public Task<object> Read(Filter[] filters)
        {
            throw new System.NotImplementedException();
        }

        public Task Delete(object @object)
        {
            throw new System.NotImplementedException();
        }

        public Task<object> Write(object @object)
        {
            throw new System.NotImplementedException();
        }
    }
}