import { Condition } from "Domain/EDI/Api/AdminTools/DataTypes/Condition";
import { Sort } from "Domain/EDI/Api/AdminTools/DataTypes/Sort";

export interface BusinessObjectSearchQuery {
    conditions: Nullable<Condition[]>;
    sort: Nullable<Sort>;
    count: number;
    offset: number;
    hiddenColumns: string[];
}
