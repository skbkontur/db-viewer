import Link from "@skbkontur/react-ui/Link";
import Loader from "@skbkontur/react-ui/Loader";
import { LocationDescriptor } from "history";
import _ from "lodash";
import * as React from "react";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { ErrorHandlingContainer } from "Commons/ErrorHandling/ErrorHandlingContainer";
import { ColumnStack } from "Commons/Layouts/ColumnStack";
import { CommonLayout } from "Commons/Layouts/CommonLayout";
import { Fit } from "Commons/Layouts/Fit";
import { RowStack } from "Commons/Layouts/RowStack";
import { PageNavigationList } from "Commons/PageNavigationList/PageNavigationList";
import { queryStringMapping, QueryStringMapping } from "Commons/QueryStringMapping";
import { IBusinessObjectsApi } from "Domain/Api/BusinessObjectsApi";
import { BusinessObjectsApiUrls, withBusinessObjectsApi } from "Domain/Api/BusinessObjectsApiUtils";
import { BusinessObject } from "Domain/Api/DataTypes/BusinessObject";
import { BusinessObjectDescription } from "Domain/Api/DataTypes/BusinessObjectDescription";
import { BusinessObjectFilterSortOrder } from "Domain/Api/DataTypes/BusinessObjectFilterSortOrder";
import { BusinessObjectStorageType } from "Domain/Api/DataTypes/BusinessObjectStorageType";
import { PropertyMetaInformationUtils } from "Domain/Api/DataTypes/PropertyMetaInformationUtils";
import { SearchResult } from "Domain/Api/DataTypes/SearchResult";
import { Object } from "Domain/Api/Object";
import { BusinessObjectSearchQuery } from "Domain/BusinessObjects/BusinessObjectSearchQuery";
import { ConditionsMapper, SortMapper } from "Domain/BusinessObjects/BusinessObjectSearchQueryUtils";
import { Property } from "Domain/BusinessObjects/Property";

import { BusinessObjectsTable } from "../Components/BusinessObjectsTable/BusinessObjectsTable";
import { BusinessObjectModal } from "../Components/BusinessObjectModal/BusinessObjectModal";
import { BusinessObjectTableLayoutHeader } from "../Components/BusinessObjectTableLayoutHeader/BusinessObjectTableLayoutHeader";

interface ObjectTableProps extends RouteComponentProps {
    businessObjectsApi: IBusinessObjectsApi;
    objectId: string;
    urlQuery: string;
    path: string;
}

interface ObjectTableState {
    objects: Nullable<SearchResult<BusinessObject>>;
    loading: boolean;
    showModal: boolean;
    showModalFilter: boolean;
    metaInformation: Nullable<BusinessObjectDescription>;
    displaySearchFilter: boolean;
    displayShowFilter: boolean;
    query: BusinessObjectSearchQuery;
    downloading: boolean;
    showDownloadModal: boolean;
    downloadCount?: SearchResult<Object>;
}

const businessObjectsQueryMapping: QueryStringMapping<BusinessObjectSearchQuery> = queryStringMapping<
    BusinessObjectSearchQuery
>()
    .mapToInteger(x => x.count, "count", 20)
    .mapToInteger(x => x.offset, "offset", 0)
    .mapToStringArray(x => x.hiddenColumns, "hiddenColumns", [])
    .mapTo(x => x.sort, new SortMapper("sort"))
    .mapTo(x => x.conditions, new ConditionsMapper(["sort", "count", "offset", "hiddenColumns", "countLimit"]))
    .build();

function getDefaultQuery(): BusinessObjectSearchQuery {
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
        showModal: false,
        query: getDefaultQuery(),
        displaySearchFilter: false,
        displayShowFilter: false,
        showModalFilter: false,
        downloading: false,
        showDownloadModal: false,
    };

    public componentDidMount() {
        const { urlQuery } = this.props;
        this.setState({ query: businessObjectsQueryMapping.parse(urlQuery) }, this.loadMetaAndObjectsIfNecessary);
    }

    public componentDidUpdate(prevProps: ObjectTableProps) {
        if (this.checkForNecessityLoad(prevProps.urlQuery)) {
            this.setState(
                { query: businessObjectsQueryMapping.parse(this.props.urlQuery) },
                this.loadObjectsWithLoader
            );
        }
    }

    public render(): JSX.Element {
        const {
            loading,
            showModal,
            objects,
            metaInformation,
            query: { offset, count, sort },
            downloading,
            showDownloadModal,
            downloadCount,
        } = this.state;
        let properties: null | Property[] = null;
        if (metaInformation && metaInformation.typeMetaInformation && metaInformation.typeMetaInformation.properties) {
            properties = PropertyMetaInformationUtils.getProperties(metaInformation.typeMetaInformation.properties);
        }

        return (
            <CommonLayout>
                <ErrorHandlingContainer />
                <CommonLayout.GoBack to={{ pathname: "/AdminTools/BusinessObjects" }} data-tid="GoToObjectsList">
                    Вернуться к списку видов бизнес объектов
                </CommonLayout.GoBack>
                <CommonLayout.Header
                    title={<div style={{ maxWidth: 410, wordBreak: "break-all" }}>{this.props.objectId}</div>}
                    tools={
                        <BusinessObjectTableLayoutHeader
                            query={this.state.query}
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
                            {showModal &&
                                metaInformation && (
                                    <BusinessObjectModal
                                        objectName={metaInformation.identifier}
                                        showIndex={
                                            metaInformation.storageType ===
                                            BusinessObjectStorageType.ArrayOfObjectsPerRow
                                        }
                                        onOpenClick={this.redirectFromModal}
                                    />
                                )}
                            <Fit>
                                {objects && this.renderItemsCount(offset, count, objects.count, objects.countLimit)}
                            </Fit>
                            <Fit style={{ maxWidth: "inherit" }}>
                                {objects != null && objects.items && objects.items.length > 0 ? (
                                    properties && (
                                        <BusinessObjectsTable
                                            properties={this.getVisibleProperties(properties)}
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
                                            allowDelete={true}
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
            const prevState = businessObjectsQueryMapping.parse(prevQuery);
            const nextState = businessObjectsQueryMapping.parse(urlQuery);
            if (
                prevState.hiddenColumns.length !== nextState.hiddenColumns.length &&
                _.isEqual({ ...nextState, hiddenColumns: [] }, { ...prevState, hiddenColumns: [] })
            ) {
                return false;
            }
            return true;
        }
        return false;
    }

    private async loadMetaAndObjectsIfNecessary(): Promise<void> {
        const { businessObjectsApi, objectId } = this.props;
        this.setState({ loading: true });
        try {
            const metaInformation = await businessObjectsApi.getBusinessObjectMeta(objectId);
            this.setState({
                metaInformation: metaInformation,
            });
            if (metaInformation != null && metaInformation.mySqlTableName != null) {
                await this.loadObjects();
            } else {
                this.setState({ showModal: true });
            }
        } finally {
            this.setState({ loading: false });
        }
    }

    private async loadObjects(): Promise<void> {
        const { businessObjectsApi, objectId } = this.props;
        const { offset, count, conditions, sort } = this.state.query;
        const objects = await businessObjectsApi.findBusinessObjects(
            objectId,
            { conditions: conditions, sort: sort },
            offset,
            count
        );
        this.setState({
            objects: objects,
        });
    }

    private async loadObjectsWithLoader(): Promise<void> {
        this.setState({ loading: true });
        try {
            await this.loadObjects();
        } finally {
            this.setState({ loading: false });
        }
    }

    private getSortOrder(columnName: string): BusinessObjectFilterSortOrder {
        const { sort } = this.state.query;
        if (sort && sort.path === columnName) {
            return sort.sortOrder === BusinessObjectFilterSortOrder.Descending
                ? BusinessObjectFilterSortOrder.Ascending
                : BusinessObjectFilterSortOrder.Descending;
        }
        return BusinessObjectFilterSortOrder.Ascending;
    }

    private getVisibleProperties(properties: Property[]): Property[] {
        return properties.filter(item => !this.state.query.hiddenColumns.includes(item.name));
    }

    private readonly updateQuery = (queryUpdate: Partial<BusinessObjectSearchQuery>) => {
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

    private readonly getDetailsUrl = ({ scopeId, id }: BusinessObject) => this.props.path + `/${scopeId}/${id}`;

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
        const { objects, query: { offset, count } } = this.state;
        if (objects == null) {
            return null;
        }
        const totalCount = objects.count > objects.countLimit ? objects.countLimit : objects.count;
        if (totalCount == null || totalCount === 0 || Math.ceil(totalCount / count) <= 1) {
            return null;
        }
        return (
            <PageNavigationList
                data-tid="PageNavigationList"
                current={Math.floor(offset / count)}
                count={Math.ceil(totalCount / count)}
                createHrefToPage={this.createHrefToPage}
            />
        );
    }

    private readonly handleChangeModalFilter = (value: Nullable<Partial<BusinessObjectSearchQuery>>) => {
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
            const { businessObjectsApi } = this.props;
            const { conditions, sort } = this.state.query;

            const downloadCount = await businessObjectsApi.getBusinessObjectsCount(metaInformation.identifier, {
                conditions: conditions,
                sort: sort,
            });

            if (downloadCount.count > downloadCount.countLimit) {
                this.setState({ downloading: false, showDownloadModal: true, downloadCount: downloadCount });
                return;
            }

            await this.handleDownload();
        } finally {
            this.setState({ downloading: false });
        }
    };

    private readonly handleDownload = async (): Promise<void> => {
        const { metaInformation } = this.state;
        if (!metaInformation) {
            return;
        }

        this.setState({ showDownloadModal: false, downloading: true });
        try {
            const { businessObjectsApi } = this.props;
            const { conditions, sort, hiddenColumns } = this.state.query;

            const exportationId = await businessObjectsApi.startDownloadBusinessObjects(
                metaInformation.identifier,
                { conditions: conditions, sort: sort },
                hiddenColumns
            );
            while (true) {
                const downloadStatus = await businessObjectsApi.getBusinessObjectsDownloadStatus(
                    metaInformation.identifier,
                    exportationId
                );
                if (downloadStatus) {
                    window.location.href = BusinessObjectsApiUrls.getUrlForDownloadBusinessObjects(
                        metaInformation.identifier,
                        exportationId
                    );
                    return;
                }
                await new Promise(f => setTimeout(f, 500));
            }
        } finally {
            this.setState({ downloading: false });
        }
    };

    private async handleDeleteObject(index: number): Promise<void> {
        const { objects, metaInformation } = this.state;
        const { businessObjectsApi } = this.props;
        if (objects != null && objects.items != null && objects.items.length >= index && metaInformation != null) {
            const deletedObject = objects.items[index];
            const scopeId = deletedObject.scopeId;
            const id = deletedObject.id;
            if (scopeId != null && id != null) {
                if (metaInformation.storageType === BusinessObjectStorageType.SingleObjectPerRow) {
                    await businessObjectsApi.deleteBusinessObjects(metaInformation.identifier, scopeId, id);
                    await this.loadObjects();
                    return;
                }
                throw new Error("Пытаемся удалить объект с типом массив");
            }
        }
    }

    private updateRoute() {
        this.props.history.push(this.getQuery());
    }

    private readonly redirectFromModal = (scopeId: string, id: string, arrayIndex: Nullable<string>) => {
        const index = arrayIndex != null ? "/" + arrayIndex : "";
        this.props.history.push(this.props.path + `/${scopeId}/${id}${index}`);
    };

    private getQuery(overrides: Partial<BusinessObjectSearchQuery> = {}): string {
        const { query } = this.state;
        const { path } = this.props;
        return path + businessObjectsQueryMapping.stringify({ ...query, ...overrides });
    }

    private readonly createHrefToPage = (page: number): LocationDescriptor =>
        this.getQuery({ offset: page * this.state.query.count });
}

export const ObjectTableContainer = withBusinessObjectsApi(withRouter(ObjectTableContainerInternal));
