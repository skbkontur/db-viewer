import { ColumnStack, Fit } from "@skbkontur/react-stack-layout";
import Input from "@skbkontur/react-ui/Input";
import Loader from "@skbkontur/react-ui/Loader";
import React from "react";
import { RouteComponentProps, withRouter } from "react-router";

import { ErrorHandlingContainer } from "../Components/ErrorHandling/ErrorHandlingContainer";
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

    public getPath = (id: string): string => RouteUtils.goTo(this.props.path, id);

    public render(): JSX.Element {
        const { loading, objects, filter } = this.state;

        return (
            <CommonLayout>
                {this.props.useErrorHandlingContainer && <ErrorHandlingContainer />}
                <CommonLayout.GoBack to={RouteUtils.backUrl(this.props)}>
                    Вернуться к инструментам администратора
                </CommonLayout.GoBack>
                <CommonLayout.Header title="Список Объектов" />
                <CommonLayout.Content>
                    <Loader type="big" active={loading}>
                        <ColumnStack block stretch>
                            <Fit>
                                <Input
                                    data-tid="FilterInput"
                                    autoFocus
                                    placeholder="Введите значение для поиска (работает R#-style поиск, например, BoxEvSt или BESE)"
                                    value={filter}
                                    onChange={(e, val) => this.setState({ filter: val })}
                                    width={"100%"}
                                />
                            </Fit>
                            <Fit>
                                <ObjectTypes
                                    getPath={this.getPath}
                                    objects={objects}
                                    filter={filter}
                                    identifierKeywords={this.props.identifierKeywords}
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
