// tslint:disable
// TypeScriptContractGenerator's generated content
import { TypesListModel } from './TypesListModel';
import { Object } from './Object';
import { FindModel } from './FindModel';
import { CountModel } from './CountModel';
import { ObjectDetailsModel } from './ObjectDetailsModel';
import { ReadModel } from './ReadModel';
import ApiBase from './../apiBase/ApiBase';

export class DBViewerApiImpl extends ApiBase {
    async getTypes(): Promise<Nullable<TypesListModel>> {
        return this.get(`List`);
    }

    async find(typeIdentifier: Nullable<string>, filter: Nullable<FindModel>): Promise<Nullable<Object[]>> {
        return this.post(`${typeIdentifier}/Find`, {
            ...filter,
        });
    }

    async count(typeIdentifier: Nullable<string>, model: Nullable<CountModel>): Promise<Nullable<number>> {
        return this.post(`${typeIdentifier}/Count`, {
            ...model,
        });
    }

    async read(typeIdentifier: Nullable<string>, filters: Nullable<ReadModel>): Promise<Nullable<ObjectDetailsModel>> {
        return this.post(`${typeIdentifier}/Read`, {
            ...filters,
        });
    }

    async delete(typeIdentifier: Nullable<string>, obj: Nullable<Object>): Promise<void> {
        return this.post(`${typeIdentifier}/Delete`, {
            ...obj,
        });
    }

    async write(typeIdentifier: Nullable<string>, obj: Nullable<Object>): Promise<Nullable<Object>> {
        return this.post(`${typeIdentifier}/Write`, {
            ...obj,
        });
    }

};
export interface IDBViewerApi {
    getTypes(): Promise<Nullable<TypesListModel>>;
    find(typeIdentifier: Nullable<string>, filter: Nullable<FindModel>): Promise<Nullable<Object[]>>;
    count(typeIdentifier: Nullable<string>, model: Nullable<CountModel>): Promise<Nullable<number>>;
    read(typeIdentifier: Nullable<string>, filters: Nullable<ReadModel>): Promise<Nullable<ObjectDetailsModel>>;
    delete(typeIdentifier: Nullable<string>, obj: Nullable<Object>): Promise<void>;
    write(typeIdentifier: Nullable<string>, obj: Nullable<Object>): Promise<Nullable<Object>>;
}
