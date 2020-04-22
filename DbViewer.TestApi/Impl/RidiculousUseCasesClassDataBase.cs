using System.Linq;

using AutoFixture;

using GroBuf;

using SkbKontur.DbViewer.TestApi.Impl.Classes;

namespace SkbKontur.DbViewer.TestApi.Impl
{
    public class RidiculousUseCasesClassDataBase : SampleDataBase<RidiculousUseCasesClass>
    {
        protected override RidiculousUseCasesClass[] CreateData(Fixture fixture, ISerializer serializer)
        {
            return Enumerable.Range(0, 1000).Select(_ => fixture.Build<RidiculousUseCasesClass>().Create()).ToArray();
        }
    }
}