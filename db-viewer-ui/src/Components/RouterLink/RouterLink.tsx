import { Link, type LinkProps } from "@skbkontur/react-ui";
import React from "react";

import { ReactRouterLinkWrapper } from "./ReactRouterLinkWrapper";

interface RouterLinkProps extends LinkProps {
    to: string;
}

export const RouterLink = ({ to, ...props }: RouterLinkProps): React.ReactElement => (
    <Link {...props} href={to} component={ReactRouterLinkWrapper} />
);
