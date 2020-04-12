import { Condition } from "../Api/DataTypes/Condition";
import { Sort } from "../Api/DataTypes/Sort";

export interface ObjectSearchQuery {
    conditions: Condition[];
    sort: Nullable<Sort>;
    count: number;
    offset: number;
    hiddenColumns: string[];
}
