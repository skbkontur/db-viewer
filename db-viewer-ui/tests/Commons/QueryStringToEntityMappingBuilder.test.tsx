import { expect } from "chai";

import { QueryStringMapping } from "../../src/Domain/QueryStringMapping/QueryStringMapping";
import { QueryStringMappingBuilder } from "../../src/Domain/QueryStringMapping/QueryStringMappingBuilder";

type Enum1 = 1 | 2 | 3;
type Enum2 = "enum1" | "enum2" | "enum3" | "enum4" | "enum5";

interface Entiry1 {
    value?: Nullable<string>;
    numValue?: Nullable<number>;
    boolValue?: Nullable<boolean>;
    enumValue?: Nullable<Enum1>;
    enumValues?: Nullable<Enum1[]>;
    stringEnumValues?: Nullable<Enum2[]>;
}

describe("QueryStringMappingBuilder", () => {
    describe("for number expression", () => {
        it("should parse number", () => {
            const mapping: QueryStringMapping<Entiry1> = new QueryStringMappingBuilder<Entiry1>()
                .mapToInteger(x => x.numValue, "valueExpression")
                .build();
            expect(mapping.parse("?valueExpression=1")).to.eql({ numValue: 1 });
        });

        it("should parse non valid number", () => {
            const mapping: QueryStringMapping<Entiry1> = new QueryStringMappingBuilder<Entiry1>()
                .mapToInteger(x => x.numValue, "valueExpression")
                .build();
            expect(mapping.parse("?valueExpression=wfaeswfawef")).to.eql({ numValue: null });
        });

        it("should parse empty value and fallback to defaut value", () => {
            const mapping: QueryStringMapping<Entiry1> = new QueryStringMappingBuilder<Entiry1>()
                .mapToInteger(x => x.numValue, "valueExpression", 100)
                .build();
            expect(mapping.parse("?valueExpression=")).to.eql({ numValue: 100 });
            expect(mapping.parse("")).to.eql({ numValue: 100 });
        });
    });
});
