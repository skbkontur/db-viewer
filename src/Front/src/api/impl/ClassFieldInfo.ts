// tslint:disable
// TypeScriptContractGenerator's generated content
import { FieldType } from './FieldType';
import { FieldInfo } from './FieldInfo';
import { FieldMeta } from './FieldMeta';

export type ClassFieldInfo = {
    type: FieldType.Class;
    fields: Nullable<{
        [key: string]: FieldInfo;
    }>;
    meta: Nullable<FieldMeta>;
};
