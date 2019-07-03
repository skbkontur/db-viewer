using System;
using System.Collections.Generic;
using System.Globalization;
using Cassandra;
using Kontur.DBViewer.Recipes.CQL.Utils.ObjectsParser.Exceptions;
using Kontur.DBViewer.Recipes.CQL.Utils.ObjectsParser.ParseHelpers;
using Kontur.DBViewer.Recipes.CQL.Utils.ObjectsParser.Parsers;
using Kontur.DBViewer.Recipes.CQL.Utils.ObjectsParser.Parsers.InternalImplementations;

namespace Kontur.DBViewer.Recipes.CQL.Utils.ObjectsParser
{
    internal class ObjectParserConfiguration : IObjectParserCollection
    {
        private ObjectParserConfiguration()
        {
        }

        IValueParser IObjectParserCollection.GetParser(Type type)
        {
            if (!parseRules.ContainsKey(type))
                throw new ParserNotFoundException(type);
            return parseRules[type];
        }

        IValueParser IObjectParserCollection.GetEnumParser()
        {
            if(enumClassParser == null)
                throw new ParserNotFoundException("for enums");
            return enumClassParser;
        }

        public static ObjectParserConfiguration CreateEmpty()
        {
            return new ObjectParserConfiguration();
        }

        public static ObjectParserConfiguration CreateDefault()
        {
            return CreateEmpty()
                .Configure<string>(ValueParser.CreateSimpleStringParser())
                .Configure<int>(int.TryParse)
                .Configure<byte>(byte.TryParse)
                .Configure<long>(long.TryParse)
                .Configure((string value, out double result) => double.TryParse(value, NumberStyles.Float, CultureInfo.InvariantCulture, out result))
                .Configure((string value, out float result) => float.TryParse(value, NumberStyles.Float, CultureInfo.InvariantCulture, out result))
                .Configure<bool>(bool.TryParse)
                .Configure<Guid>(Guid.TryParse)
                .Configure<TimeUuid>(TimeUuidParseHelper.TryParse)
                .Configure<DateTime>(DateTimeParseHelper.TryParse)
                .ConfigureEnumParse(new EnumParser((Type enumType, string value, out object result) => EnumParseHelper.TryParse(enumType, value, out result)));
        }

        public ObjectParserConfiguration Configure<T>(TryParseDelegate<T> tryParse)
        {
            parseRules[typeof(T)] = new ValueParser<T>(tryParse);
            return this;
        }

        public ObjectParserConfiguration Configure<T>(IValueParser valueParser)
        {
            parseRules[typeof(T)] = valueParser;
            return this;
        }

        public ObjectParserConfiguration ConfigureEnumParse(IValueParser classParser)
        {
            enumClassParser = classParser;
            return this;
        }

        public ObjectParserConfiguration ConfigureEnumParse(EnumTryParseDelegate tryParse)
        {
            enumClassParser = new EnumParser(tryParse);
            return this;
        }

        private readonly Dictionary<Type, IValueParser> parseRules = new Dictionary<Type, IValueParser>();
        private IValueParser enumClassParser;
    }
}