import { ColumnStack, Fit, RowStack } from "@skbkontur/react-stack-layout";
import { Link, Loader, Paging } from "@skbkontur/react-ui";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router";

import { ErrorHandlingContainer } from "../Components/ErrorHandling/ErrorHandlingContainer";
import { CommonLayout } from "../Components/Layouts/CommonLayout";
import { ObjectTable } from "../Components/ObjectTable/ObjectTable";
import { ObjectTableLayoutHeader } from "../Components/ObjectTableLayoutHeader/ObjectTableLayoutHeader";
import { Condition } from "../Domain/Api/DataTypes/Condition";
import { CountResult } from "../Domain/Api/DataTypes/CountResult";
import { ObjectDescription } from "../Domain/Api/DataTypes/ObjectDescription";
import { ObjectFieldFilterOperator } from "../Domain/Api/DataTypes/ObjectFieldFilterOperator";
import { ObjectFilterSortOrder } from "../Domain/Api/DataTypes/ObjectFilterSortOrder";
import { PropertyMetaInformation } from "../Domain/Api/DataTypes/PropertyMetaInformation";
import { SearchResult } from "../Domain/Api/DataTypes/SearchResult";
import { IDbViewerApi } from "../Domain/Api/DbViewerApi";
import { ICustomRenderer } from "../Domain/Objects/CustomRenderer";
import { ObjectSearchQuery } from "../Domain/Objects/ObjectSearchQuery";
import { ObjectSearchQueryMapping } from "../Domain/Objects/ObjectSearchQueryMapping";
import { PropertyMetaInformationUtils } from "../Domain/Objects/PropertyMetaInformationUtils";
import { RouteUtils } from "../Domain/Utils/RouteUtils";

interface ObjectTableProps {
    dbViewerApi: IDbViewerApi;
    customRenderer: ICustomRenderer;
    useErrorHandlingContainer: boolean;
    isSuperUser: boolean;
}

const getDefaultQuery = () => ({
    conditions: [],
    offset: 0,
    count: 20,
    hiddenColumns: [],
    sorts: [],
});

export const ObjectTableContainer = ({
    dbViewerApi,
    customRenderer,
    useErrorHandlingContainer,
    isSuperUser,
}: ObjectTableProps): React.ReactElement => {
    const { search, pathname } = useLocation();
    const navigate = useNavigate();
    const { objectId = "" } = useParams<"objectId">();

    const [objects, setObjects] = useState<SearchResult | null>(null);
    const [loading, setLoading] = useState(false);
    const [showModalFilter, setShowModalFilter] = useState(false);
    const [metaInformation, setMetaInformation] = useState<ObjectDescription | null>(null);
    const [query, setQuery] = useState<ObjectSearchQuery>(getDefaultQuery());
    const [downloading, setDownloading] = useState(false);
    const [shouldLoadObjects, setShouldLoadObjects] = useState(false);
    const [showDownloadModal, setShowDownloadModal] = useState(false);
    const [downloadCount, setDownloadCount] = useState<CountResult | undefined>(undefined);

    useEffect(() => {
        loadData();
    }, []);

    useEffect(() => {
        if (metaInformation) {
            const nextQuery = parseQuery(search, metaInformation);
            setQuery(nextQuery);
            setShouldLoadObjects(true);
        }
    }, [search]);

    useEffect(() => {
        if (shouldLoadObjects) {
            setShouldLoadObjects(false);
            loadObjectsWithLoader();
        }
    }, [query]);

    function handleChangeModalFilter(value: Nullable<Partial<ObjectSearchQuery>>): void {
        if (!value) {
            updateQuery(getDefaultQuery());
        } else {
            updateQuery(value);
        }
    }

    const handleCheckCount = async (): Promise<void> => {
        if (!metaInformation) {
            return;
        }

        setDownloading(true);
        try {
            const { conditions, sorts, hiddenColumns } = query;

            const newQuery = {
                conditions: conditions,
                sorts: sorts,
                excludedFields: hiddenColumns,
            };
            const downloadResult = await dbViewerApi.countObjects(metaInformation.identifier, newQuery);

            const count = downloadResult.count ?? 0;
            if (count > downloadResult.countLimit) {
                setDownloading(false);
                setShowDownloadModal(true);
                setDownloadCount(downloadResult);
                return;
            }

            window.location.href = dbViewerApi.getDownloadObjectsUrl(
                metaInformation.identifier,
                JSON.stringify(newQuery)
            );
        } finally {
            setDownloading(false);
        }
    };

    const handleDeleteObject = async (index: number): Promise<void> => {
        if (objects?.items && objects.items.length >= index && metaInformation) {
            const conditions = getItemConditions(objects.items[index]);
            await dbViewerApi.deleteObject(metaInformation.identifier, { conditions });
            await loadObjects(query);
        }
    };

    const handleResetQuery = () => updateQuery(getDefaultQuery());
    const handleOpenFilter = () => setShowModalFilter(true);
    const handleCloseDownloadModal = () => setShowDownloadModal(false);

    const handleChangeSort = (columnName: string) => {
        const { sorts } = query;
        const currentSortIndex = sorts.findIndex(x => x.path === columnName);
        if (currentSortIndex === -1) {
            updateQuery({
                sorts: [
                    ...sorts,
                    {
                        path: columnName,
                        sortOrder: ObjectFilterSortOrder.Ascending,
                    },
                ],
            });
            return;
        }

        const currentSortOrder = sorts[currentSortIndex].sortOrder;
        if (currentSortOrder === ObjectFilterSortOrder.Ascending) {
            updateQuery({
                sorts: [
                    ...sorts.slice(0, currentSortIndex),
                    {
                        path: columnName,
                        sortOrder: ObjectFilterSortOrder.Descending,
                    },
                    ...sorts.slice(currentSortIndex + 1),
                ],
            });
            return;
        }

        if (currentSortOrder === ObjectFilterSortOrder.Descending) {
            updateQuery({
                sorts: [...sorts.slice(0, currentSortIndex), ...sorts.slice(currentSortIndex + 1)],
            });
        }
    };

    const goToPage = (page: number) => {
        navigate(getQuery(query, { offset: (page - 1) * query.count }));
    };

    function renderItemsCount(
        offset: number,
        countPerPage: number,
        count: number,
        countLimit: number
    ): React.ReactElement {
        const total = count > countLimit ? countLimit : count;
        const firstNumber = Math.min(total, offset);
        const lastNumber = Math.min(total, offset + countPerPage);

        return (
            <RowStack block gap={2} baseline data-tid="ItemsCountInfo">
                <Fit>
                    Записи с {firstNumber} по {lastNumber}
                </Fit>
                <Fit>|</Fit>
                <Fit>Всего {count > countLimit ? `${countLimit.toString()}+` : count}</Fit>
            </RowStack>
        );
    }

    function renderPageNavigation(): null | React.ReactElement {
        const { offset, count } = query;
        if (!objects) {
            return null;
        }
        const trueCount = objects.count || objects.items.length;
        const totalCount = trueCount > objects.countLimit ? objects.countLimit : trueCount;
        if (totalCount == null || totalCount === 0 || Math.ceil(totalCount / count) <= 1) {
            return null;
        }
        return (
            <Paging
                data-tid="Paging"
                activePage={Math.floor(offset / count) + 1}
                pagesCount={Math.ceil(totalCount / count)}
                onPageChange={goToPage}
            />
        );
    }

    const { offset, count, sorts } = query;
    let properties: PropertyMetaInformation[] = [];
    if (metaInformation?.typeMetaInformation?.properties) {
        properties = PropertyMetaInformationUtils.getProperties(metaInformation.typeMetaInformation.properties);
    }

    const { allowReadAll, allowDelete, allowSort } = metaInformation?.schemaDescription || {
        allowReadAll: false,
        allowDelete: false,
        allowSort: false,
    };

    return (
        <CommonLayout withArrow>
            <CommonLayout.GoBack to={RouteUtils.backUrl(pathname)} />
            {useErrorHandlingContainer && <ErrorHandlingContainer />}
            <CommonLayout.Header
                title={objectId}
                tools={
                    <ObjectTableLayoutHeader
                        query={query}
                        allowReadAll={allowReadAll}
                        properties={properties}
                        onChange={handleChangeModalFilter}
                        onDownloadClick={handleCheckCount}
                        onDownloadAbort={handleCloseDownloadModal}
                        downloading={downloading}
                        showDownloadModal={showDownloadModal}
                        showModalFilter={showModalFilter}
                        downloadCount={downloadCount}
                    />
                }
            />
            <CommonLayout.Content>
                <Loader type="big" active={loading}>
                    <ColumnStack gap={4}>
                        <Fit>
                            {objects &&
                                renderItemsCount(
                                    offset,
                                    count,
                                    objects.count || objects.items.length,
                                    objects.countLimit
                                )}
                        </Fit>
                        <Fit style={{ maxWidth: "inherit" }}>
                            {objects?.items && objects.items.length > 0 ? (
                                properties && (
                                    <ObjectTable
                                        properties={getVisibleProperties(properties)}
                                        objectType={metaInformation?.identifier || ""}
                                        customRenderer={customRenderer}
                                        currentSorts={sorts}
                                        items={
                                            objects.count == null
                                                ? objects.items.slice(offset, offset + count)
                                                : objects.items
                                        }
                                        onDetailsClick={getDetailsUrl}
                                        onDeleteClick={handleDeleteObject}
                                        onChangeSortClick={handleChangeSort}
                                        allowDelete={isSuperUser && allowDelete}
                                        allowSort={allowSort}
                                    />
                                )
                            ) : (
                                <RowStack block gap={1} baseline data-tid="NothingFound">
                                    <Fit>Ничего не найдено</Fit>
                                    <Fit>
                                        <Link onClick={handleResetQuery}>Сбросьте фильтр</Link>
                                    </Fit>
                                    <Fit>или</Fit>
                                    <Fit>
                                        <Link onClick={handleOpenFilter}>измените</Link>
                                    </Fit>
                                    <Fit>параметры фильтрации</Fit>
                                </RowStack>
                            )}
                        </Fit>
                        <Fit>{renderPageNavigation()}</Fit>
                    </ColumnStack>
                </Loader>
            </CommonLayout.Content>
        </CommonLayout>
    );

    async function loadData() {
        setLoading(true);
        try {
            const metaInformation = await dbViewerApi.getMeta(objectId);
            const query = parseQuery(search, metaInformation);
            setMetaInformation(metaInformation);
            setQuery(query);
            await loadObjectsIfAllowed(metaInformation, query);
        } finally {
            setLoading(false);
        }
    }

    async function loadObjectsWithLoader(): Promise<void> {
        if (!metaInformation) {
            return;
        }
        setLoading(true);
        try {
            await loadObjectsIfAllowed(metaInformation, query);
        } finally {
            setLoading(false);
        }
    }

    async function loadObjectsIfAllowed(meta: ObjectDescription, query: ObjectSearchQuery) {
        const allowReadAll = meta.schemaDescription.allowReadAll;
        const props = meta.typeMetaInformation?.properties || [];
        const conditions = query.conditions || [];
        if (allowReadAll || PropertyMetaInformationUtils.hasFilledRequiredFields(conditions, props)) {
            await loadObjects(query);
        } else {
            setShowModalFilter(true);
            setObjects(null);
        }
    }

    async function loadObjects({ offset, count, conditions, sorts }: ObjectSearchQuery): Promise<void> {
        const objects = await dbViewerApi.searchObjects(objectId, {
            conditions,
            sorts,
            offset,
            count,
            excludedFields: [],
        });
        setObjects(objects);
    }

    function getVisibleProperties(properties: PropertyMetaInformation[]): PropertyMetaInformation[] {
        return properties.filter(({ name }) => !query.hiddenColumns.includes(name));
    }

    function updateQuery(queryUpdate: Partial<ObjectSearchQuery>) {
        let offset = queryUpdate.offset ?? query.offset;
        if (offset !== 0 && queryUpdate.count) {
            offset = Math.floor(offset / queryUpdate.count) * queryUpdate.count;
        }
        setShowModalFilter(false);
        const newQuery = {
            ...query,
            ...queryUpdate,
            offset,
        };
        setQuery(newQuery);
        navigate(getQuery(newQuery));
    }

    function getItemConditions(item: object): Condition[] {
        const properties = metaInformation?.typeMetaInformation.properties || [];
        return properties
            .filter(x => x.isIdentity)
            .map(x => ({
                value: item[x.name],
                path: x.name,
                operator: ObjectFieldFilterOperator.Equals,
            }));
    }

    function getDetailsUrl(item: object): string {
        const properties = metaInformation?.typeMetaInformation.properties || [];
        const query = {};
        for (const prop of properties) {
            if (prop.isIdentity) {
                query[prop.name] = item[prop.name];
            }
        }
        return RouteUtils.goTo(pathname, `details?${new URLSearchParams(query)}`);
    }

    function getQuery(newQuery: ObjectSearchQuery, overrides: Partial<ObjectSearchQuery> = {}): string {
        let properties: PropertyMetaInformation[] = [];
        if (metaInformation?.typeMetaInformation?.properties) {
            properties = PropertyMetaInformationUtils.getProperties(metaInformation.typeMetaInformation.properties);
        }
        return (
            pathname +
            ObjectSearchQueryMapping.stringify(
                { ...newQuery, ...overrides },
                properties.map(x => x.name)
            )
        );
    }

    function parseQuery(urlQuery: string, metaInformation: ObjectDescription): ObjectSearchQuery {
        let properties: PropertyMetaInformation[] = [];
        if (metaInformation?.typeMetaInformation?.properties) {
            properties = PropertyMetaInformationUtils.getProperties(metaInformation.typeMetaInformation.properties);
        }
        return ObjectSearchQueryMapping.parse(
            urlQuery,
            properties.map(x => x.name)
        );
    }
};
