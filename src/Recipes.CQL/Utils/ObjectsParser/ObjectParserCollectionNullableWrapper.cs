using System;
using System.Linq;
using Kontur.DBViewer.Recipes.CQL.Utils.ObjectsParser.Parsers;

namespace Kontur.DBViewer.Recipes.CQL.Utils.ObjectsParser
{
    internal class ObjectParserCollectionNullableWrapper : IObjectParserCollection
    {
        public ObjectParserCollectionNullableWrapper(IObjectParserCollection innerCollection)
        {
            this.innerCollection = innerCollection;
        }

        public IValueParser GetParser(Type type)
        {
            if(type.IsGenericType && type.GetGenericTypeDefinition() == typeof(Nullable<>))
            {
                var innerType = type.GetGenericArguments().First();
                if (innerType.IsEnum)
                    return new NullableParser(innerCollection.GetEnumParser());
                return new NullableParser(innerCollection.GetParser(innerType));
            }
            return innerCollection.GetParser(type);
        }

        public IValueParser GetEnumParser()
        {
            return innerCollection.GetEnumParser();
        }

        internal class NullableParser : IValueParser
        {
            public NullableParser(IValueParser parser)
            {
                this.parser = parser;
            }

            public bool TryParse(Type type, string value, out object result)
            {
                var innerType = type.GetGenericArguments().First();
                if(string.IsNullOrEmpty(value))
                {
                    result = null;
                    return true;
                }
                return parser.TryParse(innerType, value, out result);
            }

            private readonly IValueParser parser;
        }

        private readonly IObjectParserCollection innerCollection;
    }
}