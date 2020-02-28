import { expect } from "chai";
import { DateTimeRange } from "Domain/EDI/DataTypes/DateTimeRange";

import { queryStringMapping, QueryStringMapping, StringSimpleExpression } from "../../src/Commons/QueryStringMapping";

type Enum1 = 1 | 2 | 3;
type Enum2 = "enum1" | "enum2" | "enum3" | "enum4" | "enum5";

interface Entiry1 {
    value?: Nullable<string>;
    numValue?: Nullable<number>;
    boolValue?: Nullable<boolean>;
    timeRange?: Nullable<DateTimeRange>;
    enumValue?: Nullable<Enum1>;
    valueExpression?: Nullable<StringSimpleExpression>;
    enumValues?: Nullable<Enum1[]>;
    stringEnumValues?: Nullable<Enum2[]>;
}

describe("QueryStringMappingBuilder", () => {
    describe("for strings", () => {
        it("should parse", () => {
            const mapping: QueryStringMapping<Entiry1> = queryStringMapping<Entiry1>()
                .mapToString(x => x.value, "str")
                .build();
            expect(mapping.parse("?str=val")).to.eql({
                value: "val",
            });
            expect(mapping.parse("?str=")).to.eql({
                value: "",
            });
            expect(mapping.parse("?anotherValue=val")).to.eql({
                value: null,
            });
        });

        it("should strigify", () => {
            const mapping: QueryStringMapping<Entiry1> = queryStringMapping<Entiry1>()
                .mapToString(x => x.value, "str")
                .build();

            expect(
                mapping.stringify({
                    value: "val",
                })
            ).to.eql("?str=val");
            expect(
                mapping.stringify({
                    value: "",
                })
            ).to.eql("");
            expect(
                mapping.stringify({
                    value: null,
                })
            ).to.eql("");
        });
    });

    describe("for time ranges", () => {
        it("should parse", () => {
            const mapping: QueryStringMapping<Entiry1> = queryStringMapping<Entiry1>()
                .mapToDateTimeRange(x => x.timeRange, "timeRange")
                .build();
            expect(mapping.parse("?timeRange.from=2010-01-01")).to.eql({
                timeRange: { lowerBound: new Date("2010-01-01"), upperBound: null },
            });
            expect(mapping.parse("")).to.eql({ timeRange: { lowerBound: null, upperBound: null } });
            expect(mapping.parse("?timeRange.from=zzzz")).to.eql({ timeRange: { lowerBound: null, upperBound: null } });
            expect(mapping.parse("?timeRange.to=2010-01-01")).to.eql({
                timeRange: { lowerBound: null, upperBound: new Date("2010-01-01") },
            });
        });

        it("should stringify", () => {
            const mapping: QueryStringMapping<Entiry1> = queryStringMapping<Entiry1>()
                .mapToDateTimeRange(x => x.timeRange, "timeRange")
                .build();
            expect(mapping.stringify({ timeRange: { lowerBound: new Date("2010-01-01"), upperBound: null } })).to.eql(
                "?timeRange.from=2010-01-01"
            );
            expect(mapping.stringify({ timeRange: { lowerBound: null, upperBound: null } })).to.eql("");
            expect(mapping.stringify({ timeRange: { lowerBound: null, upperBound: null } })).to.eql("");
            expect(mapping.stringify({ timeRange: { lowerBound: null, upperBound: new Date("2010-01-01") } })).to.eql(
                "?timeRange.to=2010-01-01"
            );
        });

        it("should parse empty query string to default value", () => {
            const lowerDate = new Date();
            const upperDate = new Date();
            const mapping: QueryStringMapping<Entiry1> = queryStringMapping<Entiry1>()
                .mapToDateTimeRange(x => x.timeRange, "timeRange", { lowerBound: lowerDate, upperBound: upperDate })
                .build();
            expect(mapping.parse("")).to.eql({ timeRange: { lowerBound: lowerDate, upperBound: upperDate } });
        });

        it("should parse invalid query string to default value", () => {
            const lowerDate = new Date();
            const upperDate = new Date();
            const mapping: QueryStringMapping<Entiry1> = queryStringMapping<Entiry1>()
                .mapToDateTimeRange(x => x.timeRange, "timeRange", { lowerBound: lowerDate, upperBound: upperDate })
                .build();
            expect(mapping.parse("timeRange.from=zzzz")).to.eql({
                timeRange: { lowerBound: lowerDate, upperBound: upperDate },
            });
        });

        it("should not stringify default value", () => {
            const lowerDate = new Date();
            const upperDate = new Date();
            const mapping: QueryStringMapping<Entiry1> = queryStringMapping<Entiry1>()
                .mapToDateTimeRange(x => x.timeRange, "timeRange", { lowerBound: lowerDate, upperBound: upperDate })
                .build();
            expect(mapping.stringify({ timeRange: { lowerBound: lowerDate, upperBound: upperDate } })).to.eql("");
        });
    });

    describe("for number expression", () => {
        it("should parse number", () => {
            const mapping: QueryStringMapping<Entiry1> = queryStringMapping<Entiry1>()
                .mapToInteger(x => x.numValue, "valueExpression")
                .build();
            expect(mapping.parse("?valueExpression=1")).to.eql({ numValue: 1 });
        });

        it("should parse non valid number", () => {
            const mapping: QueryStringMapping<Entiry1> = queryStringMapping<Entiry1>()
                .mapToInteger(x => x.numValue, "valueExpression")
                .build();
            expect(mapping.parse("?valueExpression=wfaeswfawef")).to.eql({ numValue: null });
        });

        it("should parse empty value and fallback to defaut value", () => {
            const mapping: QueryStringMapping<Entiry1> = queryStringMapping<Entiry1>()
                .mapToInteger(x => x.numValue, "valueExpression", 100)
                .build();
            expect(mapping.parse("?valueExpression=")).to.eql({ numValue: 100 });
            expect(mapping.parse("")).to.eql({ numValue: 100 });
        });
    });

    describe("for boolean expression", () => {
        it("should parse boolean", () => {
            const mapping: QueryStringMapping<Entiry1> = queryStringMapping<Entiry1>()
                .mapToBoolean(x => x.boolValue, "valueExpression")
                .build();
            expect(mapping.parse("?valueExpression=true")).to.eql({ boolValue: true });
            expect(mapping.parse("?valueExpression=false")).to.eql({ boolValue: false });
        });

        it("should parse numbers to false", () => {
            const mapping: QueryStringMapping<Entiry1> = queryStringMapping<Entiry1>()
                .mapToBoolean(x => x.boolValue, "valueExpression")
                .build();
            expect(mapping.parse("?valueExpression=0")).to.eql({ boolValue: null });
            expect(mapping.parse("?valueExpression=1")).to.eql({ boolValue: null });
        });

        it("should parse non valid values", () => {
            const mapping: QueryStringMapping<Entiry1> = queryStringMapping<Entiry1>()
                .mapToBoolean(x => x.boolValue, "valueExpression")
                .build();
            expect(mapping.parse("?valueExpression=fwafwef")).to.eql({ boolValue: null });
            expect(mapping.parse("?valueExpression=125125")).to.eql({ boolValue: null });
        });

        it("should not stringify empty value", () => {
            const mapping: QueryStringMapping<Entiry1> = queryStringMapping<Entiry1>()
                .mapToBoolean(x => x.boolValue, "valueExpression")
                .build();
            expect(mapping.stringify({ boolValue: null })).to.eql("");
        });

        it("should not stringify default value", () => {
            const mapping: QueryStringMapping<Entiry1> = queryStringMapping<Entiry1>()
                .mapToBoolean(x => x.boolValue, "valueExpression", false)
                .build();
            expect(mapping.stringify({ boolValue: false })).to.eql("");
        });

        it("should parse empty string to default value", () => {
            const mapping: QueryStringMapping<Entiry1> = queryStringMapping<Entiry1>()
                .mapToBoolean(x => x.boolValue, "valueExpression", false)
                .build();
            expect(mapping.parse("")).to.eql({ boolValue: false });
        });
    });

    describe("for string expression", () => {
        it("should parse", () => {
            const mapping: QueryStringMapping<Entiry1> = queryStringMapping<Entiry1>()
                .mapToStringSimpleExpression(x => x.valueExpression, "valueExpression")
                .build();
            expect(mapping.parse("?valueExpression=Zzzz")).to.eql({ valueExpression: { value: "Zzzz", operator: 0 } });
            expect(mapping.parse("?valueExpression=-Zzzz")).to.eql({ valueExpression: { value: "Zzzz", operator: 1 } });
            expect(mapping.parse("?valueExpression=-")).to.eql({ valueExpression: { value: "", operator: 1 } });
            expect(mapping.parse("?valueExpression=")).to.eql({ valueExpression: null });
            expect(mapping.parse("")).to.eql({ valueExpression: null });
        });

        it("should stringify", () => {
            const mapping: QueryStringMapping<Entiry1> = queryStringMapping<Entiry1>()
                .mapToStringSimpleExpression(x => x.valueExpression, "valueExpression")
                .build();
            expect(mapping.stringify({ valueExpression: { value: "Zzzz", operator: 0 } })).to.eql(
                "?valueExpression=Zzzz"
            );
            expect(mapping.stringify({ valueExpression: { value: "Zzzz", operator: 1 } })).to.eql(
                "?valueExpression=-Zzzz"
            );
            expect(mapping.stringify({ valueExpression: { value: "", operator: 1 } })).to.eql("?valueExpression=-");
            expect(mapping.stringify({ valueExpression: { value: "", operator: 0 } })).to.eql("");
            expect(mapping.stringify({ valueExpression: null })).to.eql("");
        });
    });

    describe("for string values", () => {
        it("should parse", () => {
            const mapping: QueryStringMapping<Entiry1> = queryStringMapping<Entiry1>()
                .mapToString(x => x.value, "value")
                .build();
            expect(mapping.parse("?value=123123")).to.eql({ value: "123123" });
            expect(mapping.parse("?value=&z=1")).to.eql({ value: "" });
            expect(mapping.parse("?value=123&z=1")).to.eql({ value: "123" });
            expect(mapping.parse("?value=")).to.eql({ value: "" });
            expect(mapping.parse("")).to.eql({ value: null });
            expect(mapping.parse(null)).to.eql({ value: null });
        });

        it("should stringify", () => {
            const mapping: QueryStringMapping<Entiry1> = queryStringMapping<Entiry1>()
                .mapToString(x => x.value, "value")
                .build();
            expect(mapping.stringify({ value: "123123" })).to.eql("?value=123123");
            expect(mapping.stringify({ value: "" })).to.eql("");
            expect(mapping.stringify({ value: null })).to.eql("");
            expect(mapping.stringify(null)).to.eql("");
        });
    });

    describe("for string enums", () => {
        it("should parse", () => {
            const mapping: QueryStringMapping<Entiry1> = queryStringMapping<Entiry1>()
                .mapToEnum(x => x.value, "value", { enum1: "enum1", enum2: "enum2" })
                .build();
            expect(mapping.parse("?value=enum1")).to.eql({ value: "enum1" });
            expect(mapping.parse("?value=enum2")).to.eql({ value: "enum2" });
            expect(mapping.parse("?value=")).to.eql({ value: null });
            expect(mapping.parse("?value=zz")).to.eql({ value: null });
            expect(mapping.parse("")).to.eql({ value: null });
        });
    });

    it("should allow skip values", () => {
        const mapping: QueryStringMapping<Entiry1> = queryStringMapping<Entiry1>()
            .mapToDefault(x => x.value, null)
            .build();
        expect(mapping.parse("?value=enum1")).to.eql({ value: null });
        expect(mapping.parse("")).to.eql({ value: null });

        expect(mapping.stringify({ value: "123" })).to.eql("");
    });

    it("should parse and stringify enums", () => {
        const mapping: QueryStringMapping<Entiry1> = queryStringMapping<Entiry1>()
            .mapToEnum(x => x.enumValue, "value", { ["enum1"]: 1, ["enum2"]: 2, ["enum3"]: 3 })
            .build();
        expect(mapping.parse("?value=enum1")).to.eql({ enumValue: 1 });
        expect(mapping.parse("?value=enum2")).to.eql({ enumValue: 2 });
        expect(mapping.parse("?value=Zzz")).to.eql({ enumValue: null });
        expect(mapping.stringify({ enumValue: 1 })).to.eql("?value=enum1");
        expect(mapping.stringify({ enumValue: null })).to.eql("");
        expect(mapping.stringify({ enumValue: 100 } as any)).to.eql("");
    });

    it("should parse and stringify enum sets", () => {
        const mapping: QueryStringMapping<Entiry1> = queryStringMapping<Entiry1>()
            .mapToSet(x => x.enumValues, "value", { ["enum1"]: 1, ["enum2"]: 2, ["enum3"]: 3 })
            .build();
        expect(mapping.parse("?value=enum1+enum2")).to.eql({ enumValues: [1, 2] });
        expect(mapping.parse("?value=enum2")).to.eql({ enumValues: [2] });
        expect(mapping.parse("?value=Zzz")).to.eql({ enumValues: [] });
        expect(mapping.stringify({ enumValues: [1] })).to.eql("?value=enum1");
        expect(mapping.stringify({ enumValues: [1, 3] })).to.eql("?value=enum1+enum3");
        expect(mapping.stringify({ enumValues: [] })).to.eql("");
        expect(mapping.stringify({ enumValues: null })).to.eql("");
        expect(mapping.stringify({ enumValues: [100] } as any)).to.eql("");
    });

    it("should parse and stringify enum sets", () => {
        const mapping: QueryStringMapping<Entiry1> = queryStringMapping<Entiry1>()
            .mapToSet(
                x => x.stringEnumValues,
                "value",
                {
                    ["enum1"]: "enum1",
                    ["enum2"]: "enum2",
                    ["enum3"]: "enum3",
                    ["enum4"]: "enum4",
                    ["enum5"]: "enum5",
                },
                true
            )
            .build();
        expect(mapping.parse("?value=enum1+enum2")).to.eql({ stringEnumValues: ["enum1", "enum2"] });
        expect(mapping.parse("?value=enum2")).to.eql({ stringEnumValues: ["enum2"] });
        expect(mapping.parse("?value=!enum1+enum2")).to.eql({ stringEnumValues: ["enum3", "enum4", "enum5"] });
        expect(mapping.parse("?value=Zzz")).to.eql({ stringEnumValues: [] });

        expect(mapping.stringify({ stringEnumValues: ["enum1"] })).to.eql("?value=enum1");
        expect(mapping.stringify({ stringEnumValues: ["enum1", "enum3"] })).to.eql("?value=enum1+enum3");
        expect(mapping.stringify({ stringEnumValues: ["enum1", "enum2", "enum3"] })).to.eql("?value=%21enum4+enum5");
        expect(mapping.stringify({ stringEnumValues: ["enum1", "enum2", "enum3", "enum4", "enum5"] })).to.eql(
            "?value=%21"
        );
        expect(mapping.stringify({ stringEnumValues: [] })).to.eql("");
        expect(mapping.stringify({ stringEnumValues: null })).to.eql("");
        expect(mapping.stringify({ stringEnumValues: ["blahblah"] } as any)).to.eql("");
    });
});
