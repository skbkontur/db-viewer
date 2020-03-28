import * as React from "react";
import ReactDom from "react-dom";
import { hot } from "react-hot-loader";
import { Switch, Redirect } from "react-router";
import { BrowserRouter, Route } from "react-router-dom";

import { AdminToolsApplication } from "./src/AdminToolsApplication";
import { businessObjectsApi } from "./src/Domain/Api/BusinessObjectsApiUtils";

function AdminToolsEntryPoint() {
    return (
        <BrowserRouter>
            <Switch>
                <Route
                    path="/BusinessObjects"
                    render={props => (
                        <AdminToolsApplication
                            identifierKeywords={["Diadoc", "StorageElement", "Party", "User"]}
                            customRenderers={[]}
                            allowEdit
                            businessObjectsApi={businessObjectsApi}
                            {...props}
                        />
                    )}
                />
                <Route exact path="/">
                    <Redirect to="/BusinessObjects" />
                </Route>
            </Switch>
        </BrowserRouter>
    );
}

export const AdminTools = hot(module)(AdminToolsEntryPoint);
ReactDom.render(<AdminTools />, document.getElementById("content"));
