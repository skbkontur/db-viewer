import * as React from "react";

import cn from "./layout.less";

interface FillProps {
    tag?: string | React.ComponentType<any>;
    className?: string;
    children?: any;
}

export function Fill({ tag, children, className, ...rest }: FillProps): JSX.Element {
    const TagComponent = tag || "div";
    return (
        <TagComponent className={cn("fill", className)} {...rest}>
            {children}
        </TagComponent>
    );
}
