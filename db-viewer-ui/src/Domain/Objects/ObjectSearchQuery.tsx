import { Condition } from "../Api/DataTypes/Condition";
import { Sort } from "../Api/DataTypes/Sort";

export interface ObjectSearchQuery {
    conditions: Condition[];
    sorts: Sort[];
    count: number;
    offset: number;
    hiddenColumns: string[];
}
