import { ObjectFieldFilterOperator } from "../Api/DataTypes/ObjectFieldFilterOperator";

export interface PropertyInfo {
    name: string;
    isIdentity: boolean;
    isSearchable: boolean;
    isSortable: boolean;
    isRequired: boolean;
    availableFilters?: null | ObjectFieldFilterOperator[];
}

export interface Property {
    name: string;
    type: Nullable<string>;
    isIdentity: boolean;
    isSearchable: boolean;
    isSortable: boolean;
    isRequired: boolean;
    availableFilters?: null | ObjectFieldFilterOperator[];
}
