import TrashIcon from "@skbkontur/react-icons/Trash";
import * as React from "react";
import { ButtonLink } from "ui";
import { ColumnStack, Fit, RowStack } from "ui/layout";
import { AllowCopyToClipboard } from "Commons/AllowCopyToClipboard";
import { ErrorHandlingContainer } from "Commons/ErrorHandling/ErrorHandlingContainer";
import { CommonLayout } from "Commons/Layouts";
import { ApiError } from "Domain/ApiBase/ApiError";
import { IBusinessObjectsApi } from "Domain/EDI/Api/AdminTools/BusinessObjectsApi";
import { withBusinessObjectsApi } from "Domain/EDI/Api/AdminTools/BusinessObjectsApiUtils";
import { BusinessObjectDescription } from "Domain/EDI/Api/AdminTools/DataTypes/BusinessObjectDescription";
import { BusinessObjectStorageType } from "Domain/EDI/Api/AdminTools/DataTypes/BusinessObjectStorageType";
import { UpdateBusinessObjectInfo } from "Domain/EDI/Api/AdminTools/DataTypes/UpdateBusinessObjectInfo";

import { BusinessObjectNotFoundPage } from "../Components/BusinessObjectNotFoundPage/BusinessObjectNotFoundPage";
import { BusinessObjectViewer } from "../Components/BusinessObjectViewer/BusinessObjectViewer";
import { ConfirmDeleteObjectModal } from "../Components/ConfirmDeleteObjectModal/ConfirmDeleteObjectModal";

interface BusinessObjectContainerProps {
    parentObjectId: string;
    objectId: string;
    scopeId: string;
    index: string;
    businessObjectsApi: IBusinessObjectsApi;
}

interface BusinessObjectContainerState {
    objectInfo: Nullable<{}>;
    objectMeta: Nullable<BusinessObjectDescription>;
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
        const { parentObjectId, objectId, scopeId, index } = this.props;
        const shouldUpdate =
            parentObjectId !== prevProps.parentObjectId ||
            objectId !== prevProps.objectId ||
            scopeId !== prevProps.scopeId ||
            index !== prevProps.index;
        if (shouldUpdate) {
            this.load();
        }
    }

    public async load(): Promise<void> {
        const { businessObjectsApi, parentObjectId } = this.props;
        this.setState({ loading: true });
        try {
            const objectInfo = await this.loadObject();
            const objectMeta = await businessObjectsApi.getBusinessObjectMeta(parentObjectId);
            this.setState({
                objectInfo: objectInfo,
                objectMeta: objectMeta,
            });
        } finally {
            this.setState({ loading: false });
        }
    }

    public async loadObject(): Promise<Nullable<{}>> {
        const { businessObjectsApi, parentObjectId, scopeId, objectId, index } = this.props;
        try {
            let objectInfo = null;
            if (index) {
                objectInfo = await businessObjectsApi.getBusinessArrayObject(parentObjectId, scopeId, objectId, index);
            } else {
                objectInfo = await businessObjectsApi.getBusinessObjects(parentObjectId, scopeId, objectId);
            }
            return objectInfo;
        } catch (e) {
            if (e instanceof ApiError && e.statusCode === 404) {
                this.setState({
                    objectNotFound: true,
                });
            } else {
                throw new Error(e.message);
            }
        }
        return null;
    }

    public async handleChange(value: UpdateBusinessObjectInfo): Promise<void> {
        const { objectMeta } = this.state;
        if (objectMeta != null) {
            if (objectMeta.storageType === BusinessObjectStorageType.SingleObjectPerRow) {
                await this.props.businessObjectsApi.updateBusinessObjects(
                    objectMeta.identifier,
                    this.props.scopeId,
                    this.props.objectId,
                    value
                );
            } else {
                await this.props.businessObjectsApi.updateBusinessArrayObject(
                    objectMeta.identifier,
                    this.props.scopeId,
                    this.props.objectId,
                    this.props.index,
                    value
                );
            }
        }
        const objectInfo = await this.loadObject();
        this.setState({
            objectInfo: objectInfo,
        });
    }

    public async handleDelete(): Promise<void> {
        const { objectMeta } = this.state;
        const { businessObjectsApi } = this.props;
        if (objectMeta != null) {
            if (objectMeta.storageType === BusinessObjectStorageType.SingleObjectPerRow) {
                await businessObjectsApi.deleteBusinessObjects(
                    objectMeta.identifier,
                    this.props.scopeId,
                    this.props.objectId
                );
                window.location.href = `/AdminTools/BusinessObjects/${this.props.parentObjectId}`;
                return;
            }
        }
        throw new Error("Пытаемся удалить объект с типом массив");
    }

    public handleTryDeleteObject() {
        this.setState({
            showConfirmModal: true,
        });
    }

    public handleCancelDelete = () => {
        this.setState({
            showConfirmModal: false,
        });
    };

    public handleConfirmDelete = () => {
        this.handleDelete();
    };

    public render(): JSX.Element {
        const { parentObjectId, objectId, scopeId, index } = this.props;
        const { objectInfo, objectMeta, loading } = this.state;
        const allowEdit = true;
        if (this.state.objectNotFound) {
            return (
                <BusinessObjectNotFoundPage
                    parentLocation={{ pathname: "/AdminTools/BusinessObjects" + `/${parentObjectId}` }}
                />
            );
        }
        return (
            <CommonLayout>
                <ErrorHandlingContainer />
                <CommonLayout.GoBack
                    to={{ pathname: "/AdminTools/BusinessObjects" + `/${parentObjectId}` }}
                    data-tid="GoBack">
                    Вернуться к списку бизнес объектов
                </CommonLayout.GoBack>
                <CommonLayout.ContentLoader active={loading}>
                    <CommonLayout.GreyLineHeader
                        title={parentObjectId}
                        tools={
                            <div style={{ textAlign: "right" }}>
                                {allowEdit && (
                                    <ButtonLink
                                        icon={<TrashIcon />}
                                        onClick={() => this.handleTryDeleteObject()}
                                        data-tid="Delete">
                                        Удалить
                                    </ButtonLink>
                                )}
                            </div>
                        }>
                        <ColumnStack block gap={2}>
                            <Fit>
                                <RowStack gap={2}>
                                    <Fit>ScopeId:</Fit>
                                    <Fit>
                                        <AllowCopyToClipboard data-tid={"ScopeId"}>{scopeId}</AllowCopyToClipboard>
                                    </Fit>
                                </RowStack>
                            </Fit>
                            <Fit>
                                <RowStack gap={2}>
                                    <Fit>Id:</Fit>
                                    <Fit>
                                        <AllowCopyToClipboard data-tid={"ObjectId"}>{objectId}</AllowCopyToClipboard>
                                    </Fit>
                                    <Fit />
                                </RowStack>
                            </Fit>
                            {index !== "" && (
                                <Fit>
                                    <RowStack gap={2}>
                                        <Fit>Index:</Fit>
                                        <Fit>
                                            <AllowCopyToClipboard data-tid={"Index"}>{index}</AllowCopyToClipboard>
                                        </Fit>
                                    </RowStack>
                                </Fit>
                            )}
                        </ColumnStack>
                    </CommonLayout.GreyLineHeader>
                    <CommonLayout.Content>
                        <ColumnStack gap={4} block>
                            <Fit style={{ maxWidth: "100%" }}>
                                {objectInfo != null &&
                                    objectMeta != null && (
                                        <BusinessObjectViewer
                                            objectInfo={objectInfo}
                                            objectMeta={objectMeta}
                                            allowEdit={allowEdit}
                                            onChange={value => this.handleChange(value)}
                                        />
                                    )}
                            </Fit>
                        </ColumnStack>
                    </CommonLayout.Content>
                    {this.state.showConfirmModal &&
                        allowEdit && (
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
