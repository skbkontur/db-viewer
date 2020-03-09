import React from "react";
import { hot } from "react-hot-loader";
import { Switch } from "react-router";
import { BrowserRouter, Route } from "react-router-dom";

import { businessObjectsApi, BusinessObjectsApiProvider } from "Domain/Api/BusinessObjectsApiUtils";

import { AdminToolsApplication } from "./AdminToolsApplication";

function AdminToolsEntryPointInternal() {
    return (
        <BrowserRouter>
            <Switch>
                <Route
                    path="/"
                    render={() => (
                        <BusinessObjectsApiProvider businessObjectsApi={businessObjectsApi}>
                            <Route strict path="/AdminTools" component={AdminToolsApplication} redirect={"/"} />
                        </BusinessObjectsApiProvider>
                    )}
                />
            </Switch>
        </BrowserRouter>
    );
}

export const AdminToolsEntryPoint = hot(module)(AdminToolsEntryPointInternal);
