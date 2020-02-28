// Есть вероятность, что затипизировано неполностью и с ошибками,
// ибо типизировался ad-hoc для использований которые были на данный момент в проекте.
// С вопросами обращаться к tihonove
import * as React from "react";

declare interface ComboBoxOldProps<TValue, TInfo> {
    "data-tid"?: string;
    width?: null | string | number;
    placeholder?: null | string;
    disabled?: boolean;
    warning?: boolean;
    error?: boolean;
    source: (searchText: string) => Promise<null | { values: TValue[]; infos: TInfo[] }>;
    value: null | undefined | TValue;
    size?: "medium";
    info?: (value: TValue) => Promise<null | undefined | TInfo>;
    renderValue: (value: TValue, info: TInfo) => React.ReactNode;
    renderItem: (value: TValue, info: TInfo, state: null | undefined | "hover") => React.ReactNode;
    valueToString?: (value: TValue, info: TInfo) => null | undefined | string;
    renderNotFound?: string | ((searchText: string) => React.ReactNode);
    onChange: (
        event: React.SyntheticEvent<any>,
        value: null | undefined | TValue,
        info: null | undefined | TInfo
    ) => void;
    recover?: RecoverFunc | boolean;
    autoFocus?: boolean;
    debounceInterval?: number;
}

type RecoverFunc = (pattern: string) => null | undefined | { value: null | undefined | TValue; info: TInfo };

declare class ComboBoxOld<TValue, TInfo> extends React.Component<ComboBoxOldProps<TValue, TInfo>> {}

export default ComboBoxOld;
