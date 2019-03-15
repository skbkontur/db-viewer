import { IDBViewerApi } from "./impl/DBViewerApi";

export default class Apis {
  public static businessObjectsListApi: IDBViewerApi;
  public static initialize(businessObjectsListApi: IDBViewerApi) {
    Apis.businessObjectsListApi = businessObjectsListApi;
  }
}
