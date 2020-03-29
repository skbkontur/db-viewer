import TrashIcon from "@skbkontur/react-icons/Trash";
import { ColumnStack, Fit, RowStack } from "@skbkontur/react-stack-layout";
import Link from "@skbkontur/react-ui/Link";
import * as _ from "lodash";
import * as qs from "qs";
import * as React from "react";
import { RouteComponentProps, withRouter } from "react-router";

import { AllowCopyToClipboard } from "../Components/AllowCopyToClipboard";
import { ConfirmDeleteObjectModal } from "../Components/ConfirmDeleteObjectModal/ConfirmDeleteObjectModal";
import { ErrorHandlingContainer } from "../Components/ErrorHandling/ErrorHandlingContainer";
import { CommonLayout } from "../Components/Layouts/CommonLayout";
import { ObjectNotFoundPage } from "../Components/ObjectNotFoundPage/ObjectNotFoundPage";
import { ObjectViewer } from "../Components/ObjectViewer/ObjectViewer";
import { ObjectDescription } from "../Domain/Api/DataTypes/ObjectDescription";
import { ObjectDetails } from "../Domain/Api/DataTypes/ObjectDetails";
import { ObjectFieldFilterOperator } from "../Domain/Api/DataTypes/ObjectFieldFilterOperator";
import { ObjectSearchRequest } from "../Domain/Api/DataTypes/ObjectSearchRequest";
import { IDbViewerApi } from "../Domain/Api/DbViewerApi";
import { ApiError } from "../Domain/ApiBase/ApiError";
import { ICustomRenderer } from "../Domain/Objects/CustomRenderer";
import { RouteUtils } from "../Domain/Utils/RouteUtils";

interface ObjectDetailsProps extends RouteComponentProps {
    objectId: string;
    objectQuery: string;
    allowEdit: boolean;
    dbViewerApi: IDbViewerApi;
    customRenderer: ICustomRenderer;
}

interface ObjectDetailsState {
    objectInfo: Nullable<{}>;
    objectMeta: null | ObjectDescription;
    loading: boolean;
    showConfirmModal: boolean;
    objectNotFound: boolean;
}

class ObjectDetailsContainerInternal extends React.Component<ObjectDetailsProps, ObjectDetailsState> {
    public state: ObjectDetailsState = {
        loading: false,
        objectInfo: {},
        objectMeta: null,
        showConfirmModal: false,
        objectNotFound: false,
    };

    public componentDidMount() {
        this.load();
    }

    public componentDidUpdate(prevProps: ObjectDetailsProps) {
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

    public async loadObject(): Promise<null | ObjectDetails> {
        const { dbViewerApi, objectId, objectQuery } = this.props;
        const query = qs.parse(objectQuery.replace(/^\?/, ""));
        const searchQuery: ObjectSearchRequest = {
            conditions: Object.keys(query).map(x => ({
                path: x,
                value: query[x],
                operator: ObjectFieldFilterOperator.Equals,
            })),
        };
        try {
            return await dbViewerApi.readObject(objectId, searchQuery);
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
            const savedInfo = await this.props.dbViewerApi.updateObject(objectMeta.identifier, updatedObject);
            this.setState({ objectInfo: savedInfo });
        } catch (e) {
            const obj = await this.loadObject();
            this.setState({ objectInfo: obj });
            throw e;
        }
    };

    public async handleDelete(): Promise<void> {
        const { objectMeta, objectInfo } = this.state;
        const { dbViewerApi } = this.props;
        if (objectMeta != null) {
            await dbViewerApi.deleteObject(objectMeta.identifier, objectInfo as any);
            this.props.history.push(RouteUtils.backUrl(this.props));
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
        const { objectId, allowEdit, customRenderer } = this.props;
        const { objectInfo, objectNotFound, objectMeta, loading } = this.state;
        if (objectNotFound || objectInfo == null) {
            return <ObjectNotFoundPage />;
        }
        return (
            <CommonLayout>
                <ErrorHandlingContainer />
                <CommonLayout.GoBack to={RouteUtils.backUrl(this.props)} data-tid="GoBack">
                    Вернуться к списку объектов
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
                                    <ObjectViewer
                                        objectInfo={objectInfo}
                                        objectMeta={objectMeta}
                                        allowEdit={allowEdit}
                                        customRenderer={customRenderer}
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

export const ObjectDetailsContainer = withRouter(ObjectDetailsContainerInternal);
