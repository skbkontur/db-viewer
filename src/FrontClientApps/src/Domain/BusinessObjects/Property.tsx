import { BusinessObjectFieldFilterOperator } from "Domain/Api/DataTypes/BusinessObjectFieldFilterOperator";

export interface PropertyInfo {
    name: string;
    isIdentity: boolean;
    isSearchable: boolean;
    isSortable: boolean;
    isRequired: boolean;
    availableFilters?: null | BusinessObjectFieldFilterOperator[];
}

export interface Property {
    name: string;
    type: Nullable<string>;
    isIdentity: boolean;
    isSearchable: boolean;
    isSortable: boolean;
    isRequired: boolean;
    availableFilters?: null | BusinessObjectFieldFilterOperator[];
}
