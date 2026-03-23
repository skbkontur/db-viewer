import { LinkProps } from "@skbkontur/react-ui";
import { forwardRef, type ReactElement } from "react";
import { Link as ReactRouterLink } from "react-router-dom";

export const ReactRouterLinkWrapper = forwardRef<HTMLAnchorElement, LinkProps>(
    ({ href, ...props }, reference): ReactElement => <ReactRouterLink {...props} to={href || ""} ref={reference} />
);

ReactRouterLinkWrapper.displayName = "ReactRouterLinkWrapper";
