import * as React from "react";
import { Input, Loader } from "ui";
import { ColumnStack, Fit } from "ui/layout";
import { CommonLayout } from "Commons/Layouts";
import { IBusinessObjectsApi } from "Domain/EDI/Api/AdminTools/BusinessObjectsApi";
import { withBusinessObjectsApi } from "Domain/EDI/Api/AdminTools/BusinessObjectsApiUtils";
import { BusinessObjectDescription } from "Domain/EDI/Api/AdminTools/DataTypes/BusinessObjectDescription";

import { BusinessObjectTypes } from "../Components/BusinessObjectTypes/BusinessObjectTypes";

interface BusinessObjectsProps {
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

    public getPath = (id: string): string => this.props.path + `/${id}`;

    public render(): JSX.Element {
        const { loading, objects, filter } = this.state;

        return (
            <CommonLayout>
                <CommonLayout.GoBack to="/AdminTools">Вернуться к инструментам администратора</CommonLayout.GoBack>
                <CommonLayout.Header title="Список Бизнес Объектов" />
                <CommonLayout.Content>
                    <Loader type="big" active={loading}>
                        <ColumnStack block stretch gap={4}>
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

export const BusinessObjectTypesContainer = withBusinessObjectsApi(BusinessObjectTypesContainerInternal);
