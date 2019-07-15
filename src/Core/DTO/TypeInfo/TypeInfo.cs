using System;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json.Serialization;

namespace Kontur.DBViewer.Core.DTO.TypeInfo
{
    [JsonConverter(typeof(TypeInfoConverter))]
    public abstract class TypeInfo
    {
        [JsonConverter(typeof(StringEnumConverter))]
        [JsonProperty("type")]
        public abstract PrimitiveType Type { get; }
    }

    public class TypeInfoResolver : DefaultContractResolver
    {
        protected override JsonConverter ResolveContractConverter(Type objectType)
        {
            if (typeof(TypeInfo).IsAssignableFrom(objectType) && !objectType.IsAbstract)
                return null;
            return base.ResolveContractConverter(objectType);
        }
    }


    public class TypeInfoConverter : JsonConverter
    {
        static readonly JsonSerializerSettings SpecifiedSubclassConversion = new JsonSerializerSettings()
            {ContractResolver = new TypeInfoResolver()};

        public override bool CanWrite => false;

        public override object ReadJson(JsonReader reader, Type objectType, object existingValue,
            JsonSerializer serializer)
        {
            var jObject = JObject.Load(reader);
            var primitiveType =
                (PrimitiveType) Enum.Parse(typeof(PrimitiveType), jObject["type"].Value<string>(), true);
            var inheritant = ResolveInheritant(primitiveType);
            return JsonConvert.DeserializeObject(jObject.ToString(), inheritant, SpecifiedSubclassConversion);
        }

        private Type ResolveInheritant(PrimitiveType primitiveType)
        {
            switch (primitiveType)
            {
                case PrimitiveType.String:
                    return typeof(StringTypeInfo);
                case PrimitiveType.Byte:
                    return typeof(ByteTypeInfo);
                case PrimitiveType.SByte:
                    return typeof(SByteTypeInfo);
                case PrimitiveType.Char:
                    return typeof(CharTypeInfo);
                case PrimitiveType.Int:
                    return typeof(IntTypeInfo);
                case PrimitiveType.Long:
                    return typeof(LongTypeInfo);
                case PrimitiveType.Short:
                    return typeof(ShortTypeInfo);
                case PrimitiveType.Decimal:
                    return typeof(DecimalTypeInfo);
                case PrimitiveType.DateTime:
                    return typeof(DateTimeTypeInfo);
                case PrimitiveType.Enum:
                    return typeof(EnumTypeInfo);
                case PrimitiveType.Bool:
                    return typeof(BoolTypeInfo);
                case PrimitiveType.ByteArray:
                    return typeof(ByteArrayTypeInfo);
                case PrimitiveType.Class:
                    return typeof(ClassTypeInfo);
                case PrimitiveType.Enumerable:
                    return typeof(EnumerableTypeInfo);
                case PrimitiveType.Dictionary:
                    return typeof(DictionaryTypeInfo);
                case PrimitiveType.HashSet:
                    return typeof(HashSetTypeInfo);
                default:
                    throw new ArgumentOutOfRangeException(nameof(primitiveType), primitiveType, null);
            }
        }

        public override bool CanConvert(Type objectType)
        {
            return objectType == typeof(TypeInfo);
        }

        public override void WriteJson(JsonWriter writer, object value, JsonSerializer serializer)
        {
            throw new NotImplementedException();
        }
    }
}