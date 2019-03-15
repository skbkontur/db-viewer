import { IDataBaseViewerApi } from "./impl/DataBaseViewerApi";

export default class Apis {
  public static businessObjectsListApi: IDataBaseViewerApi;
  public static initialize(businessObjectsListApi: IDataBaseViewerApi) {
    Apis.businessObjectsListApi = businessObjectsListApi;
  }
}
