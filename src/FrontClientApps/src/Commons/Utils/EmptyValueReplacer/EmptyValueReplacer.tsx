import * as React from "react";

import cn from "./EmptyValueReplacer.less";

interface EmptyValueReplacerProps {
    noValueText: string;
    children?: JSX.Element | string | null;
}

export function EmptyValueReplacer({ children, noValueText }: EmptyValueReplacerProps): JSX.Element {
    if (children == null) {
        return <span className={cn("no-value")}>{noValueText}</span>;
    }
    return <span>{children}</span>;
}
