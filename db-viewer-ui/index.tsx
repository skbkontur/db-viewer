import React from "react";
import ReactDom from "react-dom";
import { hot } from "react-hot-loader";
import { Switch, Redirect, Route } from "react-router";
import { BrowserRouter } from "react-router-dom";

import { DbViewerApplication, DbViewerApi, NullCustomRenderer } from "./src";

const dbViewerApiPrefix = "/db-viewer/";

export const dbViewerApi =
    process.env.API === "fake"
        ? new (require("./DbViewerApiFake").DbViewerApiFake)()
        : new DbViewerApi(dbViewerApiPrefix);

function AdminToolsEntryPoint() {
    return (
        <BrowserRouter>
            <Switch>
                <Route
                    path="/BusinessObjects"
                    render={props => (
                        <DbViewerApplication
                            identifierKeywords={["Cql", "StorageElement"]}
                            customRenderer={new NullCustomRenderer()}
                            useErrorHandlingContainer
                            isSuperUser
                            dbViewerApi={dbViewerApi}
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
