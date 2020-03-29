import { ColumnStack, Fit, RowStack } from "@skbkontur/react-stack-layout";
import Link from "@skbkontur/react-ui/Link";
import Loader from "@skbkontur/react-ui/Loader";
import Paging from "@skbkontur/react-ui/Paging";
import * as _ from "lodash";
import * as qs from "qs";
import * as React from "react";
import { RouteComponentProps, withRouter } from "react-router-dom";

import { ErrorHandlingContainer } from "../Components/ErrorHandling/ErrorHandlingContainer";
import { CommonLayout } from "../Components/Layouts/CommonLayout";
import { ObjectTable } from "../Components/ObjectTable/ObjectTable";
import { ObjectTableLayoutHeader } from "../Components/ObjectTableLayoutHeader/ObjectTableLayoutHeader";
import { IBusinessObjectsApi } from "../Domain/Api/BusinessObjectsApi";
import { BusinessObjectDescription } from "../Domain/Api/DataTypes/BusinessObjectDescription";
import { BusinessObjectFilterSortOrder } from "../Domain/Api/DataTypes/BusinessObjectFilterSortOrder";
import { DownloadResult } from "../Domain/Api/DataTypes/DownloadResult";
import { FileInfo } from "../Domain/Api/DataTypes/FileInfo";
import { SearchResult } from "../Domain/Api/DataTypes/SearchResult";
import { BusinessObjectSearchQuery } from "../Domain/BusinessObjects/BusinessObjectSearchQuery";
import { ConditionsMapper, SortMapper } from "../Domain/BusinessObjects/BusinessObjectSearchQueryUtils";
import { ICustomRenderer } from "../Domain/BusinessObjects/CustomRenderer";
import { Property } from "../Domain/BusinessObjects/Property";
import { PropertyMetaInformationUtils } from "../Domain/BusinessObjects/PropertyMetaInformationUtils";
import { QueryStringMapping } from "../Domain/QueryStringMapping/QueryStringMapping";
import { QueryStringMappingBuilder } from "../Domain/QueryStringMapping/QueryStringMappingBuilder";
import { RouteUtils } from "../Domain/Utils/RouteUtils";

interface ObjectTableProps extends RouteComponentProps {
    businessObjectsApi: IBusinessObjectsApi;
    customRenderer: ICustomRenderer;
    objectId: string;
    urlQuery: string;
    allowEdit: boolean;
    path: string;
}

interface ObjectTableState {
    objects: Nullable<SearchResult<object>>;
    loading: boolean;
    showModalFilter: boolean;
    metaInformation: Nullable<BusinessObjectDescription>;
    displaySearchFilter: boolean;
    displayShowFilter: boolean;
    query: BusinessObjectSearchQuery;
    downloading: boolean;
    showDownloadModal: boolean;
    downloadCount?: DownloadResult;
}

const businessObjectsQueryMapping: QueryStringMapping<BusinessObjectSearchQuery> = new QueryStringMappingBuilder<
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
            objects,
            metaInformation,
            query: { offset, count, sort },
            downloading,
            showDownloadModal,
            downloadCount,
        } = this.state;
        let properties: null | Property[] = null;
        if (metaInformation?.typeMetaInformation?.properties) {
            properties = PropertyMetaInformationUtils.getProperties(metaInformation.typeMetaInformation.properties);
        }

        return (
            <CommonLayout>
                <ErrorHandlingContainer />
                <CommonLayout.GoBack to={RouteUtils.backUrl(this.props)} data-tid="GoToObjectsList">
                    Вернуться к списку видов бизнес объектов
                </CommonLayout.GoBack>
                <CommonLayout.Header
                    title={<div style={{ maxWidth: 410, wordBreak: "break-all" }}>{this.props.objectId}</div>}
                    tools={
                        <ObjectTableLayoutHeader
                            query={this.state.query}
                            allowReadAll={metaInformation?.schemaDescription.allowReadAll || false}
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
                                            allowDelete={this.props.allowEdit}
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
        const { businessObjectsApi, objectId } = this.props;
        this.setState({ loading: true });
        try {
            const metaInformation = await businessObjectsApi.getBusinessObjectMeta(objectId);
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

    private async loadObjectsIfAllowed(meta: BusinessObjectDescription) {
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
        const { businessObjectsApi, objectId } = this.props;
        const { offset, count, conditions, sort } = this.state.query;
        const objects = await businessObjectsApi.findBusinessObjects(objectId, {
            conditions: conditions,
            sort: sort,
            offset: offset,
            count: count,
        });
        this.setState({
            objects: objects,
        });
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
            const { conditions, sort, hiddenColumns } = this.state.query;

            const downloadResult = await businessObjectsApi.downloadBusinessObjects(metaInformation.identifier, {
                conditions: conditions,
                sort: sort,
                excludedFields: hiddenColumns,
            });

            if (downloadResult.count > downloadResult.countLimit) {
                this.setState({ downloading: false, showDownloadModal: true, downloadCount: downloadResult });
                return;
            }

            if (downloadResult.file) {
                this.createDownloadableCsvFile(downloadResult.file);
            }
        } finally {
            this.setState({ downloading: false });
        }
    };

    private createDownloadableCsvFile(file: FileInfo) {
        const link = document.createElement("a");
        link.download = file.name;
        link.href = `data:application/octet-stream;base64,${file.content}`;
        link.click();
    }

    private async handleDeleteObject(index: number): Promise<void> {
        const { objects, metaInformation } = this.state;
        const { businessObjectsApi } = this.props;
        if (objects != null && objects.items != null && objects.items.length >= index && metaInformation != null) {
            const deletedObject = objects.items[index];
            await businessObjectsApi.deleteBusinessObjects(metaInformation.identifier, deletedObject);
            await this.loadObjects();
        }
    }

    private updateRoute() {
        this.props.history.push(this.getQuery());
    }

    private getQuery(overrides: Partial<BusinessObjectSearchQuery> = {}): string {
        const { query } = this.state;
        const { path } = this.props;
        return path + businessObjectsQueryMapping.stringify({ ...query, ...overrides });
    }

    private readonly goToPage = (page: number) => {
        this.props.history.push(this.getQuery({ offset: (page - 1) * this.state.query.count }));
    };
}

export const ObjectTableContainer = withRouter(ObjectTableContainerInternal);
