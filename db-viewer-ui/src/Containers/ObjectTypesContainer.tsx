import { ColumnStack, Fit, RowStack } from "@skbkontur/react-stack-layout";
import { Input, Loader } from "@skbkontur/react-ui";
import React from "react";
import { RouteComponentProps, withRouter } from "react-router";

import { ErrorHandlingContainer } from "../Components/ErrorHandling/ErrorHandlingContainer";
import { GoBackLink } from "../Components/GoBackLink/GoBackLink";
import { CommonLayout } from "../Components/Layouts/CommonLayout";
import { ObjectTypes } from "../Components/ObjectTypes/ObjectTypes";
import { ObjectIdentifier } from "../Domain/Api/DataTypes/ObjectIdentifier";
import { IDbViewerApi } from "../Domain/Api/DbViewerApi";
import { RouteUtils } from "../Domain/Utils/RouteUtils";

interface ObjectTypesProps extends RouteComponentProps {
    dbViewerApi: IDbViewerApi;
    useErrorHandlingContainer: boolean;
    identifierKeywords: string[];
    path: string;
    withGoBackUrl?: boolean;
}

interface ObjectTypesState {
    loading: boolean;
    objects: ObjectIdentifier[];
    filter: string;
}

class ObjectTypesContainerInternal extends React.Component<ObjectTypesProps, ObjectTypesState> {
    public state: ObjectTypesState = {
        loading: false,
        objects: [],
        filter: "",
    };

    public componentDidMount() {
        this.load();
    }

    public async load(): Promise<void> {
        const { dbViewerApi } = this.props;
        this.setState({ loading: true });
        try {
            const objects = await dbViewerApi.getNames();
            this.setState({ objects: objects });
        } finally {
            this.setState({ loading: false });
        }
    }

    public render(): JSX.Element {
        const { useErrorHandlingContainer, identifierKeywords, withGoBackUrl, match } = this.props;
        const { loading, objects, filter } = this.state;

        return (
            <CommonLayout>
                {useErrorHandlingContainer && <ErrorHandlingContainer />}
                <CommonLayout.Header
                    title={
                        <RowStack gap={3} verticalAlign="center">
                            {withGoBackUrl && <GoBackLink backUrl={RouteUtils.backUrl(match)} />}
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
                                    onValueChange={val => this.setState({ filter: val })}
                                    width={"100%"}
                                />
                            </Fit>
                            <Fit>
                                <ObjectTypes
                                    objects={objects}
                                    filter={filter}
                                    identifierKeywords={identifierKeywords}
                                />
                            </Fit>
                        </ColumnStack>
                    </Loader>
                </CommonLayout.Content>
            </CommonLayout>
        );
    }
}

export const ObjectTypesContainer = withRouter(ObjectTypesContainerInternal);
