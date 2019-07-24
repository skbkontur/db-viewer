import ArrowTriangleDownIcon from "@skbkontur/react-icons/ArrowTriangleDown";
import ArrowTriangleRightIcon from "@skbkontur/react-icons/ArrowTriangleRight";
import ArrowTriangleUpIcon from "@skbkontur/react-icons/ArrowTriangleUp";
import ArrowTriangleUpDownIcon from "@skbkontur/react-icons/ArrowTriangleUpDown";
import Button from "@skbkontur/react-ui/Button";
import Toast from "@skbkontur/react-ui/components/Toast/Toast";
import Gapped from "@skbkontur/react-ui/Gapped";
import Link from "@skbkontur/react-ui/Link";
import Loader from "@skbkontur/react-ui/Loader";
import Paging from "@skbkontur/react-ui/Paging";
import Spinner from "@skbkontur/react-ui/Spinner";
import { flatten } from "lodash";
import qs from "qs";
import * as React from "react";
import { connect } from "react-redux";
import { RouteComponentProps } from "react-router";
import { NavLink } from "react-router-dom";
import { PrimitiveType } from "../../api/impl/PrimitiveType";
import { Property } from "../../api/impl/Property";
import { PropertyDescription } from "../../api/impl/PropertyDescription";
import { Sort } from "../../api/impl/Sort";
import { SortDirection } from "../../api/impl/SortDirection";
import { TypeInfo } from "../../api/impl/TypeInfo";
import { TypeModel } from "../../api/impl/TypeModel";
import AdminToolsHeader from "../Common/AdminToolsHeader";
import { ColumnConfiguration } from "../Common/ColumnConfiguration";
import FullPageLoader, { LoaderState } from "../Common/FullPageLoader";
import { PrimitiveValue } from "../Common/PrimitiveValue";
import ResultsTable from "../Common/ResultsTable";
import { IDBViewerStore } from "../IDBViewerStore";
import ObjectDetailsActions from "../ObjectDetails/ObjectDetailsView.actions";
import TypesListActions from "../TypesList/TypesList.actions";
import { TypeOfConnect, unboxThunk } from "../Utils/ReduxUtils";
import { StringUtils } from "../Utils/StringUtils";
import { IFilter } from "./IFilter";
import ObjectsListActions from "./ObjectsList.actions";
import { ILoadable } from "./ObjectsList.reducers";
import SearchPanel from "./SearchPanel/SearchPanel";
import * as styles from "./TypeDetails.less";

const tableConfigsCache: IDictionary<ColumnConfiguration[]> = {};

interface IProps extends RouteComponentProps<IMatchParams> {
  type: string;
  onSearch: (
    filters: IDictionary<IFilter>,
    sorts: Sort[],
    skip: number,
    take: number
  ) => void;
  onCount: (filters: IDictionary<IFilter>, countLimit: number) => void;
  onDelete: (object: any) => void;
  typeDescription: TypeModel;
  list: ILoadable<Nullable<any>>;
  count: ILoadable<Nullable<number>>;
}

interface IState {
  showFilters: boolean;
  validations: IDictionary<boolean>;
  filters: IDictionary<IFilter>;
  sorts: Nullable<Sort>;
  searchableFields: Property[];
  loaderState: LoaderState;
  paging: Nullable<IPagingState>;
}

interface IPagingState {
  skip: number;
  take: number;
  countLimit: number;
}

class TypeDetails extends React.Component<IProps, IState> {
  constructor(props) {
    super(props);
    this.state = {
      showFilters: true,
      validations: {},
      filters: {},
      searchableFields: [],
      sorts: null,
      loaderState: LoaderState.Loading,
      paging: null,
    };
  }

  public componentDidMount() {
    const searchableFields = this.getSearchableFields(
      this.props.typeDescription.shape
    );

    const filters = this.getDefaultFiltersState(searchableFields);
    const state = this.parseQueryString();

    Object.keys(state).forEach(x => (filters[x].value = state[x]));

    this.setState(
      {
        loaderState: LoaderState.Success,
        filters,
        searchableFields,
        paging: {
          skip: 0,
          take: 20,
          countLimit: this.props.typeDescription.schemaDescription
            .defaultCountLimit,
        },
      },
      () => {
        if (this.props.typeDescription.schemaDescription.enableDefaultSearch) {
          this.handleSearch();
        }
      }
    );
  }

  public render() {
    return (
      <div>
        <AdminToolsHeader
          routerLink
          title={this.props.type}
          backTo={this.props.match.url.endsWith("/") ? ".." : "."}
          backText={"Вернуться к списку типов"}
        />
        {this.renderContent()}
      </div>
    );
  }

  public componentWillUnmount() {
    tableConfigsCache[this.props.type] = null;
  }

  private parseQueryString(): {} {
    return qs.parse((this.props.location.search || "").replace(/^\?/, ""));
  }

  private getDefaultFiltersState = (
    searchableFields: Property[]
  ): IDictionary<IFilter> => {
    const result: IDictionary<IFilter> = {};
    for (const property of searchableFields) {
      result[property.description.name] = {
        value: "",
        type: property.description.availableFilters[0],
      };
    }
    return result;
  };

  private renderContent() {
    const loadingStatus = this.state.loaderState;
    if (loadingStatus !== LoaderState.Success) {
      return <FullPageLoader state={loadingStatus} />;
    }
    return (
      <Gapped vertical>
        {this.renderSearchForm()}
        {this.renderCounts()}
        {this.renderTable()}
      </Gapped>
    );
  }

  private renderTable() {
    if (!this.props.list) {
      return null;
    }
    if (!this.props.list.data || this.props.list.data.length === 0) {
      return (
        <div className={styles.noData} data-tid="ResultNotFound">
          {this.props.list.loadingStatus === LoaderState.Loading ? (
            <Spinner type="big" caption="Загружаем..." />
          ) : (
            <div>Ничего не найдено</div>
          )}
        </div>
      );
    }
    return (
      <Loader active={this.props.list.loadingStatus === LoaderState.Loading}>
        <Gapped vertical>
          {this.renderBounds()}
          {this.renderPaging()}
          <ResultsTable
            results={this.props.list.data}
            columnsConfiguration={this.getOrCreateTableConfiguration()}
          />
        </Gapped>
      </Loader>
    );
  }

  private renderPaging() {
    if (
      !this.props.typeDescription.schemaDescription.countable ||
      this.props.count == null ||
      this.props.count.loadingStatus !== LoaderState.Success
    ) {
      return null;
    }
    const { skip, take } = this.state.paging;
    const currentPage = Math.floor(skip / take) + 1;
    const pagesCount = Math.ceil(this.props.count.data / take);
    return (
      <Paging
        activePage={currentPage}
        onPageChange={this.handleChangePage}
        pagesCount={pagesCount}
      />
    );
  }

  private handleChangePage = pageNumber => {
    this.setState(
      {
        paging: {
          ...this.state.paging,
          skip: (pageNumber - 1) * this.state.paging.take,
        },
      },
      () => this.handleSearch(true)
    );
  };

  private getSearchableFields = (
    typeInfo: TypeInfo,
    propertyDescription: PropertyDescription = null
  ): Property[] => {
    if (typeInfo.type === PrimitiveType.Class) {
      return flatten(
        Object.values(typeInfo.properties).map(x =>
          this.getSearchableFields(x.typeInfo, x.description)
        )
      ).filter(x => !!x);
    }
    if (propertyDescription !== null && propertyDescription.isSearchable) {
      return [{ typeInfo, description: propertyDescription }];
    }
    return null;
  };

  private isNotEmpty(filter: IFilter): boolean {
    return !filter || (!filter.value && filter.value !== false);
  }

  private handleSearch = (skipCount: boolean = false) => {
    const invalidFields = [];
    for (const property of this.state.searchableFields.filter(
      x => x.description.isRequired
    )) {
      if (this.isNotEmpty(this.state.filters[property.description.name])) {
        invalidFields.push(property.description.name);
      }
    }
    if (invalidFields.some(_ => true)) {
      this.setState({
        validations: invalidFields.reduce(
          (res, x) => ({ ...res, [x]: true }),
          {}
        ),
      });
      Toast.push(`Поля ${invalidFields.join(", ")} обязательны для заполнения`);
      return;
    }

    const query = this.buildQuery();
    this.props.history.push(`${this.props.match.url}?${query}`);

    this.props.onSearch(
      this.state.filters,
      this.state.sorts ? [this.state.sorts] : null,
      this.state.paging.skip,
      this.state.paging.take
    );
    if (this.props.typeDescription.schemaDescription.countable && !skipCount) {
      this.props.onCount(this.state.filters, this.state.paging.countLimit);
    }
  };

  private buildQuery(): string {
    const { searchableFields, filters } = this.state;
    const fields = searchableFields
      .filter(x => this.isNotEmpty(filters[x.description.name]))
      .map(p => ({
        name: p.description.name,
        value: filters[p.description.name].value,
      }));
    return fields.map(x => `${x.name}=${x.value}`).join("&");
  }

  private renderBounds() {
    if (this.props.list.loadingStatus === LoaderState.Loading) {
      return <Spinner type="mini" caption="Загружаем..." />;
    }
    const { skip } = this.state.paging;
    const from = skip + 1;
    const to = skip + this.props.list.data.length;
    return (
      <span>
        Объекты с {from} по {to}
      </span>
    );
  }

  private renderCounts() {
    if (this.props.count == null) {
      return null;
    }
    const count = this.props.count.data;
    const countLimit = this.state.paging.countLimit;
    const maxCountLimit = this.props.typeDescription.schemaDescription
      .maxCountLimit;
    if (this.props.count.loadingStatus === LoaderState.Loading) {
      return <Spinner type="mini" caption="Считаем..." />;
    }
    return (
      <Gapped>
        <span data-tid="FoundObjects">
          Найдено {count === countLimit ? `больше ${count}` : count}
        </span>
        {count === countLimit && (
          <Link data-tid="GetExactCountLink" onClick={this.handleGetExactCount}>
            Узнать точное количество (не больше чем {maxCountLimit})
          </Link>
        )}
      </Gapped>
    );
  }

  private handleGetExactCount = () => {
    this.setState(
      {
        paging: {
          ...this.state.paging,
          countLimit: this.props.typeDescription.schemaDescription
            .maxCountLimit,
        },
      },
      () => this.props.onCount(this.state.filters, this.state.paging.countLimit)
    );
  };

  private renderSearchForm() {
    if (!this.state.showFilters) {
      return (
        <div className={styles.searchForm}>
          <Link
            data-tid="ShowFiltersToggle"
            icon={<ArrowTriangleRightIcon />}
            onClick={this.handleShowFilters}
          >
            Показать фильтры
          </Link>
        </div>
      );
    }
    return (
      <div className={styles.searchForm}>
        <Gapped vertical>
          <Link
            data-tid="ShowFiltersToggle"
            icon={<ArrowTriangleDownIcon />}
            onClick={this.handleHideFilters}
          >
            Скрыть фильтры
          </Link>
          <SearchPanel
            filters={this.state.filters}
            onChangeFilter={this.handleChangeFilter}
            fields={this.state.searchableFields}
            validations={this.state.validations}
          />
          <Gapped>
            <Button
              data-tid="SearchButton"
              use={"primary"}
              onClick={() => this.handleSearch(false)}
            >
              Искать
            </Button>
            <Button data-tid="ResetButton" onClick={this.handleResetFilters}>
              Сбросить
            </Button>
          </Gapped>
        </Gapped>
      </div>
    );
  }

  private handleResetFilters = () => {
    this.setState({
      filters: this.getDefaultFiltersState(this.state.searchableFields),
    });
  };

  private getOrCreateTableConfiguration(): ColumnConfiguration[] {
    if (!tableConfigsCache[this.props.type]) {
      tableConfigsCache[this.props.type] = [
        ColumnConfiguration.create().withCustomRender((_, item) => {
          const identityFields = this.getIdentityFields(
            this.props.typeDescription.shape
          );
          const query = identityFields
            .map(x => `${x.description.name}=${item[x.description.name]}`)
            .join("&");
          return (
            <NavLink
              data-tid="DetailsLink"
              to={StringUtils.normalizeUrl(
                `${this.props.match.url}/Details?${query}`
              )}
            >
              Подробности
            </NavLink>
          );
        }),
        ...this.state.searchableFields.map(field =>
          ColumnConfiguration.createByPath(field.description.name)
            .withCustomRender(x => (
              <PrimitiveValue
                data-tid={field.description.name}
                data={x}
                primitiveType={field.typeInfo.type}
              />
            ))
            .withHeader(() => this.renderTableHeader(field))
        ),
      ];
    }
    return tableConfigsCache[this.props.type];
  }

  private renderTableHeader = (field: Property): React.ReactNode => {
    if (!field.description.isSortable) {
      return <span data-tid="ColumnName">{field.description.name}</span>;
    }
    const currentDirection =
      this.state.sorts && this.state.sorts.field === field.description.name
        ? this.state.sorts.direction
        : null;
    return (
      <Link
        data-tid="ColumnSortLink"
        onClick={() =>
          this.handleSort(field, this.getNewSortDirection(currentDirection))
        }
        icon={this.getSortDirectionIcon(currentDirection)}
      >
        {field.description.name}
      </Link>
    );
  };

  private getSortDirectionIcon = (
    currentSortDirection: Nullable<SortDirection>
  ): JSX.Element => {
    switch (currentSortDirection) {
      case null:
      case undefined:
        return <ArrowTriangleUpDownIcon />;
      case SortDirection.Descending:
        return <ArrowTriangleDownIcon />;
      case SortDirection.Ascending:
        return <ArrowTriangleUpIcon />;
    }
  };

  private getNewSortDirection = (
    currentSortDirection: Nullable<SortDirection>
  ): SortDirection => {
    switch (currentSortDirection) {
      case SortDirection.Ascending:
        return SortDirection.Descending;
      case SortDirection.Descending:
      case null:
      case undefined:
        return SortDirection.Ascending;
    }
  };

  private handleSort = (field: Property, direction: SortDirection) => {
    this.setState(
      {
        sorts: { field: field.description.name, direction },
      },
      () => this.handleSearch(true)
    );
  };

  private getIdentityFields = (
    typeInfo: TypeInfo,
    propertyDescription: PropertyDescription = null
  ): Property[] => {
    if (typeInfo.type === PrimitiveType.Class) {
      return flatten(
        Object.values(typeInfo.properties).map(x =>
          this.getIdentityFields(x.typeInfo, x.description)
        )
      ).filter(x => !!x);
    }
    if (propertyDescription !== null && propertyDescription.isIdentity) {
      return [{ typeInfo, description: propertyDescription }];
    }
    return null;
  };

  private handleShowFilters = () => this.setState({ showFilters: true });
  private handleHideFilters = () => this.setState({ showFilters: false });
  private handleChangeFilter = (name: string, value: IFilter) => {
    this.setState({
      validations: {
        ...this.state.validations,
        [name]: false,
      },
      filters: {
        ...this.state.filters,
        [name]: value,
      },
    });
  };
}

interface IMatchParams {
  type: string;
}

type ScopeNarrowerProps = RouteComponentProps<IMatchParams> &
  TypeOfConnect<typeof reduxConnector>;

// tslint:disable-next-line:max-classes-per-file
class ScopeNarrower extends React.Component<ScopeNarrowerProps> {
  public componentDidMount() {
    if (!this.props.typesDescriptions) {
      this.props.onLoadTypes();
    }
  }

  public render() {
    const { type } = this.props.match.params;
    if (!this.props.typesDescriptions) {
      return <FullPageLoader state={LoaderState.Loading} />;
    }
    const count = this.props.types[type] ? this.props.types[type].count : null;
    const list = this.props.types[type] ? this.props.types[type].list : null;
    return (
      <TypeDetails
        {...this.props}
        type={type}
        typeDescription={this.props.typesDescriptions[type]}
        count={count}
        list={list}
        onCount={this.handleCount}
        onSearch={this.handleSearch}
        onDelete={this.handleDelete}
      />
    );
  }

  private handleSearch = (
    filters: IDictionary<IFilter>,
    sorts: Sort[],
    skip: number,
    take: number
  ) =>
    this.props.onSearch(
      this.props.match.params.type,
      filters,
      sorts,
      skip,
      take
    );
  private handleCount = (filters: IDictionary<IFilter>, countLimit: number) =>
    this.props.onCount(this.props.match.params.type, filters, countLimit);
  private handleDelete = (object: any) =>
    this.props.onDelete(this.props.match.params.type, object);
}

const reduxConnector = connect(
  (state: IDBViewerStore) => ({
    ...state.typeDetailsStore,
    typesDescriptions: state.typesListStore.descriptions,
  }),
  {
    onSearch: unboxThunk(ObjectsListActions.search),
    onCount: unboxThunk(ObjectsListActions.count),
    onDelete: unboxThunk(ObjectDetailsActions.delete),
    onLoadTypes: unboxThunk(TypesListActions.load),
  }
);

export default reduxConnector(ScopeNarrower);
