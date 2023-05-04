import { ColumnStack, Fit, RowStack } from "@skbkontur/react-stack-layout";
import { Input, Loader } from "@skbkontur/react-ui";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router";

import { ErrorHandlingContainer } from "../Components/ErrorHandling/ErrorHandlingContainer";
import { GoBackLink } from "../Components/GoBackLink/GoBackLink";
import { CommonLayout } from "../Components/Layouts/CommonLayout";
import { ObjectTypes } from "../Components/ObjectTypes/ObjectTypes";
import { ObjectIdentifier } from "../Domain/Api/DataTypes/ObjectIdentifier";
import { IDbViewerApi } from "../Domain/Api/DbViewerApi";
import { RouteUtils } from "../Domain/Utils/RouteUtils";

interface ObjectTypesProps {
    dbViewerApi: IDbViewerApi;
    useErrorHandlingContainer: boolean;
    identifierKeywords: string[];
    withGoBackUrl?: boolean;
}

export const ObjectTypesContainer = ({
    dbViewerApi,
    useErrorHandlingContainer,
    identifierKeywords,
    withGoBackUrl,
}: ObjectTypesProps): JSX.Element => {
    const [loading, setLoading] = useState(false);
    const { pathname } = useLocation();
    const [objects, setObjects] = useState<ObjectIdentifier[]>([]);

    const [filter, setFilter] = useState("");

    useEffect(() => {
        loadData();
    }, []);

    return (
        <CommonLayout>
            {useErrorHandlingContainer && <ErrorHandlingContainer />}
            <CommonLayout.Header
                title={
                    <RowStack gap={3} verticalAlign="center">
                        {withGoBackUrl && <GoBackLink backUrl={RouteUtils.backUrl(pathname)} />}
                        <span>Список Объектов</span>
                    </RowStack>
                }
            />
            <CommonLayout.Content>
                <Loader type="big" active={loading}>
                    <ColumnStack block stretch>
                        <Fit>
                            <Input
                                data-tid="FilterInput"
                                autoFocus
                                placeholder="Введите значение для поиска (работает R#-style поиск, например, BoxEvSt или BESE)"
                                value={filter}
                                onValueChange={setFilter}
                                width={"100%"}
                            />
                        </Fit>
                        <Fit>
                            <ObjectTypes objects={objects} filter={filter} identifierKeywords={identifierKeywords} />
                        </Fit>
                    </ColumnStack>
                </Loader>
            </CommonLayout.Content>
        </CommonLayout>
    );

    async function loadData(): Promise<void> {
        setLoading(true);
        try {
            const objects = await dbViewerApi.getNames();
            setObjects(objects);
        } finally {
            setLoading(false);
        }
    }
};
