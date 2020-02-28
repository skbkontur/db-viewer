import { expect } from "chai";
import { lowercaseObject } from "utils";

describe("utils", () => {
    describe("lowercaseObject", () => {
        it("simple object", async () => {
            expect(lowercaseObject({ Key: 1 })).to.deep.equal({ key: 1 });
        });
        it("nested object", async () => {
            expect(lowercaseObject({ Key: { InnerKey: 1 } })).to.deep.equal({ key: { innerKey: 1 } });
        });
        it("array of objects", async () => {
            expect(lowercaseObject([{ Key: { InnerKey: 1 } }])).to.deep.equal([{ key: { innerKey: 1 } }]);
        });
        it("array as a key", async () => {
            expect(lowercaseObject({ Key: [{ InnerKey: 1 }] })).to.deep.equal({ key: [{ innerKey: 1 }] });
        });
    });
});
