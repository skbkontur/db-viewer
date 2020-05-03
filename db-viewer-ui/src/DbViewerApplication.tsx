import React from "react";
import { Route, RouteComponentProps, Switch, withRouter } from "react-router";

import { ObjectDetailsContainer } from "./Containers/ObjectDetailsContainer";
import { ObjectTableContainer } from "./Containers/ObjectTableContainer";
import { ObjectTypesContainer } from "./Containers/ObjectTypesContainer";
import { IDbViewerApi } from "./Domain/Api/DbViewerApi";
import { ICustomRenderer } from "./Domain/Objects/CustomRenderer";

interface DbViewerApplicationProps extends RouteComponentProps {
    dbViewerApi: IDbViewerApi;
    customRenderer: ICustomRenderer;
    identifierKeywords: string[];
    useErrorHandlingContainer: boolean;
    allowEdit: boolean;
}

function DbViewerApplicationInternal({
    dbViewerApi,
    customRenderer,
    allowEdit,
    identifierKeywords,
    useErrorHandlingContainer,
    match,
}: DbViewerApplicationProps): JSX.Element {
    return (
        <Switch>
            <Route
                exact
                path={`${match.url}/`}
                render={() => (
                    <ObjectTypesContainer
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
                        allowEdit={allowEdit}
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
                        allowEdit={allowEdit}
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
}

export const DbViewerApplication = withRouter(DbViewerApplicationInternal);
