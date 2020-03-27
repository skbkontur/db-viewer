import { BusinessObjectsApiImpl } from "Domain/Api/BusinessObjectsApi";

const businessObjectsApiPrefix = "/business-objects/";

export const businessObjectsApi =
    process.env.API === "fake"
        ? new (require("./BusinessObjectsApiFake").BusinessObjectsApiFake)()
        : new BusinessObjectsApiImpl(businessObjectsApiPrefix);
