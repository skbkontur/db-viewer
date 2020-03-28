import * as React from "react";
import { Route, RouteComponentProps, Switch } from "react-router-dom";

import { BusinessObjectContainer } from "./Containers/BusinessObjectContainer";
import { BusinessObjectTypesContainer } from "./Containers/BusinessObjectTypesContainer";
import { ObjectTableContainer } from "./Containers/BusinessObjectsTableContainer";
import { IBusinessObjectsApi } from "./Domain/Api/BusinessObjectsApi";

interface AdminToolsApplicationProps extends RouteComponentProps {
    businessObjectsApi: IBusinessObjectsApi;
    customRenderers: object[];
    identifierKeywords: string[];
    allowEdit: boolean;
}

export function AdminToolsApplication({
    businessObjectsApi,
    allowEdit,
    identifierKeywords,
    match,
}: AdminToolsApplicationProps): JSX.Element {
    return (
        <Switch>
            <Route
                exact
                path={`${match.url}/`}
                render={() => (
                    <BusinessObjectTypesContainer
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
                        urlQuery={location.search || ""}
                        path={`${match.url}/${params.objectId}`}
                        objectId={params.objectId || ""}
                    />
                )}
            />
            <Route
                path={`${match.url}/:objectId/details`}
                render={({ location, match: { params } }) => (
                    <BusinessObjectContainer
                        allowEdit={allowEdit}
                        businessObjectsApi={businessObjectsApi}
                        objectId={params.objectId || ""}
                        objectQuery={location.search || ""}
                    />
                )}
            />
        </Switch>
    );
}
