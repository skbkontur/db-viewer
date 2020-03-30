using System;
using System.Runtime.Serialization;

namespace SkbKontur.DbViewer.GenericHelpers
{
    [Serializable]
    internal class GenericMethodInvocationException : Exception
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

        protected GenericMethodInvocationException(SerializationInfo info, StreamingContext context)
            : base(info, context)
        {
        }
    }
}