import { ThemeContext } from "@skbkontur/react-ui";
import React from "react";
import { Link } from "react-router-dom";

import { jsStyles } from "./RouterLink.styles";

interface RouterLinkProps {
    to: string;
    children: React.ReactNode;
}

export function RouterLink({ to, children }: RouterLinkProps) {
    const theme = React.useContext(ThemeContext);
    return (
        <Link className={jsStyles.routerLink(theme)} to={to}>
            {children}
        </Link>
    );
}
