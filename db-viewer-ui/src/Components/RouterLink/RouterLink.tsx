import { ThemeContext } from "@skbkontur/react-ui";
import React from "react";
import { Link } from "react-router-dom";

import { jsStyles } from "./RouterLink.styles";

interface RouterLinkProps {
    to: string;
    children?: React.ReactNode;
    className?: string;
}

export function RouterLink({ to, children, className }: RouterLinkProps): JSX.Element {
    const theme = React.useContext(ThemeContext);
    return (
        <Link className={`${className} ${jsStyles.routerLink(theme)}`} to={to}>
            {children}
        </Link>
    );
}
