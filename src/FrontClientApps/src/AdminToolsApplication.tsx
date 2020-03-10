import React from "react";
import { Route, RouteComponentProps, Switch } from "react-router-dom";

import { BusinessObjectContainer } from "./Containers/BusinessObjectContainer";
import { BusinessObjectTypesContainer } from "./Containers/BusinessObjectTypesContainer";
import { ObjectTableContainer } from "./Containers/BusinessObjectsTableContainer";

export function AdminToolsApplication({ match }: RouteComponentProps): JSX.Element {
    return (
        <Switch>
            <Route exact path={`${match.url}/`} render={() => <BusinessObjectTypesContainer path={`${match.url}`} />} />
            <Route
                exact
                path={`${match.url}/:objectId`}
                render={({ location, match: { params } }) => (
                    <ObjectTableContainer
                        urlQuery={location.search || ""}
                        path={`${match.url}/${params.objectId}`}
                        objectId={params.objectId || ""}
                    />
                )}
            />
            <Route
                path={`${match.url}/:objectId/details`}
                render={({ location, match: { params } }) => (
                    <BusinessObjectContainer objectId={params.objectId || ""} objectQuery={location.search || ""} />
                )}
            />
        </Switch>
    );
}
