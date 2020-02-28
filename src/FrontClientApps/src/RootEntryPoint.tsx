import * as React from "react";
import { hot } from "react-hot-loader";
import { Switch } from "react-router";
import { BrowserRouter, Route } from "react-router-dom";

import { Bundle } from "./Bundle";

const loadAdminTools = async () => (await import("./AdminTools/AdminToolsEntryPoint")).AdminToolsEntryPoint;
function renderAdminTools(): JSX.Element {
    return <Bundle load={loadAdminTools}>{AdminToolsPoint => <AdminToolsPoint />}</Bundle>;
}

function RootEntryPointInternal() {
    return (
        <BrowserRouter>
            <Switch>
                <Route path={"/AdminTools"} render={renderAdminTools} />
            </Switch>
        </BrowserRouter>
    );
}

export const RootEntryPoint = hot(module)(RootEntryPointInternal);
