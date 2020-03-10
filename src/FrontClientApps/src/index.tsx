import React from "react";
import ReactDom from "react-dom";
import { hot } from "react-hot-loader";
import { Switch } from "react-router";
import { BrowserRouter, Route } from "react-router-dom";

import { businessObjectsApi, BusinessObjectsApiProvider } from "Domain/Api/BusinessObjectsApiUtils";

import { AdminToolsApplication } from "./AdminToolsApplication";

function AdminToolsEntryPoint() {
    return (
        <BusinessObjectsApiProvider businessObjectsApi={businessObjectsApi}>
            <BrowserRouter>
                <Switch>
                    <Route path="/BusinessObjects" component={AdminToolsApplication} />
                </Switch>
            </BrowserRouter>
        </BusinessObjectsApiProvider>
    );
}

export const AdminTools = hot(module)(AdminToolsEntryPoint);
ReactDom.render(<AdminTools />, document.getElementById("content"));
