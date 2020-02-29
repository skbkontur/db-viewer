import * as React from "react";

import cn from "./layout.less";

interface FitProps {
    tag?: string | React.ComponentType<any>;
    className?: string;
    children?: React.ReactNode;
    nextGap?: Nullable<number>;
    style?: any;
    title?: null | string;
    htlmFor?: null | string;
    onClick?: (e: React.MouseEvent<any>) => any;
}

export function Fit({ tag, nextGap, className, children, ...rest }: FitProps): JSX.Element {
    const TagComponent = tag || "div";
    const gapClassName = nextGap != null ? "next-gap-" + nextGap.toString() : null;
    return (
        <TagComponent className={cn(className, "fit", gapClassName)} {...rest}>
            {children}
        </TagComponent>
    );
}
