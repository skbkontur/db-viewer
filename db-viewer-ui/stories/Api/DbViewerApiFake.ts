/* eslint-disable @typescript-eslint/no-unused-vars */
import { CountResult } from "../../src/Domain/Api/DataTypes/CountResult";
import { ObjectDescription } from "../../src/Domain/Api/DataTypes/ObjectDescription";
import { ObjectDetails } from "../../src/Domain/Api/DataTypes/ObjectDetails";
import { ObjectIdentifier } from "../../src/Domain/Api/DataTypes/ObjectIdentifier";
import { ObjectSearchRequest } from "../../src/Domain/Api/DataTypes/ObjectSearchRequest";
import { SearchResult } from "../../src/Domain/Api/DataTypes/SearchResult";
import { IDbViewerApi } from "../../src/Domain/Api/DbViewerApi";

import boxDetails from "./box-details.json";
import boxMeta from "./box-meta.json";
import boxObjects from "./box-objects.json";

function delay(timeout: number): Promise<void> {
    return new Promise(f => setTimeout(f, timeout));
}

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
        if (objectIdentifier === "NotFound") {
            return { count: 0, countLimit: 10000, items: [] };
        }
        return boxObjects;
    }

    public async readObject(objectIdentifier: string, query: ObjectSearchRequest): Promise<ObjectDetails> {
        if (objectIdentifier === "NotFound") {
            return { meta: boxDetails.meta, object: null! };
        }
        if (objectIdentifier === "Error") {
            throw new Error("Not implemented");
        }
        return boxDetails;
    }

    public async getMeta(objectIdentifier: string): Promise<ObjectDescription> {
        return boxMeta;
    }

    public async deleteObject(objectIdentifier: string, obj: object): Promise<void> {
        // noop
    }

    public async updateObject(objectIdentifier: string, obj: object): Promise<void> {
        // noop
    }

    public async countObjects(objectIdentifier: string, query: ObjectSearchRequest): Promise<CountResult> {
        await delay(5000);
        return {
            count: 100,
            countLimit: 1000,
        };
    }

    public getDownloadObjectsUrl(objectIdentifier: string, query: string): string {
        return "";
    }
}
