import { ColumnStack, Fit, RowStack } from "@skbkontur/react-stack-layout";
import Link from "@skbkontur/react-ui/Link";
import Loader from "@skbkontur/react-ui/Loader";
import Paging from "@skbkontur/react-ui/Paging";
import _ from "lodash";
import qs from "qs";
import React from "react";
import { RouteComponentProps, withRouter } from "react-router-dom";

import { ErrorHandlingContainer } from "../Components/ErrorHandling/ErrorHandlingContainer";
import { CommonLayout } from "../Components/Layouts/CommonLayout";
import { ObjectTable } from "../Components/ObjectTable/ObjectTable";
import { ObjectTableLayoutHeader } from "../Components/ObjectTableLayoutHeader/ObjectTableLayoutHeader";
import { DownloadResult } from "../Domain/Api/DataTypes/DownloadResult";
import { ObjectDescription } from "../Domain/Api/DataTypes/ObjectDescription";
import { ObjectFilterSortOrder } from "../Domain/Api/DataTypes/ObjectFilterSortOrder";
import { PropertyMetaInformation } from "../Domain/Api/DataTypes/PropertyMetaInformation";
import { SearchResult } from "../Domain/Api/DataTypes/SearchResult";
import { IDbViewerApi } from "../Domain/Api/DbViewerApi";
import { ICustomRenderer } from "../Domain/Objects/CustomRenderer";
import { ObjectSearchQuery } from "../Domain/Objects/ObjectSearchQuery";
import { ConditionsMapper, SortMapper } from "../Domain/Objects/ObjectSearchQueryUtils";
import { PropertyMetaInformationUtils } from "../Domain/Objects/PropertyMetaInformationUtils";
import { QueryStringMapping } from "../Domain/QueryStringMapping/QueryStringMapping";
import { QueryStringMappingBuilder } from "../Domain/QueryStringMapping/QueryStringMappingBuilder";
import { FileUtils } from "../Domain/Utils/FileUtils";
import { RouteUtils } from "../Domain/Utils/RouteUtils";

interface ObjectTableProps extends RouteComponentProps {
    dbViewerApi: IDbViewerApi;
    customRenderer: ICustomRenderer;
    useErrorHandlingContainer: boolean;
    objectId: string;
    urlQuery: string;
    allowEdit: boolean;
    path: string;
}

interface ObjectTableState {
    objects: null | SearchResult<object>;
    loading: boolean;
    showModalFilter: boolean;
    metaInformation: null | ObjectDescription;
    displaySearchFilter: boolean;
    displayShowFilter: boolean;
    query: ObjectSearchQuery;
    downloading: boolean;
    showDownloadModal: boolean;
    downloadCount?: DownloadResult;
}

const objectsQueryMapping: QueryStringMapping<ObjectSearchQuery> = new QueryStringMappingBuilder<ObjectSearchQuery>()
    .mapToInteger(x => x.count, "count", 20)
    .mapToInteger(x => x.offset, "offset", 0)
    .mapToStringArray(x => x.hiddenColumns, "hiddenColumns", [])
    .mapTo(x => x.sort, new SortMapper("sort"))
    .mapTo(x => x.conditions, new ConditionsMapper(["sort", "count", "offset", "hiddenColumns", "countLimit"]))
    .build();

function getDefaultQuery(): ObjectSearchQuery {
    return {
        conditions: [],
        offset: 0,
        count: 20,
        hiddenColumns: [],
        sort: null,
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
        if (this.checkForNecessityLoad(prevProps.urlQuery)) {
            this.setState({ query: this.parseQuery(this.props.urlQuery) }, this.loadObjectsWithLoader);
        }
    }

    public render(): JSX.Element {
        const {
            loading,
            objects,
            metaInformation,
            query: { offset, count, sort },
            downloading,
            showDownloadModal,
            downloadCount,
        } = this.state;
        let properties: PropertyMetaInformation[] = [];
        if (metaInformation?.typeMetaInformation?.properties) {
            properties = PropertyMetaInformationUtils.getProperties(metaInformation.typeMetaInformation.properties);
        }

        const { allowReadAll, allowDelete } = metaInformation?.schemaDescription || {
            allowReadAll: false,
            allowDelete: false,
        };

        return (
            <CommonLayout>
                {this.props.useErrorHandlingContainer && <ErrorHandlingContainer />}
                <CommonLayout.GoBack to={RouteUtils.backUrl(this.props)} data-tid="GoToObjectsList">
                    Вернуться к списку видов объектов
                </CommonLayout.GoBack>
                <CommonLayout.Header
                    title={<div style={{ maxWidth: 410, wordBreak: "break-all" }}>{this.props.objectId}</div>}
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
                                {objects && this.renderItemsCount(offset, count, objects.count, objects.countLimit)}
                            </Fit>
                            <Fit style={{ maxWidth: "inherit" }}>
                                {objects != null && objects.items && objects.items.length > 0 ? (
                                    properties && (
                                        <ObjectTable
                                            properties={this.getVisibleProperties(properties)}
                                            objectType={metaInformation?.identifier || ""}
                                            customRenderer={this.props.customRenderer}
                                            currentSort={sort}
                                            items={objects.items}
                                            onDetailsClick={this.getDetailsUrl}
                                            onDeleteClick={index => this.handleDeleteObject(index)}
                                            onChangeSortClick={(columnName: string) =>
                                                this.updateQuery({
                                                    sort: {
                                                        path: columnName,
                                                        sortOrder: this.getSortOrder(columnName),
                                                    },
                                                })
                                            }
                                            allowDelete={this.props.allowEdit && allowDelete}
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
            const prevState = this.parseQuery(prevQuery);
            const nextState = this.parseQuery(urlQuery);
            const hiddenColumnsChanged = prevState.hiddenColumns.length !== nextState.hiddenColumns.length;
            const restUnchanged = _.isEqual({ ...nextState, hiddenColumns: [] }, { ...prevState, hiddenColumns: [] });
            if (hiddenColumnsChanged && restUnchanged) {
                return false;
            }
            return true;
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
        const { offset, count, conditions, sort } = this.state.query;
        const objects = await dbViewerApi.searchObjects(objectId, {
            conditions: conditions,
            sorts: sort == null ? [] : [sort],
            excludedFields: [],
            offset: offset,
            count: count,
        });
        this.setState({
            objects: objects,
        });
    }

    private getSortOrder(columnName: string): ObjectFilterSortOrder {
        const { sort } = this.state.query;
        if (sort && sort.path === columnName) {
            return sort.sortOrder === ObjectFilterSortOrder.Descending
                ? ObjectFilterSortOrder.Ascending
                : ObjectFilterSortOrder.Descending;
        }
        return ObjectFilterSortOrder.Ascending;
    }

    private getVisibleProperties(properties: PropertyMetaInformation[]): PropertyMetaInformation[] {
        return properties.filter(item => !this.state.query.hiddenColumns.includes(item.name));
    }

    private readonly updateQuery = (queryUpdate: Partial<ObjectSearchQuery>) => {
        this.setState(
            {
                showModalFilter: false,
                query: {
                    ...this.state.query,
                    ...queryUpdate,
                },
            },
            this.updateRoute
        );
    };

    private readonly getDetailsUrl = (item: object): string => {
        const meta = this.state.metaInformation;
        const typeMeta = meta && meta.typeMetaInformation;
        const properties = (typeMeta && typeMeta.properties) || [];
        const query = {};
        for (const prop of properties) {
            if (prop.isIdentity) {
                query[prop.name] = item[prop.name];
            }
        }
        return RouteUtils.goTo(this.props.path, `details?${qs.stringify(query)}`);
    };

    private readonly handleOpenFilter = () => {
        this.setState({
            showModalFilter: true,
        });
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
        const totalCount = objects.count > objects.countLimit ? objects.countLimit : objects.count;
        if (totalCount == null || totalCount === 0 || Math.ceil(totalCount / count) <= 1) {
            return null;
        }
        return (
            <Paging
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
            const { conditions, sort, hiddenColumns } = this.state.query;

            const downloadResult = await dbViewerApi.downloadObjects(metaInformation.identifier, {
                conditions: conditions,
                sorts: sort == null ? [] : [sort],
                excludedFields: hiddenColumns,
            });

            if (downloadResult.count > downloadResult.countLimit) {
                this.setState({ downloading: false, showDownloadModal: true, downloadCount: downloadResult });
                return;
            }

            if (downloadResult.file) {
                FileUtils.downloadFile(downloadResult.file);
            }
        } finally {
            this.setState({ downloading: false });
        }
    };

    private async handleDeleteObject(index: number): Promise<void> {
        const { objects, metaInformation } = this.state;
        const { dbViewerApi } = this.props;
        if (objects != null && objects.items != null && objects.items.length >= index && metaInformation != null) {
            const deletedObject = objects.items[index];
            await dbViewerApi.deleteObject(metaInformation.identifier, deletedObject);
            await this.loadObjects();
        }
    }

    private updateRoute() {
        this.props.history.push(this.getQuery());
    }

    private getQuery(overrides: Partial<ObjectSearchQuery> = {}): string {
        const { query } = this.state;
        const { path } = this.props;
        return path + objectsQueryMapping.stringify({ ...query, ...overrides });
    }

    private parseQuery(urlQuery: string): ObjectSearchQuery {
        const query = objectsQueryMapping.parse(urlQuery);
        query.conditions = query.conditions || [];
        return query;
    }

    private readonly goToPage = (page: number) => {
        this.props.history.push(this.getQuery({ offset: (page - 1) * this.state.query.count }));
    };
}

export const ObjectTableContainer = withRouter(ObjectTableContainerInternal);
