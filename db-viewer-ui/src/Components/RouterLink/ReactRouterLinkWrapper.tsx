import { LinkProps } from "@skbkontur/react-ui";
import React, { forwardRef } from "react";
import { Link as ReactRouterLink } from "react-router-dom";

export const ReactRouterLinkWrapper = forwardRef<HTMLAnchorElement, LinkProps>(
    ({ href, ...props }, reference): React.ReactElement => (
        <ReactRouterLink {...props} to={href || ""} ref={reference} />
    )
);

ReactRouterLinkWrapper.displayName = "ReactRouterLinkWrapper";
