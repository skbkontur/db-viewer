import "./react-selenium-testing";
import React from "react";
import ReactDom from "react-dom";
import { Switch, Redirect, Route } from "react-router";
import { BrowserRouter } from "react-router-dom";

import { DbViewerApplication, DbViewerApi, NullCustomRenderer } from "./src";
import { DbViewerApiFake } from "./stories/Api/DbViewerApiFake";

const dbViewerApiPrefix = "/db-viewer/";

export const dbViewerApi = process.env.API === "fake" ? new DbViewerApiFake() : new DbViewerApi(dbViewerApiPrefix);

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
                            isSuperUser={localStorage.getItem("isSuperUser") === "true"}
                            dbViewerApi={dbViewerApi}
                            {...props}
                        />
                    )}
                />
                <Route exact path="/">
                    <Redirect to="/BusinessObjects" />
                </Route>
                <Route
                    exact
                    path="/Admin"
                    render={() => {
                        document.cookie = "isSuperUser=true";
                        localStorage.setItem("isSuperUser", "true");
                        return <Redirect to="/BusinessObjects" />;
                    }}
                />
            </Switch>
        </BrowserRouter>
    );
}

ReactDom.render(<AdminToolsEntryPoint />, document.getElementById("content"));
