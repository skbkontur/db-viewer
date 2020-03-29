import * as React from "react";
import ReactDom from "react-dom";
import { hot } from "react-hot-loader";
import { Switch, Redirect } from "react-router";
import { BrowserRouter, Route } from "react-router-dom";

import { DbViewerApplication, BusinessObjectsApiImpl, NullCustomRenderer } from "./src";

const businessObjectsApiPrefix = "/business-objects/";

export const businessObjectsApi =
    process.env.API === "fake"
        ? new (require("./BusinessObjectsApiFake").BusinessObjectsApiFake)()
        : new BusinessObjectsApiImpl(businessObjectsApiPrefix);

function AdminToolsEntryPoint() {
    return (
        <BrowserRouter>
            <Switch>
                <Route
                    path="/BusinessObjects"
                    render={props => (
                        <DbViewerApplication
                            identifierKeywords={["Diadoc", "StorageElement", "Party", "User"]}
                            customRenderer={new NullCustomRenderer()}
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
