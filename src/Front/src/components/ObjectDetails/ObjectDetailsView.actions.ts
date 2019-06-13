import Toast from "@skbkontur/react-ui/components/Toast/Toast";
import { Dispatch } from "redux";
import { ThunkAction } from "redux-thunk";
import Apis from "../../api/Apis";
import { Filter } from "../../api/impl/Filter";
import { FilterType } from "../../api/impl/FilterType";
import { TypeInfo } from "../../api/impl/TypeInfo";

export enum ObjectDetailsActionTypes {
  LoadStart = "ObjectDetails/LoadStart",
  LoadSuccess = "ObjectDetails/LoadOk",
  LoadFail = "ObjectDetails/LoadFail",
  Clear = "ObjectDetails/Clear",
  DeleteStart = "ObjectDetails/Delete.Start",
  DeleteSuccess = "ObjectDetails/Delete.Success",
  DeleteFail = "ObjectDetails/Delete.Fail",
  SaveStart = "ObjectDetails/Save.Start",
  SaveSuccess = "ObjectDetails/Save.Success",
  SaveFail = "ObjectDetails/Save.Fail",
}

interface ILoadStart {
  type: ObjectDetailsActionTypes.LoadStart;
}

interface ILoadSuccess {
  type: ObjectDetailsActionTypes.LoadSuccess;
  object: any;
  typeInfo: TypeInfo;
}

interface ILoadFail {
  type: ObjectDetailsActionTypes.LoadFail;
}

interface ISaveStart {
  type: ObjectDetailsActionTypes.SaveStart;
}

interface ISaveSuccess {
  type: ObjectDetailsActionTypes.SaveSuccess;
  result: object;
}

interface ISaveFail {
  type: ObjectDetailsActionTypes.SaveFail;
}

interface IClear {
  type: ObjectDetailsActionTypes.Clear;
}

interface IDeleteStart {
  type: ObjectDetailsActionTypes.DeleteStart;
}

interface IDeleteSuccess {
  type: ObjectDetailsActionTypes.DeleteSuccess;
}

interface IDeleteFail {
  type: ObjectDetailsActionTypes.DeleteFail;
}

export type ObjectDetailsPayload =
  | ILoadStart
  | ILoadSuccess
  | ILoadFail
  | IClear
  | ISaveStart
  | ISaveSuccess
  | ISaveFail
  | IDeleteStart
  | IDeleteSuccess
  | IDeleteFail;

export default class ObjectDetailsViewActions {
  public static load(
    typeIdentifier: string,
    searchRequest: IDictionary<any>
  ): ThunkAction<Promise<void>, null, null, ObjectDetailsPayload> {
    return async dispatch => {
      try {
        dispatch({
          type: ObjectDetailsActionTypes.LoadStart,
        });
        const keys = Object.keys(searchRequest);
        const filters: Filter[] = [];
        for (const key of keys) {
          filters.push({
            field: key,
            type: FilterType.Equals,
            value: searchRequest[key],
          });
        }
        const { object, typeInfo } = await Apis.businessObjectsListApi.read(
          typeIdentifier,
          { filters }
        );
        dispatch({
          type: ObjectDetailsActionTypes.LoadSuccess,
          object,
          typeInfo,
        });
      } catch (e) {
        console.error(e);
        dispatch({
          type: ObjectDetailsActionTypes.LoadFail,
        } as ILoadFail);
      }
    };
  }

  public static save(
    typeIdentifier: string,
    object: any
  ): ThunkAction<Promise<boolean>, null, null, ObjectDetailsPayload> {
    return async (dispatch: Dispatch) => {
      dispatch({ type: ObjectDetailsActionTypes.SaveStart });
      try {
        const result = await Apis.businessObjectsListApi.write(
          typeIdentifier,
          object
        );
        dispatch({ type: ObjectDetailsActionTypes.SaveSuccess, result });
        return true;
      } catch (e) {
        console.error(e);
        Toast.push("Не удалось отредактировать объект");
        dispatch({ type: ObjectDetailsActionTypes.SaveFail });
        return false;
      }
    };
  }

  public static delete(
    typeIdentifier: string,
    object: any
  ): ThunkAction<Promise<boolean>, null, null, ObjectDetailsPayload> {
    return async (dispatch: Dispatch<ObjectDetailsPayload>) => {
      dispatch({ type: ObjectDetailsActionTypes.DeleteStart });
      try {
        await Apis.businessObjectsListApi.delete(typeIdentifier, object);
        dispatch({
          type: ObjectDetailsActionTypes.DeleteSuccess,
        });
        return true;
      } catch (e) {
        console.error(e);
        dispatch({ type: ObjectDetailsActionTypes.DeleteFail });
        Toast.push("Не удалось удалить объект");
        return false;
      }
    };
  }

  public static clear(): IClear {
    return {
      type: ObjectDetailsActionTypes.Clear,
    } as IClear;
  }
}
