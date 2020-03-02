import { expect } from "chai";

import { ticksToTimestamp, timestampToTicks } from "Domain/Utils/ConvertTimeUtil";

describe("convert", () => {
    describe("common converts", () => {
        it("должен конвертировать строку даты в тики", () => {
            const date = "2017-09-07T12:15:05.3050139Z";
            expect(timestampToTicks(date)).to.eql("636403833053050139");
        });
        it("должен конвертировать строку даты в тики", () => {
            expect(timestampToTicks("2017-09-07T12:15:05.3336641Z")).to.eql("636403833053336641");
            expect(timestampToTicks("2017-10-02T10:25:05.3618488Z")).to.eql("636425367053618488");
            expect(timestampToTicks("2017-10-02T10:25:05.361Z")).to.eql("636425367053610000");
        });
        it("должен конвертировать тики в дату", () => {
            const date = "636403833053336641";
            expect(ticksToTimestamp(date)).to.eql(new Date("2017-09-07T12:15:05.3336641Z"));
        });
    });
});
