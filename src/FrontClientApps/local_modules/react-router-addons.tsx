import * as React from "react";
import { Redirect as ReactRouterRedirect, Route } from "react-router-dom";

interface RedirectProps {
    exact?: boolean;
    strict?: boolean;
    from: string;
    to: string;
}

export function RedirectWithParams(props: RedirectProps): JSX.Element {
    const { from, to, ...rest } = props;

    if (!from) {
        return <ReactRouterRedirect {...props} />;
    }

    return (
        <Route
            path={from}
            render={({ match }) => {
                const paramKeys = Object.keys(match.params);

                const toWithReplacedParamsKeys = paramKeys.reduce((url, key) => {
                    if (match.params[key] != null) {
                        return url.replace(`:${key}`, match.params[key]);
                    }
                    return url;
                }, to);

                return <ReactRouterRedirect to={toWithReplacedParamsKeys} {...rest} />;
            }}
        />
    );
}
