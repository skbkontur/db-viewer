using System;
using Cassandra;

namespace Kontur.DBViewer.Recipes.CQL.Utils.ObjectsParser.ParseHelpers
{
    internal static class TimeUuidParseHelper
    {
        public static bool TryParse(string value, out TimeUuid result)
        {
            result = default(TimeUuid);
            if (!Guid.TryParse(value, out var guid))
                return false;
            result = guid;
            return true;
        }
    }
}