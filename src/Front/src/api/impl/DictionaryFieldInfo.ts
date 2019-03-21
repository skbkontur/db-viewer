// tslint:disable
// TypeScriptContractGenerator's generated content
import { FieldType } from './FieldType';
import { FieldInfo } from './FieldInfo';
import { FieldMeta } from './FieldMeta';

export type DictionaryFieldInfo = {
    type: FieldType.Dictionary;
    key: Nullable<FieldInfo>;
    value: Nullable<FieldInfo>;
    meta: Nullable<FieldMeta>;
};
