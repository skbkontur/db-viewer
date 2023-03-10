import CopyIcon from "@skbkontur/react-icons/Copy";
import TrashIcon from "@skbkontur/react-icons/Trash";
import { ColumnStack, Fit, RowStack } from "@skbkontur/react-stack-layout";
import { Link } from "@skbkontur/react-ui";
import get from "lodash/get";
import React from "react";
import { RouteComponentProps, withRouter } from "react-router";

import { CopyToClipboardToast } from "../Components/AllowCopyToClipboard";
import { ConfirmDeleteObjectModal } from "../Components/ConfirmDeleteObjectModal/ConfirmDeleteObjectModal";
import { ErrorHandlingContainer } from "../Components/ErrorHandling/ErrorHandlingContainer";
import { CommonLayout } from "../Components/Layouts/CommonLayout";
import { ObjectNotFoundPage } from "../Components/ObjectNotFoundPage/ObjectNotFoundPage";
import { ObjectKeys } from "../Components/ObjectViewer/ObjectKeys";
import { ObjectViewer } from "../Components/ObjectViewer/ObjectViewer";
import { Condition } from "../Domain/Api/DataTypes/Condition";
import { ObjectDescription } from "../Domain/Api/DataTypes/ObjectDescription";
import { ObjectFieldFilterOperator } from "../Domain/Api/DataTypes/ObjectFieldFilterOperator";
import { IDbViewerApi } from "../Domain/Api/DbViewerApi";
import { ICustomRenderer } from "../Domain/Objects/CustomRenderer";
import { RouteUtils } from "../Domain/Utils/RouteUtils";

interface ObjectDetailsProps extends RouteComponentProps {
    objectId: string;
    objectQuery: string;
    isSuperUser: boolean;
    dbViewerApi: IDbViewerApi;
    customRenderer: ICustomRenderer;
    withBackLink?: boolean;
    useErrorHandlingContainer: boolean;
}

interface ObjectDetailsState {
    conditions: Condition[];
    objectInfo: Nullable<{}>;
    objectMeta: null | ObjectDescription;
    loading: boolean;
    showConfirmModal: boolean;
}

class ObjectDetailsContainerInternal extends React.Component<ObjectDetailsProps, ObjectDetailsState> {
    public state: ObjectDetailsState = {
        loading: false,
        conditions: [],
        objectInfo: {},
        objectMeta: null,
        showConfirmModal: false,
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
        const { dbViewerApi, objectId } = this.props;

        this.setState({ loading: true });
        try {
            const conditions = this.getConditions();
            const objectInfo = await dbViewerApi.readObject(objectId, { conditions: conditions });
            this.setState({
                conditions: conditions,
                objectInfo: objectInfo.object,
                objectMeta: objectInfo.meta,
            });
        } finally {
            this.setState({ loading: false });
        }
    }

    public getConditions(): Condition[] {
        const query = new URLSearchParams(this.props.objectQuery);
        return [...query.entries()].map(x => ({
            path: x[0],
            value: x[1],
            operator: ObjectFieldFilterOperator.Equals,
        }));
    }

    public handleChange = async (value: string, path: string[]): Promise<void> => {
        const { conditions, objectMeta, objectInfo } = this.state;
        if (objectMeta == null || objectInfo == null) {
            return;
        }

        const oldValue = get(objectInfo, path);
        if ((oldValue == null && value == null) || (oldValue != null && String(oldValue) === value)) {
            return;
        }

        await this.props.dbViewerApi.updateObject(objectMeta.identifier, {
            conditions: conditions,
            path: path,
            value: value,
        });

        await this.load();
    };

    public async handleDelete(): Promise<void> {
        const { conditions, objectMeta } = this.state;
        const { dbViewerApi } = this.props;
        if (objectMeta != null) {
            await dbViewerApi.deleteObject(objectMeta.identifier, { conditions: conditions });
            this.props.history.push(RouteUtils.backUrl(this.props.match));
            return;
        }
        throw new Error("Пытаемся удалить объект с типом массив");
    }

    public handleCopyObject = () => {
        CopyToClipboardToast.copyText(JSON.stringify(this.state.objectInfo, null, 4));
    };

    public handleTryDeleteObject = () => {
        this.setState({ showConfirmModal: true });
    };

    public handleCancelDelete = () => {
        this.setState({ showConfirmModal: false });
    };

    public handleConfirmDelete = () => {
        this.handleDelete();
    };

    public render(): JSX.Element {
        const { objectId, isSuperUser, customRenderer, useErrorHandlingContainer, withBackLink } = this.props;
        const { objectInfo, objectMeta, loading } = this.state;
        if (objectInfo == null) {
            return <ObjectNotFoundPage withBackUrl={withBackLink} />;
        }

        const { allowEdit, allowDelete } = objectMeta?.schemaDescription || { allowEdit: false, allowDelete: false };

        return (
            <CommonLayout>
                {useErrorHandlingContainer && <ErrorHandlingContainer />}
                {withBackLink && (
                    <CommonLayout.GoBack to={RouteUtils.backUrl(this.props.match)} data-tid="GoBack">
                        Вернуться к списку объектов
                    </CommonLayout.GoBack>
                )}
                <CommonLayout.ContentLoader active={loading}>
                    <CommonLayout.GreyLineHeader
                        title={objectId}
                        tools={
                            <RowStack baseline block gap={2}>
                                <Fit>
                                    <Link icon={<CopyIcon />} onClick={this.handleCopyObject} data-tid="Copy">
                                        Скопировать
                                    </Link>
                                </Fit>
                                <Fit>
                                    {allowDelete && isSuperUser && (
                                        <Link
                                            icon={<TrashIcon />}
                                            onClick={this.handleTryDeleteObject}
                                            data-tid="Delete">
                                            Удалить
                                        </Link>
                                    )}
                                </Fit>
                            </RowStack>
                        }>
                        <ObjectKeys
                            keys={(objectMeta?.typeMetaInformation?.properties || [])
                                .filter(x => x.isIdentity)
                                .map(x => ({ name: x.name, value: String(objectInfo[x.name]) }))}
                        />
                    </CommonLayout.GreyLineHeader>
                    <CommonLayout.Content>
                        <ColumnStack gap={4} block>
                            <Fit style={{ maxWidth: "100%" }}>
                                {objectMeta != null && (
                                    <ObjectViewer
                                        objectInfo={objectInfo}
                                        objectMeta={objectMeta}
                                        allowEdit={allowEdit && isSuperUser}
                                        customRenderer={customRenderer}
                                        onChange={this.handleChange}
                                    />
                                )}
                            </Fit>
                        </ColumnStack>
                    </CommonLayout.Content>
                    {this.state.showConfirmModal && allowDelete && isSuperUser && (
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
