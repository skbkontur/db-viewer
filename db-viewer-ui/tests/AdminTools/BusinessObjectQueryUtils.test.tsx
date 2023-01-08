import { expect } from "chai";

import { ObjectFieldFilterOperator } from "../../src/Domain/Api/DataTypes/ObjectFieldFilterOperator";
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
        expect(ObjectSearchQueryUtils.parse("?sort=path.to.object:asc")).to.eql({
            conditions: null,
            count: null,
            countLimit: null,
            offset: null,
            hiddenColumns: null,
            sort: {
                path: "path.to.object",
                sortOrder: "Ascending",
            },
        });
        expect(ObjectSearchQueryUtils.parse("?sort=path.to.object%3Aasc")).to.eql({
            conditions: null,
            count: null,
            countLimit: null,
            offset: null,
            hiddenColumns: null,
            sort: {
                path: "path.to.object",
                sortOrder: "Ascending",
            },
        });
        expect(ObjectSearchQueryUtils.parse("?sort=path.to.object")).to.eql({
            conditions: null,
            count: null,
            countLimit: null,
            offset: null,
            hiddenColumns: null,
            sort: {
                path: "path.to.object",
                sortOrder: "Descending",
            },
        });
        expect(ObjectSearchQueryUtils.parse("?sort=")).to.eql({
            conditions: null,
            count: null,
            countLimit: null,
            offset: null,
            hiddenColumns: null,
            sort: null,
        });
        expect(ObjectSearchQueryUtils.parse("?sort=  &a=1")).to.eql({
            conditions: [
                {
                    operator: "Equals",
                    path: "a",
                    value: "1",
                },
            ],
            count: null,
            countLimit: null,
            offset: null,
            hiddenColumns: null,
            sort: null,
        });
        expect(ObjectSearchQueryUtils.parse("?sort=x:1")).to.eql({
            conditions: null,
            count: null,
            countLimit: null,
            offset: null,
            hiddenColumns: null,
            sort: {
                path: "x",
                sortOrder: "Descending",
            },
        });
        expect(ObjectSearchQueryUtils.parse("?sort=:asc")).to.eql({
            conditions: null,
            count: null,
            countLimit: null,
            offset: null,
            hiddenColumns: null,
            sort: null,
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
        ).to.eql("?sort=path.to.object%3Aasc");
        expect(
            ObjectSearchQueryUtils.stringify({
                sorts: [],
                conditions: [],
            })
        ).to.eql("");
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
        ).to.eql("");
    });
    it("должен парсить массив значений", () => {
        expect(ObjectSearchQueryUtils.parse("?Box.Id=%3E123")).to.eql({
            conditions: [
                {
                    path: "Box.Id",
                    value: "123",
                    operator: ObjectFieldFilterOperator.GreaterThan,
                },
            ],
            count: null,
            countLimit: null,
            offset: null,
            hiddenColumns: null,
            sort: null,
        });
        expect(ObjectSearchQueryUtils.parse("?Box.Id=%3D123&Box.Gln=%3D456")).to.eql({
            conditions: [
                {
                    path: "Box.Id",
                    value: "123",
                    operator: ObjectFieldFilterOperator.Equals,
                },
                {
                    path: "Box.Gln",
                    value: "456",
                    operator: ObjectFieldFilterOperator.Equals,
                },
            ],
            count: null,
            countLimit: null,
            offset: null,
            hiddenColumns: null,
            sort: null,
        });
        expect(ObjectSearchQueryUtils.parse("?Box.Id=%3E123&Box.Gln=%3C321")).to.eql({
            conditions: [
                {
                    path: "Box.Id",
                    value: "123",
                    operator: ObjectFieldFilterOperator.GreaterThan,
                },
                {
                    path: "Box.Gln",
                    value: "321",
                    operator: ObjectFieldFilterOperator.LessThan,
                },
            ],
            sort: null,
            count: null,
            countLimit: null,
            offset: null,
            hiddenColumns: null,
        });
        expect(ObjectSearchQueryUtils.parse("?offset=20")).to.eql({
            count: null,
            countLimit: null,
            offset: 20,
            hiddenColumns: null,
            sort: null,
            conditions: null,
        });
        expect(
            ObjectSearchQueryUtils.parse(
                "?offset=20&count=100&sort=Box.Id:asc&Box.Id=%3E10&LastModificationDateTime=%3E%3D10"
            )
        ).to.eql({
            count: 100,
            countLimit: null,
            offset: 20,
            hiddenColumns: null,
            sort: {
                path: "Box.Id",
                sortOrder: "Ascending",
            },
            conditions: [
                {
                    path: "Box.Id",
                    value: "10",
                    operator: "GreaterThan",
                },
                {
                    path: "LastModificationDateTime",
                    value: "10",
                    operator: "GreaterThanOrEquals",
                },
            ],
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
                conditions: [
                    {
                        path: "Box.Id",
                        value: "10",
                        operator: ObjectFieldFilterOperator.GreaterThan,
                    },
                    {
                        path: "LastModificationDateTime",
                        value: "10",
                        operator: ObjectFieldFilterOperator.GreaterThanOrEquals,
                    },
                ],
            })
        ).to.eql("?count=100&offset=20&sort=Box.Id%3Aasc&Box.Id=%3E10&LastModificationDateTime=%3E%3D10");
        expect(
            ObjectSearchQueryUtils.stringify({
                count: 20,
                offset: 1580,
                conditions: [
                    {
                        path: "Box.Gln",
                        value: "10",
                        operator: ObjectFieldFilterOperator.LessThan,
                    },
                    {
                        path: "LastModificationDateTime",
                        value: "13263165",
                        operator: ObjectFieldFilterOperator.LessThanOrEquals,
                    },
                ],
            })
        ).to.eql("?count=20&offset=1580&Box.Gln=%3C10&LastModificationDateTime=%3C%3D13263165");
    });
});
