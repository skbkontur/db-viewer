import CopyIcon from "@skbkontur/react-icons/Copy";
import TrashIcon from "@skbkontur/react-icons/Trash";
import { ColumnStack, Fit, RowStack } from "@skbkontur/react-stack-layout";
import { Link } from "@skbkontur/react-ui";
import get from "lodash/get";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router";

import { CopyToClipboardToast } from "../Components/AllowCopyToClipboard";
import { ConfirmDeleteObjectModal } from "../Components/ConfirmDeleteObjectModal/ConfirmDeleteObjectModal";
import { ErrorHandlingContainer } from "../Components/ErrorHandling/ErrorHandlingContainer";
import { GoBackLink } from "../Components/GoBackLink/GoBackLink";
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

interface ObjectDetailsProps {
    isSuperUser: boolean;
    dbViewerApi: IDbViewerApi;
    customRenderer: ICustomRenderer;
    useErrorHandlingContainer: boolean;
}

export const ObjectDetailsContainer = ({
    isSuperUser,
    dbViewerApi,
    customRenderer,
    useErrorHandlingContainer,
}: ObjectDetailsProps): JSX.Element => {
    const { search, pathname } = useLocation();
    const navigate = useNavigate();
    const { objectId = "" } = useParams<"objectId">();
    const [conditions, setConditions] = useState<Condition[]>([]);
    const [objectInfo, setObjectInfo] = useState<Nullable<{}>>({});
    const [objectMeta, setObjectMeta] = useState<null | ObjectDescription>(null);
    const [loading, setLoading] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);

    useEffect(() => {
        loadData();
    }, [objectId, search]);

    const loadData = async (): Promise<void> => {
        setLoading(true);
        try {
            const conditions = getConditions();
            const { object, meta } = await dbViewerApi.readObject(objectId, { conditions: conditions });
            setConditions(conditions);
            setObjectInfo(object);
            setObjectMeta(meta);
        } finally {
            setLoading(false);
        }
    };

    const getConditions = (): Condition[] => {
        const query = new URLSearchParams(search);
        return [...query.entries()].map(x => ({
            path: x[0],
            value: x[1],
            operator: ObjectFieldFilterOperator.Equals,
        }));
    };

    const handleChange = async (value: string, path: string[]): Promise<void> => {
        if (!objectMeta || !objectInfo) {
            return;
        }

        const oldValue = get(objectInfo, path);
        if ((!oldValue && !value) || (oldValue && String(oldValue) === value)) {
            return;
        }

        await dbViewerApi.updateObject(objectMeta.identifier, {
            conditions: conditions,
            path: path,
            value: value,
        });

        await loadData();
    };

    const handleDelete = async (): Promise<void> => {
        if (objectMeta) {
            await dbViewerApi.deleteObject(objectMeta.identifier, { conditions: conditions });
            navigate(RouteUtils.backUrl(pathname));
            return;
        }
        throw new Error("Пытаемся удалить объект с типом массив");
    };

    if (!objectInfo) {
        return <ObjectNotFoundPage />;
    }

    const { allowEdit, allowDelete } = objectMeta?.schemaDescription || { allowEdit: false, allowDelete: false };
    return (
        <CommonLayout>
            {useErrorHandlingContainer && <ErrorHandlingContainer />}
            <CommonLayout.ContentLoader active={loading}>
                <CommonLayout.GreyLineHeader
                    title={
                        <RowStack gap={3} verticalAlign="center">
                            <GoBackLink backUrl={RouteUtils.backUrl(pathname)} />
                            <span>{objectId}</span>
                        </RowStack>
                    }
                    tools={
                        <RowStack baseline block gap={2}>
                            <Fit>
                                <Link
                                    icon={<CopyIcon />}
                                    onClick={() => CopyToClipboardToast.copyText(JSON.stringify(objectInfo, null, 4))}
                                    data-tid="Copy">
                                    Скопировать
                                </Link>
                            </Fit>
                            <Fit>
                                {allowDelete && isSuperUser && (
                                    <Link
                                        icon={<TrashIcon />}
                                        onClick={() => setShowConfirmModal(true)}
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
                                    onChange={handleChange}
                                />
                            )}
                        </Fit>
                    </ColumnStack>
                </CommonLayout.Content>
                {showConfirmModal && allowDelete && isSuperUser && (
                    <ConfirmDeleteObjectModal onDelete={handleDelete} onCancel={() => setShowConfirmModal(false)} />
                )}
            </CommonLayout.ContentLoader>
        </CommonLayout>
    );
};
