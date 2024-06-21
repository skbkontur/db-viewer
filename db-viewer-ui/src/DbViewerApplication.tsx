import React from "react";
import { Routes, Route } from "react-router-dom";

import { ObjectDetailsContainer } from "./Containers/ObjectDetailsContainer";
import { ObjectTableContainer } from "./Containers/ObjectTableContainer";
import { ObjectTypesContainer } from "./Containers/ObjectTypesContainer";
import { IDbViewerApi } from "./Domain/Api/DbViewerApi";
import { ICustomRenderer } from "./Domain/Objects/CustomRenderer";

interface DbViewerApplicationProps {
    dbViewerApi: IDbViewerApi;
    customRenderer: ICustomRenderer;
    identifierKeywords: string[];
    useErrorHandlingContainer: boolean;
    isSuperUser: boolean;
    withGoBackUrl?: boolean;
}

export const DbViewerApplication = ({
    dbViewerApi,
    customRenderer,
    isSuperUser,
    identifierKeywords,
    useErrorHandlingContainer,
    withGoBackUrl,
}: DbViewerApplicationProps): React.ReactElement => (
    <Routes>
        <Route
            path="/"
            element={
                <ObjectTypesContainer
                    withGoBackUrl={withGoBackUrl}
                    useErrorHandlingContainer={useErrorHandlingContainer}
                    identifierKeywords={identifierKeywords}
                    dbViewerApi={dbViewerApi}
                />
            }
        />
        <Route
            path=":objectId"
            element={
                <ObjectTableContainer
                    isSuperUser={isSuperUser}
                    dbViewerApi={dbViewerApi}
                    customRenderer={customRenderer}
                    useErrorHandlingContainer={useErrorHandlingContainer}
                />
            }
        />
        <Route
            path=":objectId/details"
            element={
                <ObjectDetailsContainer
                    isSuperUser={isSuperUser}
                    dbViewerApi={dbViewerApi}
                    customRenderer={customRenderer}
                    useErrorHandlingContainer={useErrorHandlingContainer}
                />
            }
        />
    </Routes>
);
