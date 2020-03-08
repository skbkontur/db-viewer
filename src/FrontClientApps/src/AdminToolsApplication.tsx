import React from "react";
import { Route, RouteComponentProps, Switch } from "react-router-dom";

import { ObjectTableContainer } from "./Containers/BusinessObjectsTableContainer";
import { BusinessObjectContainer } from "./Containers/BusinessObjectContainer";
import { BusinessObjectTypesContainer } from "./Containers/BusinessObjectTypesContainer";

export function AdminToolsApplication({ match }: RouteComponentProps): JSX.Element {
    return (
        <Switch>
            <Route
                exact
                path={`${match.url}/BusinessObjects`}
                render={() => <BusinessObjectTypesContainer path={`${match.url}/BusinessObjects`} />}
            />
            <Route
                exact
                path={`${match.url}/BusinessObjects/:objectId`}
                render={({ location, match: { params } }) => (
                    <ObjectTableContainer
                        urlQuery={location.search || ""}
                        path={`/AdminTools/BusinessObjects/${params.objectId}`}
                        objectId={params.objectId || ""}
                    />
                )}
            />
            <Route
                path={`${match.url}/BusinessObjects/:objectId/details`}
                render={({ location, match: { params } }) => (
                    <BusinessObjectContainer objectId={params.objectId || ""} objectQuery={location.search || ""} />
                )}
            />
        </Switch>
    );
}
