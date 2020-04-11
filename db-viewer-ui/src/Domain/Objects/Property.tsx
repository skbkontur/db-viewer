import { ObjectFieldFilterOperator } from "../Api/DataTypes/ObjectFieldFilterOperator";

export interface PropertyInfo {
    name: string;
    isIdentity: boolean;
    isSearchable: boolean;
    isSortable: boolean;
    isRequired: boolean;
    availableFilters: ObjectFieldFilterOperator[];
    availableValues: string[];
}

export interface Property {
    name: string;
    type: Nullable<string>;
    isIdentity: boolean;
    isSearchable: boolean;
    isSortable: boolean;
    isRequired: boolean;
    availableFilters: ObjectFieldFilterOperator[];
    availableValues: string[];
}
