// tslint:disable
// TypeScriptContractGenerator's generated content
import { Filter } from './Filter';
import { Sort } from './Sort';

export type FindModel = {
    filters: Nullable<Filter[]>;
    sorts: Nullable<Sort[]>;
    from: number;
    count: number;
};
