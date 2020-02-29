import { createApiProvider, createWithApiWrapper } from "Commons/ApiInjection";
import { BusinessObjectsApiImpl, IBusinessObjectsApi } from "Domain/Api/BusinessObjectsApi";
import { Guid } from "Domain/DataTypes/Guid";

const businessObjectsApiPrefix = "/business-objects/";

export class BusinessObjectsApiUrls {
    public static getUrlForDownloadBusinessObjects(businessObjectIdentifier: string, exportationId: Guid): string {
        return new BusinessObjectsApiImpl(businessObjectsApiPrefix).getUrl(
            `${businessObjectsApiPrefix}{businessObjectIdentifier}/download/{exportationId}`,
            {
                ["businessObjectIdentifier"]: businessObjectIdentifier,
                ["exportationId"]: exportationId,
            }
        );
    }
}

export interface BusinessObjectsApiProps {
    businessObjectsApi: IBusinessObjectsApi;
}

export const withBusinessObjectsApi = createWithApiWrapper<BusinessObjectsApiProps>(["businessObjectsApi"]);
export const BusinessObjectsApiProvider = createApiProvider<BusinessObjectsApiProps>(["businessObjectsApi"]);
export const businessObjectsApi =
    process.env.API === "fake"
        ? // tslint:disable-next-line:no-require-imports
          new (require("./BusinessObjectsApiFake")).BusinessObjectsApiFake()
        : new BusinessObjectsApiImpl(businessObjectsApiPrefix);
