import { LocationDescriptor } from "history";
import * as React from "react";
import { NavLink } from "react-router-dom";

import cn from "./RouterLink.less";

export interface RouterLinkWithIconProps {
    icon?: JSX.Element;
    children?: React.ReactNode;
    disabled?: Nullable<boolean>;
    className?: string;
    activeClassName?: string;
    target?: null | string;
    to?: null | LocationDescriptor;
    href?: Nullable<string>;
    onClick?: (event: React.MouseEvent<any>) => any;
    rightIcon?: JSX.Element;
}

export function RouterLink({
    icon,
    children,
    className,
    disabled,
    to,
    href,
    onClick,
    rightIcon,
    ...props
}: RouterLinkWithIconProps): JSX.Element {
    const Comp: any = to == null || disabled ? "a" : NavLink;
    const actionProps = disabled
        ? { href: "#", onClick: (e: React.MouseEvent<any>) => e.preventDefault() }
        : { to: to, href: href == null && onClick != null ? "#" : href, onClick: onClick };
    return (
        <Comp className={cn(className, { disabled: disabled }, "root")} {...props} {...actionProps}>
            {icon}
            {icon && "\u00A0"}
            <span className={cn("content")}>{children}</span>
            {rightIcon && "\u00A0"}
            {rightIcon}
        </Comp>
    );
}
