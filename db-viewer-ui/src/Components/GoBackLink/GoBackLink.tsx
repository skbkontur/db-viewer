import React from "react";

import { RouterLink } from "../RouterLink/RouterLink";

import { jsStyles } from "./GoBackLink.styles";

export const GoBackLink = ({ backUrl }: { backUrl?: Nullable<string> }): JSX.Element => (
    <RouterLink data-tid="GoBack" className={jsStyles.goBackLink()} to={backUrl || ""} />
);
