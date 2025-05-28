import { LIGHT_THEME, ThemeContext, ThemeFactory } from "@skbkontur/react-ui";
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
    <ThemeContext.Provider value={ThemeFactory.create({ linkTextDecorationColor: "transparent" }, LIGHT_THEME)}>
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
    </ThemeContext.Provider>
);
