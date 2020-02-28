import * as React from "react";
import { Route } from "react-router-dom";
import { businessObjectsApi, BusinessObjectsApiProvider } from "Domain/EDI/Api/AdminTools/BusinessObjectsApiUtils";

import { AdminToolsApplication } from "./AdminToolsApplication";

export const AdminToolsRootPath = "/AdminTools";

export function AdminToolsEntryPoint(): JSX.Element {
    return (
        <BusinessObjectsApiProvider businessObjectsApi={businessObjectsApi}>
            <Route strict path="/AdminTools" component={AdminToolsApplication} redirect={"/"} />
        </BusinessObjectsApiProvider>
    );
}
