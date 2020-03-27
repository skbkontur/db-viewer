import React from "react";
import ReactDom from "react-dom";
import { hot } from "react-hot-loader";
import { Switch, Redirect } from "react-router";
import { BrowserRouter, Route } from "react-router-dom";

import { businessObjectsApi } from "Domain/Api/BusinessObjectsApiUtils";

import { AdminToolsApplication } from "./src/AdminToolsApplication";

function AdminToolsEntryPoint() {
    return (
        <BrowserRouter>
            <Switch>
                <Route
                    path="/BusinessObjects"
                    render={props => (
                        <AdminToolsApplication allowEdit businessObjectsApi={businessObjectsApi} {...props} />
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
