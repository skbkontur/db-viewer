import { ThemeContext } from "@skbkontur/react-ui";
import { Theme } from "@skbkontur/react-ui/lib/theming/Theme";
import React from "react";
import { useRouteMatch } from "react-router-dom";

import { RouteUtils } from "../../Domain/Utils/RouteUtils";
import { RouterLink } from "../RouterLink/RouterLink";

import { jsStyles } from "./ObjectTypes.styles";

interface ObjectIdentifierProps {
    identifier: string;
    keywords: string[];
}

interface ObjectLinkInternalProps extends ObjectIdentifierProps {
    theme: Theme;
}

function ObjectLinkInternal({ identifier, keywords, theme }: ObjectLinkInternalProps) {
    if (keywords.length === 0) {
        return <>{identifier}</>;
    }

    const [first, ...rest] = keywords;
    if (identifier.includes(first)) {
        const splitByKeyword = identifier.split(first);
        return (
            <>
                {splitByKeyword.map((item, i) => (
                    <React.Fragment key={item}>
                        {<ObjectLinkInternal identifier={item} keywords={rest} theme={theme} />}
                        {i < splitByKeyword.length - 1 && <span className={jsStyles.mutedKeyword(theme)}>{first}</span>}
                    </React.Fragment>
                ))}
            </>
        );
    }
    return <ObjectLinkInternal identifier={identifier} keywords={rest} theme={theme} />;
}

export function ObjectLink({ identifier, keywords }: ObjectIdentifierProps) {
    const theme = React.useContext(ThemeContext);
    const match = useRouteMatch();
    return (
        <div data-tid="ObjectItem">
            <RouterLink to={RouteUtils.goTo(match.url, identifier)} data-tid="ObjectLink">
                <ObjectLinkInternal identifier={identifier} keywords={keywords} theme={theme} />
            </RouterLink>
        </div>
    );
}
