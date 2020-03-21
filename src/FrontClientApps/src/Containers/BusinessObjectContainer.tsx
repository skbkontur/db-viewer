import TrashIcon from "@skbkontur/react-icons/Trash";
import { ColumnStack, Fit, RowStack } from "@skbkontur/react-stack-layout";
import Link from "@skbkontur/react-ui/Link";
import _ from "lodash";
import qs from "qs";
import React from "react";

import { IBusinessObjectsApi } from "Domain/Api/BusinessObjectsApi";
import { withBusinessObjectsApi } from "Domain/Api/BusinessObjectsApiUtils";
import { BusinessObjectDescription } from "Domain/Api/DataTypes/BusinessObjectDescription";
import { BusinessObjectDetails } from "Domain/Api/DataTypes/BusinessObjectDetails";
import { BusinessObjectFieldFilterOperator } from "Domain/Api/DataTypes/BusinessObjectFieldFilterOperator";
import { BusinessObjectSearchRequest } from "Domain/Api/DataTypes/BusinessObjectSearchRequest";
import { ApiError } from "Domain/ApiBase/ApiError";

import { AllowCopyToClipboard } from "../Components/AllowCopyToClipboard";
import { BusinessObjectNotFoundPage } from "../Components/BusinessObjectNotFoundPage/BusinessObjectNotFoundPage";
import { BusinessObjectViewer } from "../Components/BusinessObjectViewer/BusinessObjectViewer";
import { ConfirmDeleteObjectModal } from "../Components/ConfirmDeleteObjectModal/ConfirmDeleteObjectModal";
import { ErrorHandlingContainer } from "../Components/ErrorHandling/ErrorHandlingContainer";
import { CommonLayout } from "../Components/Layouts/CommonLayout";

interface BusinessObjectContainerProps {
    objectId: string;
    objectQuery: string;
    allowEdit: boolean;
    businessObjectsApi: IBusinessObjectsApi;
}

interface BusinessObjectContainerState {
    objectInfo: Nullable<{}>;
    objectMeta: null | BusinessObjectDescription;
    loading: boolean;
    showConfirmModal: boolean;
    objectNotFound: boolean;
}

class BusinessObjectContainerInternal extends React.Component<
    BusinessObjectContainerProps,
    BusinessObjectContainerState
> {
    public state: BusinessObjectContainerState = {
        loading: false,
        objectInfo: {},
        objectMeta: null,
        showConfirmModal: false,
        objectNotFound: false,
    };

    public componentDidMount() {
        this.load();
    }

    public componentDidUpdate(prevProps: BusinessObjectContainerProps) {
        const { objectId, objectQuery } = this.props;
        if (objectId !== prevProps.objectId || objectQuery !== prevProps.objectQuery) {
            this.load();
        }
    }

    public async load(): Promise<void> {
        this.setState({ loading: true });
        try {
            const objectInfo = await this.loadObject();
            if (objectInfo) {
                this.setState({
                    objectInfo: objectInfo.object,
                    objectMeta: objectInfo.meta,
                });
            }
        } finally {
            this.setState({ loading: false });
        }
    }

    public async loadObject(): Promise<null | BusinessObjectDetails> {
        const { businessObjectsApi, objectId, objectQuery } = this.props;
        const query = qs.parse(objectQuery.replace(/^\?/, ""));
        const searchQuery: BusinessObjectSearchRequest = {
            conditions: Object.keys(query).map(x => ({
                path: x,
                value: query[x],
                operator: BusinessObjectFieldFilterOperator.Equals,
            })),
        };
        try {
            return await businessObjectsApi.getBusinessObjects(objectId, searchQuery);
        } catch (e) {
            if (e instanceof ApiError && e.statusCode === 404) {
                this.setState({ objectNotFound: true });
                return null;
            } else {
                throw new Error(e.message);
            }
        }
    }

    public handleChange = async (value: object, path: string[]): Promise<void> => {
        const { objectMeta, objectInfo } = this.state;
        if (objectMeta == null || objectInfo == null) {
            return;
        }

        try {
            const updatedObject = _.set(objectInfo, path, value);
            const savedInfo = await this.props.businessObjectsApi.updateBusinessObjects(
                objectMeta.identifier,
                updatedObject
            );
            this.setState({ objectInfo: savedInfo });
        } catch (e) {
            const obj = await this.loadObject();
            this.setState({ objectInfo: obj });
            throw e;
        }
    };

    public async handleDelete(): Promise<void> {
        const { objectMeta, objectInfo } = this.state;
        const { businessObjectsApi } = this.props;
        if (objectMeta != null) {
            await businessObjectsApi.deleteBusinessObjects(objectMeta.identifier, objectInfo as any);
            window.location.href = `/BusinessObjects/${this.props.objectId}`;
            return;
        }
        throw new Error("Пытаемся удалить объект с типом массив");
    }

    public handleTryDeleteObject() {
        this.setState({ showConfirmModal: true });
    }

    public handleCancelDelete = () => {
        this.setState({ showConfirmModal: false });
    };

    public handleConfirmDelete = () => {
        this.handleDelete();
    };

    public render(): JSX.Element {
        const { objectId, allowEdit } = this.props;
        const { objectInfo, objectNotFound, objectMeta, loading } = this.state;
        if (objectNotFound || objectInfo == null) {
            return <BusinessObjectNotFoundPage parentLocation={`/BusinessObjects/${objectId}`} />;
        }
        return (
            <CommonLayout>
                <ErrorHandlingContainer />
                <CommonLayout.GoBack to={`/BusinessObjects/${objectId}`} data-tid="GoBack">
                    Вернуться к списку бизнес объектов
                </CommonLayout.GoBack>
                <CommonLayout.ContentLoader active={loading}>
                    <CommonLayout.GreyLineHeader
                        title={objectId}
                        tools={
                            <div style={{ textAlign: "right" }}>
                                {allowEdit && (
                                    <Link
                                        icon={<TrashIcon />}
                                        onClick={() => this.handleTryDeleteObject()}
                                        data-tid="Delete">
                                        Удалить
                                    </Link>
                                )}
                            </div>
                        }>
                        <ColumnStack block gap={2}>
                            {objectMeta?.typeMetaInformation?.properties?.map(
                                x =>
                                    x.isIdentity && (
                                        <Fit>
                                            <RowStack gap={2}>
                                                <Fit>{x.name}:</Fit>
                                                <Fit>
                                                    <AllowCopyToClipboard data-tid={x.name}>
                                                        {objectInfo[x.name]}
                                                    </AllowCopyToClipboard>
                                                </Fit>
                                            </RowStack>
                                        </Fit>
                                    )
                            )}
                        </ColumnStack>
                    </CommonLayout.GreyLineHeader>
                    <CommonLayout.Content>
                        <ColumnStack gap={4} block>
                            <Fit style={{ maxWidth: "100%" }}>
                                {objectInfo != null && objectMeta != null && (
                                    <BusinessObjectViewer
                                        objectInfo={objectInfo}
                                        objectMeta={objectMeta}
                                        allowEdit={allowEdit}
                                        onChange={this.handleChange}
                                    />
                                )}
                            </Fit>
                        </ColumnStack>
                    </CommonLayout.Content>
                    {this.state.showConfirmModal && allowEdit && (
                        <ConfirmDeleteObjectModal
                            onDelete={this.handleConfirmDelete}
                            onCancel={this.handleCancelDelete}
                        />
                    )}
                </CommonLayout.ContentLoader>
            </CommonLayout>
        );
    }
}

export const BusinessObjectContainer = withBusinessObjectsApi(BusinessObjectContainerInternal);
