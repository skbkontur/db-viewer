import { Dispatch } from "react-redux";
import { ThunkAction } from "redux-thunk";
import Apis from "../../api/Apis";
import { TypeModel } from "../../api/impl/TypeModel";

export enum BusinessObjectsTypesListActionType {
  Success = "BusinessObjectsTypesList/Success",
  Fail = "BusinessObjectsTypesList/Fail",
  ChangeSearchString = "BusinessObjectsTypesList/ChangeSearchString",
}

export interface ISuccess {
  type: BusinessObjectsTypesListActionType.Success;
  list: TypeModel[];
}

export interface IFail {
  type: BusinessObjectsTypesListActionType.Fail;
}

export interface IChangeSearchString {
  type: BusinessObjectsTypesListActionType.ChangeSearchString;
  searchString: string;
}

export type TypesListPayload = ISuccess | IFail | IChangeSearchString;

export default class TypesListActions {
  public static load(): ThunkAction<
    Promise<void>,
    null,
    null,
    TypesListPayload
  > {
    return async (dispatch: Dispatch<TypesListPayload>) => {
      try {
        const result = await Apis.businessObjectsListApi.getTypes();
        dispatch({
          type: BusinessObjectsTypesListActionType.Success,
          list: result.types,
        });
      } catch (e) {
        console.error(e);
        dispatch({ type: BusinessObjectsTypesListActionType.Fail });
      }
    };
  }

  public static changeSearchString(searchString: string): IChangeSearchString {
    return {
      type: BusinessObjectsTypesListActionType.ChangeSearchString,
      searchString,
    };
  }
}
