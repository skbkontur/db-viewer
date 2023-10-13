import { describe, it, expect } from "vitest";

import { ObjectFilterSortOrder } from "../../src/Domain/Api/DataTypes/ObjectFilterSortOrder";
import { ObjectSearchQuery } from "../../src/Domain/Objects/ObjectSearchQuery";
import { ObjectSearchQueryMapping } from "../../src/Domain/Objects/ObjectSearchQueryMapping";

class ObjectSearchQueryUtils {
    public static parse(search: Nullable<string>): ObjectSearchQuery {
        return ObjectSearchQueryMapping.parse(search ?? "", []);
    }

    public static stringify(query: Partial<ObjectSearchQuery>): Nullable<string> {
        return ObjectSearchQueryMapping.stringify(
            {
                conditions: [],
                sorts: [],
                count: 20,
                offset: 0,
                hiddenColumns: [],
                ...query,
            },
            []
        );
    }
}
describe("ObjectSearchQueryUtilsTest", () => {
    it("должен парсить сортировку в простых случаях", () => {
        expect(ObjectSearchQueryUtils.parse("?sorts=path.to.object:asc")).to.eql({
            conditions: [],
            count: 20,
            offset: 0,
            hiddenColumns: [],
            sorts: [
                {
                    path: "path.to.object",
                    sortOrder: "Ascending",
                },
            ],
        });
        expect(ObjectSearchQueryUtils.parse("?sorts=path.to.object%3Aasc")).to.eql({
            conditions: [],
            count: 20,
            offset: 0,
            hiddenColumns: [],
            sorts: [
                {
                    path: "path.to.object",
                    sortOrder: "Ascending",
                },
            ],
        });
        expect(ObjectSearchQueryUtils.parse("?sorts=path.to.object")).to.eql({
            conditions: [],
            count: 20,
            offset: 0,
            hiddenColumns: [],
            sorts: [
                {
                    path: "path.to.object",
                    sortOrder: "Descending",
                },
            ],
        });
        expect(ObjectSearchQueryUtils.parse("?sorts=")).to.eql({
            conditions: [],
            count: 20,
            offset: 0,
            hiddenColumns: [],
            sorts: [],
        });
        expect(ObjectSearchQueryUtils.parse("?sorts=  &a=1")).to.eql({
            conditions: [],
            count: 20,
            offset: 0,
            hiddenColumns: [],
            sorts: [],
        });
        expect(ObjectSearchQueryUtils.parse("?sorts=x:1")).to.eql({
            conditions: [],
            count: 20,
            offset: 0,
            hiddenColumns: [],
            sorts: [
                {
                    path: "x",
                    sortOrder: "Descending",
                },
            ],
        });
        expect(ObjectSearchQueryUtils.parse("?sorts=:asc")).to.eql({
            conditions: [],
            count: 20,
            offset: 0,
            hiddenColumns: [],
            sorts: [
                {
                    path: "",
                    sortOrder: "Ascending",
                },
            ],
        });
    });
    it("должен переводить в строку", () => {
        expect(
            ObjectSearchQueryUtils.stringify({
                sorts: [
                    {
                        path: "path.to.object",
                        sortOrder: ObjectFilterSortOrder.Ascending,
                    },
                ],
                conditions: [],
            })
        ).to.eql("?sorts=path.to.object%3Aasc");
        expect(
            ObjectSearchQueryUtils.stringify({
                sorts: [],
                conditions: [],
            })
        ).to.eql("?");
        expect(
            ObjectSearchQueryUtils.stringify({
                sorts: [
                    {
                        path: "null",
                        sortOrder: ObjectFilterSortOrder.Ascending,
                    },
                ],
                conditions: [],
            })
        ).to.eql("?sorts=null%3Aasc");
    });
    it("должен парсить массив значений", () => {
        expect(ObjectSearchQueryUtils.parse("?Box.Id=%3E123")).to.eql({
            conditions: [],
            count: 20,
            offset: 0,
            sorts: [],
            hiddenColumns: [],
        });
        expect(ObjectSearchQueryUtils.parse("?Box.Id=%3D123&Box.Gln=%3D456")).to.eql({
            conditions: [],
            count: 20,
            offset: 0,
            sorts: [],
            hiddenColumns: [],
        });
        expect(ObjectSearchQueryUtils.parse("?Box.Id=%3E123&Box.Gln=%3C321")).to.eql({
            conditions: [],
            count: 20,
            offset: 0,
            sorts: [],
            hiddenColumns: [],
        });
        expect(ObjectSearchQueryUtils.parse("?offset=20")).to.eql({
            conditions: [],
            count: 20,
            offset: 20,
            sorts: [],
            hiddenColumns: [],
        });
        expect(
            ObjectSearchQueryUtils.parse(
                "?offset=20&count=100&sort=Box.Id:asc&Box.Id=%3E10&LastModificationDateTime=%3E%3D10"
            )
        ).to.eql({
            count: 100,
            offset: 20,
            hiddenColumns: [],
            sorts: [],
            conditions: [],
        });
    });
    it("должен переводить в строку объект", () => {
        expect(
            ObjectSearchQueryUtils.stringify({
                count: 100,
                offset: 20,
                sorts: [
                    {
                        path: "Box.Id",
                        sortOrder: ObjectFilterSortOrder.Ascending,
                    },
                ],
                conditions: [],
            })
        ).to.eql("?sorts=Box.Id%3Aasc&count=100&offset=20");
        expect(
            ObjectSearchQueryUtils.stringify({
                count: 100,
                offset: 20,
                conditions: [],
            })
        ).to.eql("?count=100&offset=20");
    });
});
