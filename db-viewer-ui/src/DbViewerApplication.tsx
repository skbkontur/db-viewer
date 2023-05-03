import React from "react";
import { Route, Switch } from "react-router";
import { useRouteMatch } from "react-router-dom";

import { ObjectDetailsContainer } from "./Containers/ObjectDetailsContainer";
import { ObjectTableContainer } from "./Containers/ObjectTableContainer";
import { ObjectTypesContainer } from "./Containers/ObjectTypesContainer";
import { IDbViewerApi } from "./Domain/Api/DbViewerApi";
import { ICustomRenderer } from "./Domain/Objects/CustomRenderer";

interface DbViewerApplicationProps {
    dbViewerApi: IDbViewerApi;
    customRenderer: ICustomRenderer;
    identifierKeywords: string[];
    useErrorHandlingContainer: boolean;
    isSuperUser: boolean;
    withGoBackUrl?: boolean;
}

export const DbViewerApplication = ({
    dbViewerApi,
    customRenderer,
    isSuperUser,
    identifierKeywords,
    useErrorHandlingContainer,
    withGoBackUrl,
}: DbViewerApplicationProps): JSX.Element => {
    const match = useRouteMatch();
    return (
        <Switch>
            <Route
                exact
                path={`${match.url}/`}
                render={() => (
                    <ObjectTypesContainer
                        withGoBackUrl={withGoBackUrl}
                        useErrorHandlingContainer={useErrorHandlingContainer}
                        identifierKeywords={identifierKeywords}
                        dbViewerApi={dbViewerApi}
                        path={`${match.url}`}
                    />
                )}
            />
            <Route
                exact
                path={`${match.url}/:objectId`}
                render={({ location, match: { params } }) => (
                    <ObjectTableContainer
                        isSuperUser={isSuperUser}
                        dbViewerApi={dbViewerApi}
                        customRenderer={customRenderer}
                        useErrorHandlingContainer={useErrorHandlingContainer}
                        urlQuery={location.search || ""}
                        path={`${match.url}/${params.objectId}`}
                        objectId={params.objectId || ""}
                    />
                )}
            />
            <Route
                path={`${match.url}/:objectId/details`}
                render={({ location, match: { params } }) => (
                    <ObjectDetailsContainer
                        isSuperUser={isSuperUser}
                        dbViewerApi={dbViewerApi}
                        customRenderer={customRenderer}
                        useErrorHandlingContainer={useErrorHandlingContainer}
                        objectId={params.objectId || ""}
                        objectQuery={location.search || ""}
                    />
                )}
            />
        </Switch>
    );
};
