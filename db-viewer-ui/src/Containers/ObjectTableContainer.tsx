import { ColumnStack, Fit, RowStack } from "@skbkontur/react-stack-layout";
import { Link, Loader, Paging } from "@skbkontur/react-ui";
import isEqual from "lodash/isEqual";
import React from "react";
import { RouteComponentProps, withRouter } from "react-router";

import { ErrorHandlingContainer } from "../Components/ErrorHandling/ErrorHandlingContainer";
import { GoBackLink } from "../Components/GoBackLink/GoBackLink";
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

interface ObjectTableProps extends RouteComponentProps {
    dbViewerApi: IDbViewerApi;
    customRenderer: ICustomRenderer;
    useErrorHandlingContainer: boolean;
    objectId: string;
    urlQuery: string;
    isSuperUser: boolean;
    path: string;
}

interface ObjectTableState {
    objects: null | SearchResult;
    loading: boolean;
    showModalFilter: boolean;
    metaInformation: null | ObjectDescription;
    displaySearchFilter: boolean;
    displayShowFilter: boolean;
    query: ObjectSearchQuery;
    downloading: boolean;
    showDownloadModal: boolean;
    downloadCount?: CountResult;
}

function getDefaultQuery(): ObjectSearchQuery {
    return {
        conditions: [],
        offset: 0,
        count: 20,
        hiddenColumns: [],
        sorts: [],
    };
}

class ObjectTableContainerInternal extends React.Component<ObjectTableProps, ObjectTableState> {
    public state: ObjectTableState = {
        objects: null,
        loading: false,
        metaInformation: null,
        query: getDefaultQuery(),
        displaySearchFilter: false,
        displayShowFilter: false,
        showModalFilter: false,
        downloading: false,
        showDownloadModal: false,
    };

    public componentDidMount() {
        const { urlQuery } = this.props;
        this.setState({ query: this.parseQuery(urlQuery) }, this.loadMetaAndObjectsIfNecessary);
    }

    public componentDidUpdate(prevProps: ObjectTableProps) {
        if (prevProps.urlQuery !== this.props.urlQuery) {
            this.setState({ query: this.parseQuery(this.props.urlQuery) }, () => {
                if (this.checkForNecessityLoad(prevProps.urlQuery)) {
                    this.loadObjectsWithLoader();
                }
            });
        }
    }

    public render(): JSX.Element {
        const {
            loading,
            objects,
            metaInformation,
            query: { offset, count, sorts },
            downloading,
            showDownloadModal,
            downloadCount,
        } = this.state;
        let properties: PropertyMetaInformation[] = [];
        if (metaInformation?.typeMetaInformation?.properties) {
            properties = PropertyMetaInformationUtils.getProperties(metaInformation.typeMetaInformation.properties);
        }

        const { objectId, useErrorHandlingContainer, match, customRenderer, isSuperUser } = this.props;

        const { allowReadAll, allowDelete, allowSort } = metaInformation?.schemaDescription || {
            allowReadAll: false,
            allowDelete: false,
            allowSort: false,
        };

        return (
            <CommonLayout>
                {useErrorHandlingContainer && <ErrorHandlingContainer />}
                <CommonLayout.Header
                    title={
                        <RowStack gap={3} verticalAlign="bottom">
                            <GoBackLink backUrl={RouteUtils.backUrl(match)} />
                            <div style={{ maxWidth: 410, wordBreak: "break-all" }}>{objectId}</div>
                        </RowStack>
                    }
                    tools={
                        <ObjectTableLayoutHeader
                            query={this.state.query}
                            allowReadAll={allowReadAll}
                            properties={properties}
                            onChange={this.handleChangeModalFilter}
                            onDownloadClick={this.handleCheckCount}
                            onDownloadAbort={this.handleCloseDownloadModal}
                            downloading={downloading}
                            showDownloadModal={showDownloadModal}
                            showModalFilter={this.state.showModalFilter}
                            downloadCount={downloadCount}
                        />
                    }
                />
                <CommonLayout.Content>
                    <Loader type="big" active={loading}>
                        <ColumnStack gap={4}>
                            <Fit>
                                {objects &&
                                    this.renderItemsCount(
                                        offset,
                                        count,
                                        objects.count || objects.items.length,
                                        objects.countLimit
                                    )}
                            </Fit>
                            <Fit style={{ maxWidth: "inherit" }}>
                                {objects != null && objects.items && objects.items.length > 0 ? (
                                    properties && (
                                        <ObjectTable
                                            properties={this.getVisibleProperties(properties)}
                                            objectType={metaInformation?.identifier || ""}
                                            customRenderer={customRenderer}
                                            currentSorts={sorts}
                                            items={
                                                objects.count == null
                                                    ? objects.items.slice(offset, offset + count)
                                                    : objects.items
                                            }
                                            onDetailsClick={this.getDetailsUrl}
                                            onDeleteClick={this.handleDeleteObject}
                                            onChangeSortClick={this.handleChangeSort}
                                            allowDelete={isSuperUser && allowDelete}
                                            allowSort={allowSort}
                                        />
                                    )
                                ) : (
                                    <RowStack block gap={1} baseline data-tid="NothingFound">
                                        <Fit>Ничего не найдено</Fit>
                                        <Fit>
                                            <Link onClick={() => this.updateQuery(getDefaultQuery())}>
                                                Сбросьте фильтр
                                            </Link>
                                        </Fit>
                                        <Fit>или</Fit>
                                        <Fit>
                                            <Link onClick={this.handleOpenFilter}>измените</Link>
                                        </Fit>
                                        <Fit>параметры фильтрации</Fit>
                                    </RowStack>
                                )}
                            </Fit>
                            <Fit>{this.renderPageNavigation()}</Fit>
                        </ColumnStack>
                    </Loader>
                </CommonLayout.Content>
            </CommonLayout>
        );
    }

    private checkForNecessityLoad(prevQuery: string): boolean {
        const { urlQuery } = this.props;
        if (prevQuery !== urlQuery) {
            const prevState = ObjectSearchQueryMapping.normalize(
                this.parseQuery(prevQuery),
                !this.state.objects?.count
            );
            const nextState = ObjectSearchQueryMapping.normalize(this.parseQuery(urlQuery), !this.state.objects?.count);
            return !isEqual(nextState, prevState);
        }
        return false;
    }

    private async loadMetaAndObjectsIfNecessary(): Promise<void> {
        const { dbViewerApi, objectId } = this.props;
        this.setState({ loading: true });
        try {
            const metaInformation = await dbViewerApi.getMeta(objectId);
            this.setState({ metaInformation: metaInformation });
            await this.loadObjectsIfAllowed(metaInformation);
        } finally {
            this.setState({ loading: false });
        }
    }

    private async loadObjectsWithLoader(): Promise<void> {
        const meta = this.state.metaInformation;
        if (meta == null) {
            return;
        }

        this.setState({ loading: true });
        try {
            await this.loadObjectsIfAllowed(meta);
        } finally {
            this.setState({ loading: false });
        }
    }

    private async loadObjectsIfAllowed(meta: ObjectDescription) {
        const allowReadAll = meta.schemaDescription.allowReadAll;
        const props = meta.typeMetaInformation?.properties || [];
        const conditions = this.state.query.conditions || [];
        if (allowReadAll || PropertyMetaInformationUtils.hasFilledRequiredFields(conditions, props)) {
            await this.loadObjects();
        } else {
            this.setState({ showModalFilter: true, objects: null });
        }
    }

    private async loadObjects(): Promise<void> {
        const { dbViewerApi, objectId } = this.props;
        const { offset, count, conditions, sorts } = this.state.query;
        const objects = await dbViewerApi.searchObjects(objectId, {
            conditions: conditions,
            sorts: sorts,
            excludedFields: [],
            offset: offset,
            count: count,
        });
        this.setState({ objects: objects });
    }

    private getVisibleProperties(properties: PropertyMetaInformation[]): PropertyMetaInformation[] {
        return properties.filter(item => !this.state.query.hiddenColumns.includes(item.name));
    }

    private readonly updateQuery = (queryUpdate: Partial<ObjectSearchQuery>) => {
        let offset = queryUpdate.offset ?? this.state.query.offset;
        if (offset !== 0 && queryUpdate.count) {
            offset = Math.floor(offset / queryUpdate.count) * queryUpdate.count;
        }
        this.setState(
            {
                showModalFilter: false,
                query: {
                    ...this.state.query,
                    ...queryUpdate,
                    offset: offset,
                },
            },
            this.updateRoute
        );
    };

    private readonly getItemConditions = (item: object): Condition[] => {
        const properties = this.state.metaInformation?.typeMetaInformation.properties || [];
        return properties
            .filter(x => x.isIdentity)
            .map(x => ({
                value: item[x.name],
                path: x.name,
                operator: ObjectFieldFilterOperator.Equals,
            }));
    };

    private readonly getDetailsUrl = (item: object): string => {
        const properties = this.state.metaInformation?.typeMetaInformation.properties || [];
        const query = {};
        for (const prop of properties) {
            if (prop.isIdentity) {
                query[prop.name] = item[prop.name];
            }
        }
        return RouteUtils.goTo(this.props.path, `details?${new URLSearchParams(query)}`);
    };

    private readonly handleOpenFilter = () => {
        this.setState({ showModalFilter: true });
    };

    private renderItemsCount(offset: number, countPerPage: number, count: number, countLimit: number): JSX.Element {
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

    private renderPageNavigation(): null | JSX.Element {
        const {
            objects,
            query: { offset, count },
        } = this.state;
        if (objects == null) {
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
                onPageChange={this.goToPage}
            />
        );
    }

    private readonly handleChangeModalFilter = (value: Nullable<Partial<ObjectSearchQuery>>) => {
        if (value == null) {
            this.updateQuery(getDefaultQuery());
        } else {
            this.updateQuery(value);
        }
    };

    private readonly handleCloseDownloadModal = () => {
        this.setState({ showDownloadModal: false });
    };

    private readonly handleCheckCount = async (): Promise<void> => {
        const { metaInformation } = this.state;
        if (!metaInformation) {
            return;
        }

        this.setState({ downloading: true });
        try {
            const { dbViewerApi } = this.props;
            const { conditions, sorts, hiddenColumns } = this.state.query;

            const query = {
                conditions: conditions,
                sorts: sorts,
                excludedFields: hiddenColumns,
            };
            const downloadResult = await dbViewerApi.countObjects(metaInformation.identifier, query);

            const count = downloadResult.count ?? 0;
            if (count > downloadResult.countLimit) {
                this.setState({ downloading: false, showDownloadModal: true, downloadCount: downloadResult });
                return;
            }

            window.location.href = dbViewerApi.getDownloadObjectsUrl(metaInformation.identifier, JSON.stringify(query));
        } finally {
            this.setState({ downloading: false });
        }
    };

    private handleDeleteObject = async (index: number): Promise<void> => {
        const { objects, metaInformation } = this.state;
        const { dbViewerApi } = this.props;
        if (objects != null && objects.items != null && objects.items.length >= index && metaInformation != null) {
            const conditions = this.getItemConditions(objects.items[index]);
            await dbViewerApi.deleteObject(metaInformation.identifier, { conditions: conditions });
            await this.loadObjects();
        }
    };

    private handleChangeSort = (columnName: string) => {
        const { sorts } = this.state.query;
        const currentSortIndex = sorts.findIndex(x => x.path === columnName);
        if (currentSortIndex === -1) {
            this.updateQuery({
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
            this.updateQuery({
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
            this.updateQuery({
                sorts: [...sorts.slice(0, currentSortIndex), ...sorts.slice(currentSortIndex + 1)],
            });
        }
    };

    private updateRoute() {
        this.props.history.push(this.getQuery());
    }

    private getQuery(overrides: Partial<ObjectSearchQuery> = {}): string {
        const { query, metaInformation } = this.state;
        const { path } = this.props;
        let properties: PropertyMetaInformation[] = [];
        if (metaInformation?.typeMetaInformation?.properties) {
            properties = PropertyMetaInformationUtils.getProperties(metaInformation.typeMetaInformation.properties);
        }
        return (
            path +
            ObjectSearchQueryMapping.stringify(
                { ...query, ...overrides },
                properties.map(x => x.name)
            )
        );
    }

    private parseQuery(urlQuery: string): ObjectSearchQuery {
        const { metaInformation } = this.state;
        let properties: PropertyMetaInformation[] = [];
        if (metaInformation?.typeMetaInformation?.properties) {
            properties = PropertyMetaInformationUtils.getProperties(metaInformation.typeMetaInformation.properties);
        }
        return ObjectSearchQueryMapping.parse(
            urlQuery,
            properties.map(x => x.name)
        );
    }

    private readonly goToPage = (page: number) => {
        this.props.history.push(this.getQuery({ offset: (page - 1) * this.state.query.count }));
    };
}

export const ObjectTableContainer = withRouter(ObjectTableContainerInternal);
