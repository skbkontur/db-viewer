using System;
using System.Runtime.Serialization;

namespace Kontur.DBViewer.Core.GenericHelpers
{
    [Serializable]
    public class GenericMethodInvocationException : Exception
    {
        public GenericMethodInvocationException()
        {
        }

        public GenericMethodInvocationException(string message)
            : base(message)
        {
        }

        public GenericMethodInvocationException(string message, Exception inner)
            : base(message, inner)
        {
        }

        protected GenericMethodInvocationException(
            SerializationInfo info,
            StreamingContext context)
            : base(info, context)
        {
        }
    }
}