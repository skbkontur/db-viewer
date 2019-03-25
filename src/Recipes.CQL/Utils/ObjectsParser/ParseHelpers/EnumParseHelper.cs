using System;
using System.Reflection;
using System.Reflection.Emit;
using GrEmit;

namespace Kontur.DBViewer.Recipes.CQL.Utils.ObjectsParser.ParseHelpers
{
    internal static class EnumParseHelper
    {
        public static bool TryParse(Type enumType, string value, out object result, bool ignoreCase = false)
        {
            result = enumParser(enumType, value, ignoreCase);
            return result != null;
        }

        private delegate object EnumParserDelegate(Type enumType, string value, bool ignoreCase);

        private static EnumParserDelegate EmitEnumParser()
        {
            var method = new DynamicMethod(Guid.NewGuid().ToString(), typeof(object), new[] {typeof(Type), typeof(string), typeof(bool)}, typeof(string), true);
            var il = new GroboIL(method);
            var enumResultType = typeof(Enum).GetNestedType("EnumResult", BindingFlags.NonPublic);
            var enumResult = il.DeclareLocal(enumResultType);
            il.Ldarg(0);
            il.Ldarg(1);
            il.Ldarg(2);
            il.Ldloca(enumResult);
            il.Call(typeof(Enum).GetMethod("TryParseEnum", BindingFlags.Static | BindingFlags.NonPublic));
            var returnNullLabel = il.DefineLabel("returnNull");
            il.Brfalse(returnNullLabel);
            il.Ldloca(enumResult);
            il.Ldfld(enumResultType.GetField("parsedEnum", BindingFlags.Instance | BindingFlags.NonPublic));
            il.Ret();
            il.MarkLabel(returnNullLabel);
            il.Ldnull();
            il.Ret();
            return (EnumParserDelegate)method.CreateDelegate(typeof(EnumParserDelegate));
        }

        private static readonly EnumParserDelegate enumParser = EmitEnumParser();
    }
}