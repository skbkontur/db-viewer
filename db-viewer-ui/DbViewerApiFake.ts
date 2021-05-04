/* eslint-disable @typescript-eslint/no-unused-vars */
import { CountResult } from "./src/Domain/Api/DataTypes/CountResult";
import { ObjectDescription } from "./src/Domain/Api/DataTypes/ObjectDescription";
import { ObjectDetails } from "./src/Domain/Api/DataTypes/ObjectDetails";
import { ObjectFieldFilterOperator } from "./src/Domain/Api/DataTypes/ObjectFieldFilterOperator";
import { ObjectIdentifier } from "./src/Domain/Api/DataTypes/ObjectIdentifier";
import { ObjectSearchRequest } from "./src/Domain/Api/DataTypes/ObjectSearchRequest";
import { SearchResult } from "./src/Domain/Api/DataTypes/SearchResult";
import { TypeMetaInformation } from "./src/Domain/Api/DataTypes/TypeMetaInformation";
import { IDbViewerApi } from "./src/Domain/Api/DbViewerApi";

const string: TypeMetaInformation = {
    genericTypeArguments: [],
    isNullable: false,
    isArray: false,
    properties: [],
    typeName: "String",
    originalTypeName: "String",
};

export class DbViewerApiFake implements IDbViewerApi {
    public async getNames(): Promise<ObjectIdentifier[]> {
        const schema = {
            schemaName: "schema",
            allowReadAll: true,
            countLimit: 10000,
            allowDownload: true,
            allowDelete: true,
            allowEdit: true,
            allowSort: true,
            downloadLimit: 100000,
            countLimitForSuperUser: 1000,
            downloadLimitForSuperUser: 10000,
        };
        return [
            {
                identifier: "FileMetaInformation2",
                schemaDescription: schema,
            },
            {
                identifier: "Party2",
                schemaDescription: schema,
            },
            {
                identifier: "UserObject",
                schemaDescription: schema,
            },
            {
                identifier: "UserLastLoginRecordObject",
                schemaDescription: schema,
            },
            {
                identifier: "FtpUser",
                schemaDescription: schema,
            },
            {
                identifier: "PartySettings",
                schemaDescription: schema,
            },
            {
                identifier: "DiadocEventStorageElement",
                schemaDescription: schema,
            },
        ];
    }

    public async searchObjects(objectIdentifier: string, query: ObjectSearchRequest): Promise<SearchResult> {
        return {
            items: [
                {
                    id: "b07a756e-f201-4a27-abdd-6503a33c95e9",
                    scopeId: "00958686-1a7f-496a-94fc-ef81466737b1",
                    lastModificationDateTime: "2015-03-05T09:55:59.9987979Z",
                },
                {
                    id: "1db2a7b7-3c2d-46e9-86fe-ecefe8ccf16e",
                    scopeId: "02ab3381-314b-4744-8d82-14cb4d139c02",
                    lastModificationDateTime: "2017-09-11T13:07:46.9146684Z",
                },
                {
                    id: "ff582d35-4263-4510-b0a8-6b8ea65a29f2",
                    scopeId: "035ccbbc-a85a-42b8-9dfe-ab5b1e9f98b1",
                    lastModificationDateTime: "2016-11-18T05:07:14.0291187Z",
                },
                {
                    id: "e7ba4f80-b774-45e6-a04c-b248e544ad0b",
                    scopeId: "0435e865-131a-465d-a806-b3437aa6a97c",
                    lastModificationDateTime: "2016-10-26T13:07:10.3976841Z",
                },
                {
                    id: "bbe82eec-c9b4-43b8-839f-533fc1f750cd",
                    scopeId: "071fd791-b5a4-4b44-a07c-4612c994578c",
                    lastModificationDateTime: "2015-05-08T07:42:43.0991275Z",
                },
                {
                    id: "d2aa787a-69ea-470d-b0e5-fc4f862538eb",
                    scopeId: "0ac19284-dad9-4939-b67c-9ee87eb462de",
                    lastModificationDateTime: "2017-06-20T12:20:45.841092Z",
                },
                {
                    id: "99778ea7-d94f-46ed-8e9e-0ad521bd6e45",
                    scopeId: "0ac65100-3bfd-47c4-9fef-b3ee0510507b",
                    lastModificationDateTime: "2019-11-08T08:44:22.9635614Z",
                },
                {
                    id: "68e729aa-8eb7-4650-95b8-f65bcdbbb975",
                    scopeId: "0b139a72-b078-40e2-82b4-e54a9a7d71c8",
                    lastModificationDateTime: "2019-02-27T06:37:44.853522Z",
                },
                {
                    id: "3821a146-bf0d-4ca4-b69e-ebc6365582da",
                    scopeId: "0ba4bc7f-1137-44ab-b4e7-9a6181b964f4",
                    lastModificationDateTime: "2015-06-23T09:28:39.1870521Z",
                },
            ],
            count: 194,
            countLimit: 50000,
        };
    }

    public async readObject(objectIdentifier: string, query: ObjectSearchRequest): Promise<ObjectDetails> {
        return {
            meta: {
                identifier: "",
                schemaDescription: {
                    schemaName: "",
                    downloadLimit: 1000,
                    countLimit: 100,
                    allowReadAll: true,
                    allowEdit: true,
                    allowDelete: true,
                    allowSort: true,
                    countLimitForSuperUser: 1000,
                    downloadLimitForSuperUser: 10000,
                },
                typeMetaInformation: string,
            },
            object: {
                id: "3821a146-bf0d-4ca4-b69e-ebc6365582da",
                scopeId: "0ba4bc7f-1137-44ab-b4e7-9a6181b964f4",
                lastModificationDateTime: "2015-06-23T09:28:39.1870521Z",
            },
        };
    }

    public async getMeta(objectIdentifier: string): Promise<ObjectDescription> {
        return {
            identifier: "StatusReportDocumentSubscription",
            schemaDescription: {
                allowReadAll: true,
                allowEdit: true,
                allowDelete: true,
                allowSort: true,
                countLimit: 10,
                downloadLimit: 100,
                schemaName: "Schema",
                countLimitForSuperUser: 1000,
                downloadLimitForSuperUser: 10000,
            },
            typeMetaInformation: {
                typeName: "StatusReportDocumentSubscriptionObject",
                originalTypeName: "StatusReportDocumentSubscriptionObject",
                isArray: false,
                isNullable: false,
                genericTypeArguments: [],
                properties: [
                    {
                        name: "Id",
                        isIdentity: true,
                        isEditable: true,
                        isRequired: true,
                        isSearchable: true,
                        isSortable: false,
                        availableValues: [],
                        availableFilters: [ObjectFieldFilterOperator.Equals, ObjectFieldFilterOperator.DoesNotEqual],
                        type: {
                            typeName: "String",
                            originalTypeName: "String",
                            isArray: false,
                            isNullable: false,
                            properties: [],
                            genericTypeArguments: [],
                        },
                    },
                    {
                        name: "ScopeId",
                        isEditable: true,
                        isIdentity: true,
                        isRequired: true,
                        isSearchable: true,
                        isSortable: false,
                        availableValues: [],
                        availableFilters: [ObjectFieldFilterOperator.Equals, ObjectFieldFilterOperator.DoesNotEqual],
                        type: {
                            typeName: "String",
                            originalTypeName: "String",
                            isArray: false,
                            isNullable: false,
                            properties: [],
                            genericTypeArguments: [],
                        },
                    },
                    {
                        name: "LastModificationDateTime",
                        isIdentity: true,
                        isEditable: true,
                        isRequired: true,
                        isSearchable: true,
                        isSortable: false,
                        availableValues: [],
                        availableFilters: [ObjectFieldFilterOperator.Equals, ObjectFieldFilterOperator.DoesNotEqual],
                        type: {
                            typeName: "Nullable",
                            originalTypeName: "Nullable",
                            isArray: true,
                            isNullable: false,
                            properties: [],
                            genericTypeArguments: [
                                {
                                    typeName: "DateTime",
                                    originalTypeName: "DateTime",
                                    isArray: false,
                                    isNullable: false,
                                    properties: [],
                                    genericTypeArguments: [],
                                },
                            ],
                        },
                    },
                ],
            },
        };
    }

    public async deleteObject(objectIdentifier: string, obj: object): Promise<void> {
        // noop
    }

    public async updateObject(objectIdentifier: string, obj: object): Promise<void> {
        // noop
    }

    public async countObjects(objectIdentifier: string, query: ObjectSearchRequest): Promise<CountResult> {
        return {
            count: 100,
            countLimit: 1000,
        };
    }

    public getDownloadObjectsUrl(objectIdentifier: string, query: string): string {
        return "";
    }
}
