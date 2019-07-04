import Gapped from "@skbkontur/react-ui/Gapped";
import Input from "@skbkontur/react-ui/Input";
import groupBy from "lodash/groupBy";
import * as React from "react";
import { connect } from "react-redux";
import {
  NavLink as Link,
  RouteComponentProps,
  withRouter,
} from "react-router-dom";
import { TypeModel } from "../../api/impl/TypeModel";
import AdminToolsHeader from "../Common/AdminToolsHeader";
import FullPageLoader from "../Common/FullPageLoader";
import { IDBViewerStore } from "../IDBViewerStore";
import { TypeOfConnect, unboxThunk } from "../Utils/ReduxUtils";
import { StringUtils } from "../Utils/StringUtils";
import TypesListActions from "./TypesList.actions";
import * as styles from "./TypesList.less";

type Props = TypeOfConnect<typeof reduxConnector> & RouteComponentProps<{}>;

class TypesList extends React.Component<Props, {}> {
  private input: Input;
  public componentDidMount() {
    if (this.props.list === null) {
      this.props.onLoad();
    }
  }

  public componentDidUpdate(prevProps: Props) {
    if (this.props.list != null && prevProps.list == null) {
      this.input.focus();
    }
  }

  public render() {
    if (!this.props.list) {
      return (
        <FullPageLoader
          state={this.props.loadingState}
          onTryAgain={this.props.onLoad}
        />
      );
    }
    const categorized = groupBy<TypeModel>(
      this.props.list,
      x => x.schemaDescription.schemaName
    );
    return (
      <div>
        <AdminToolsHeader
          routerLink
          title={"Бизнес объекты"}
          backText={"Вернуться к списку инструментов"}
          backTo={this.props.match.url.endsWith("/") ? ".." : "."}
        />
        <Gapped vertical gap={15}>
          <Input
            data-tid="FilterInput"
            ref={this.handleInputRef}
            value={this.props.filters.searchString}
            onChange={this._handleChangeSearchString}
            placeholder={"Можно искать как в R#"}
          />
          {Object.keys(categorized).map(schemaName =>
            this.renderTypes(schemaName, categorized[schemaName])
          )}
        </Gapped>
      </div>
    );
  }

  private handleInputRef = c => (this.input = c);

  private renderTypes(schemaName: string, list: TypeModel[]): React.ReactNode {
    return (
      <Gapped vertical gap={15} key={schemaName}>
        <div className={styles.schemaName}>{schemaName}</div>
        <div className={styles.list}>
          {list.map(type => (
            <span
              className={styles.type}
              key={type.name + type.schemaDescription.schemaName}
            >
              <Link
                data-tid="BusinessObjectLink"
                to={StringUtils.normalizeUrl(
                  `${this.props.match.url}/${type.name}`
                )}
              >
                {type.name}
              </Link>
            </span>
          ))}
        </div>
      </Gapped>
    );
  }

  private _handleChangeSearchString = (_, v) =>
    this.props.onChangeSearchString(v);
}

const reduxConnector = connect(
  (state: IDBViewerStore) => state.typesListStore,
  {
    onLoad: unboxThunk(TypesListActions.load),
    onChangeSearchString: TypesListActions.changeSearchString,
  }
);

export default reduxConnector(withRouter(TypesList));
