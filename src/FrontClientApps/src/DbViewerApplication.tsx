import * as React from "react";
import { Route, RouteComponentProps, Switch, withRouter } from "react-router-dom";

import { ObjectDetailsContainer } from "./Containers/ObjectDetailsContainer";
import { ObjectTableContainer } from "./Containers/ObjectTableContainer";
import { ObjectTypesContainer } from "./Containers/ObjectTypesContainer";
import { IBusinessObjectsApi } from "./Domain/Api/BusinessObjectsApi";
import { ICustomRenderer } from "./Domain/BusinessObjects/CustomRenderer";

interface DbViewerApplicationProps extends RouteComponentProps {
    businessObjectsApi: IBusinessObjectsApi;
    customRenderer: ICustomRenderer;
    identifierKeywords: string[];
    allowEdit: boolean;
}

function DbViewerApplicationInternal({
    businessObjectsApi,
    customRenderer,
    allowEdit,
    identifierKeywords,
    match,
}: DbViewerApplicationProps): JSX.Element {
    return (
        <Switch>
            <Route
                exact
                path={`${match.url}/`}
                render={() => (
                    <ObjectTypesContainer
                        identifierKeywords={identifierKeywords}
                        businessObjectsApi={businessObjectsApi}
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
                        businessObjectsApi={businessObjectsApi}
                        customRenderer={customRenderer}
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
                        businessObjectsApi={businessObjectsApi}
                        customRenderer={customRenderer}
                        objectId={params.objectId || ""}
                        objectQuery={location.search || ""}
                    />
                )}
            />
        </Switch>
    );
}

export const DbViewerApplication = withRouter(DbViewerApplicationInternal);
