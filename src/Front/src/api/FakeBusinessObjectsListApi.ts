import { CountModel } from "./impl/CountModel";
import { IDBViewerApi } from "./impl/DBViewerApi";
import { FindModel } from "./impl/FindModel";
import { ObjectDetailsModel } from "./impl/ObjectDetailsModel";
import { ReadModel } from "./impl/ReadModel";
import { TypeModel } from "./impl/TypeModel";
import { TypesListModel } from "./impl/TypesListModel";

export class FakeBusinessObjectsListApi implements IDBViewerApi {
  private _types: TypeModel[];
  public delete(
    _typeIdentifier: Nullable<string>,
    _object: object
  ): Promise<void> {
    return undefined;
  }

  public find(
    _typeIdentifier: Nullable<string>,
    _filter: Nullable<FindModel>
  ): Promise<Nullable<object[]>> {
    return undefined;
  }

  public async getTypes(): Promise<Nullable<TypesListModel>> {
    return {
      types: this._types,
    };
  }

  public read(
    _typeIdentifier: Nullable<string>,
    _filters: Nullable<ReadModel>
  ): Promise<Nullable<ObjectDetailsModel>> {
    return undefined;
  }

  public configureTypes(types: TypeModel[]) {
    this._types = types;
  }

  public write(
    _typeIdentifier: Nullable<string>,
    _obj: Nullable<object>
  ): Promise<object> {
    return undefined;
  }

  public count(
    _typeIdentifier: Nullable<string>,
    _model: Nullable<CountModel>
  ): Promise<Nullable<number>> {
    return undefined;
  }
}
