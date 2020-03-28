import { ColumnStack, Fit } from "@skbkontur/react-stack-layout";
import Input from "@skbkontur/react-ui/Input";
import Loader from "@skbkontur/react-ui/Loader";
import * as React from "react";
import { RouteComponentProps, withRouter } from "react-router";

import { BusinessObjectTypes } from "../Components/BusinessObjectTypes/BusinessObjectTypes";
import { CommonLayout } from "../Components/Layouts/CommonLayout";
import { IBusinessObjectsApi } from "../Domain/Api/BusinessObjectsApi";
import { BusinessObjectDescription } from "../Domain/Api/DataTypes/BusinessObjectDescription";
import { RouteUtils } from "../Domain/Utils/RouteUtils";

interface BusinessObjectsProps extends RouteComponentProps {
    businessObjectsApi: IBusinessObjectsApi;
    path: string;
}

interface BusinessObjectsState {
    loading: boolean;
    objects: Nullable<BusinessObjectDescription[]>;
    filter: string;
}

class BusinessObjectTypesContainerInternal extends React.Component<BusinessObjectsProps, BusinessObjectsState> {
    public state: BusinessObjectsState = {
        loading: false,
        objects: null,
        filter: "",
    };

    public componentDidMount() {
        this.load();
    }

    public async load(): Promise<void> {
        const { businessObjectsApi } = this.props;
        this.setState({ loading: true });
        try {
            const objects = await businessObjectsApi.getBusinessObjectNames();
            this.setState({
                objects: objects,
            });
        } finally {
            this.setState({ loading: false });
        }
    }

    public getPath = (id: string): string => RouteUtils.goTo(this.props.path, id);

    public render(): JSX.Element {
        const { loading, objects, filter } = this.state;

        return (
            <CommonLayout>
                <CommonLayout.GoBack to={RouteUtils.backUrl(this.props)}>
                    Вернуться к инструментам администратора
                </CommonLayout.GoBack>
                <CommonLayout.Header title="Список Бизнес Объектов" />
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
                                {objects && (
                                    <BusinessObjectTypes
                                        data-tid="BusinessObjectTypes"
                                        getPath={this.getPath}
                                        objects={objects}
                                        filter={filter}
                                    />
                                )}
                            </Fit>
                        </ColumnStack>
                    </Loader>
                </CommonLayout.Content>
            </CommonLayout>
        );
    }
}

export const BusinessObjectTypesContainer = withRouter(BusinessObjectTypesContainerInternal);
