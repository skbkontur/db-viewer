import { Condition } from "Domain/Api/DataTypes/Condition";
import { Sort } from "Domain/Api/DataTypes/Sort";

export interface BusinessObjectSearchQuery {
    conditions: Nullable<Condition[]>;
    sort: Nullable<Sort>;
    count: number;
    offset: number;
    hiddenColumns: string[];
}
