
import "./react-selenium-prep"
import "@skbkontur/react-selenium-testing";

import React from "react";
import ReactDom from "react-dom";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { DbViewerApplication, DbViewerApi, NullCustomRenderer } from "./src";
import { DbViewerApiFake } from "./stories/Api/DbViewerApiFake";

import "./index.css";

const dbViewerApiPrefix = "/db-viewer/";

export const dbViewerApi = process.env.API === "fake" ? new DbViewerApiFake() : new DbViewerApi(dbViewerApiPrefix);

const AdminToolsEntryPoint = () => (
    <BrowserRouter>
        <Routes>
            <Route
                path="/BusinessObjects/*"
                element={
                    <DbViewerApplication
                        identifierKeywords={["Cql", "StorageElement"]}
                        customRenderer={new NullCustomRenderer()}
                        useErrorHandlingContainer
                        isSuperUser={localStorage.getItem("isSuperUser") === "true"}
                        dbViewerApi={dbViewerApi}
                    />
                }
            />
            <Route path="/" element={<Navigate to="/BusinessObjects" replace />} />
            <Route path="/Admin" element={<AdminRedirect />} />
        </Routes>
    </BrowserRouter>
);

function AdminRedirect(): React.ReactElement {
    document.cookie = "isSuperUser=true";
    localStorage.setItem("isSuperUser", "true");
    return <Navigate to="/BusinessObjects" replace />;
}

ReactDom.render(<AdminToolsEntryPoint />, document.getElementById("content"));
