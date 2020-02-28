import { delay } from "Commons/Utils/PromiseUtils";
import { Guid } from "Domain/EDI/DataTypes/Guid";
import { BusinessObject } from "Domain/EDI/Api/AdminTools/DataTypes/BusinessObject";
import { BusinessObjectStorageType } from "Domain/EDI/Api/AdminTools/DataTypes/BusinessObjectStorageType";
import { SearchResult } from "Domain/EDI/Api/AdminTools/DataTypes/SearchResult";

import { Object } from "../../Object";

import { IBusinessObjectsApi } from "./BusinessObjectsApi";
import { BusinessObjectDescription } from "./DataTypes/BusinessObjectDescription";
import { BusinessObjectSearchRequest } from "./DataTypes/BusinessObjectSearchRequest";
import { FileResponse } from "./DataTypes/FileResponse";
import { UpdateBusinessObjectInfo } from "./DataTypes/UpdateBusinessObjectInfo";

export class BusinessObjectsApiFake implements IBusinessObjectsApi {
    public async getBusinessObjectNames(): Promise<BusinessObjectDescription[]> {
        await delay(3000);
        return [];
    }

    public async getBusinessObjectsCount(
        businessObjectIdentifier: string,
        query: BusinessObjectSearchRequest
    ): Promise<SearchResult<BusinessObject>> {
        await delay(3000);
        return {
            countLimit: 100000,
            count: 0,
            items: [],
        };
    }

    public async startDownloadBusinessObjects(
        businessObjectIdentifier: string,
        query: BusinessObjectSearchRequest,
        excludedFields: string[]
    ): Promise<Guid> {
        await delay(3000);
        return "00000000-0000-0000-0000-000000000000";
    }

    public async getBusinessObjectsDownloadStatus(
        businessObjectIdentifier: string,
        exportationId: Guid
    ): Promise<boolean> {
        await delay(3000);
        return true;
    }

    public async findBusinessObjects(
        businessObjectIdentifier: string,
        query: BusinessObjectSearchRequest,
        offset: number,
        count: number
    ): Promise<SearchResult<BusinessObject>> {
        await delay(3000);
        return {
            countLimit: 1000,
            count: 0,
            items: [],
        };
    }

    public async getBusinessObjects(businessObjectIdentifier: string, scopeId: string, id: string): Promise<Object> {
        await delay(3000);
        return {};
    }

    public async getBusinessArrayObject(
        businessObjectIdentifier: string,
        scopeId: string,
        id: string,
        arrayIndex: string
    ): Promise<Object> {
        await delay(3000);
        return {};
    }

    public async getBusinessObjectMeta(businessObjectIdentifier: string): Promise<BusinessObjectDescription> {
        await delay(3000);
        return {
            identifier: "a",
            storageType: BusinessObjectStorageType.SingleObjectPerRow,
        };
    }

    public async deleteBusinessObjects(businessObjectIdentifier: string, scopeId: string, id: string): Promise<void> {
        await delay(100);
    }

    public async deleteBusinessArrayObject(
        businessObjectIdentifier: string,
        scopeId: string,
        id: string,
        arrayIndex: string
    ): Promise<void> {
        await delay(300);
    }

    public async updateBusinessObjects(
        businessObjectIdentifier: string,
        scopeId: string,
        id: string,
        updateInfo: UpdateBusinessObjectInfo
    ): Promise<void> {
        await delay(300);
    }

    public async updateBusinessArrayObject(
        businessObjectIdentifier: string,
        scopeId: string,
        id: string,
        arrayIndex: string,
        updateInfo: UpdateBusinessObjectInfo
    ): Promise<void> {
        await delay(300);
    }

    public async downloadBusinessObjects(businessObjectIdentifier: string, exportationId: Guid): Promise<FileResponse> {
        return { isInlineAttachment: false };
    }
}
