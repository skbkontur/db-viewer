using System.Reflection;
using AutoFixture;
using AutoFixture.Kernel;
using Cassandra;

namespace Kontur.DBViewer.Tests.ApiTests
{
    public class LocalTimeBuilder : ISpecimenBuilder
    {
        public object Create(object request, ISpecimenContext context)
        {
            if (!(request is ParameterInfo pi) ||
                pi.Member.DeclaringType != typeof(LocalTime) ||
                pi.ParameterType != typeof(int))
                return new NoSpecimen();

            switch (pi.Name)
            {
                case "hour": return context.Create<int>() % 24;
                case "minute": return context.Create<int>() % 60;
                case "second": return context.Create<int>() % 60;
                default: return context.Create<int>();
            }
        }
    }
}