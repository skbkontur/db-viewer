import * as React from "react";

import cn from "./layout.less";

interface FixedProps {
    "data-tid"?: Nullable<string>;
    tag?: string | React.ComponentType<any>;
    className?: string;
    children?: any;
    style?: {};
    width: number;
    allowWrap?: boolean;
    onClick?: () => void;
}

export function Fixed({ tag, children, width, className, style, allowWrap, ...rest }: FixedProps): JSX.Element {
    const TagComponent = tag || "div";
    return (
        <TagComponent
            className={cn("fixed", { "no-overflow": !allowWrap }, className)}
            style={{ ...style, width: width }}
            {...rest}>
            {children}
        </TagComponent>
    );
}
