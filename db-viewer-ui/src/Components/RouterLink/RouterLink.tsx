import { Link, type LinkProps } from "@skbkontur/react-ui";
import type { ReactElement } from "react";

import { ReactRouterLinkWrapper } from "./ReactRouterLinkWrapper";

interface RouterLinkProps extends LinkProps {
    to: string;
}

export const RouterLink = ({ to, ...props }: RouterLinkProps): ReactElement => (
    <Link {...props} href={to} component={ReactRouterLinkWrapper} />
);
