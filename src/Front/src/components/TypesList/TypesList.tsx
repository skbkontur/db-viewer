import Gapped from "@skbkontur/react-ui/Gapped";
import Input from "@skbkontur/react-ui/Input";
import * as classnames from "classnames";
import * as React from "react";
import { connect } from "react-redux";
import {
  NavLink as Link,
  RouteComponentProps,
  withRouter,
} from "react-router-dom";
import AdminToolsHeader from "../Common/AdminToolsHeader";
import FullPageLoader from "../Common/FullPageLoader";
import { IDBViewerStore } from "../IDBViewerStore";
import { TypeOfConnect, unboxThunk } from "../Utils/ReduxUtils";
import { StringUtils } from "../Utils/StringUtils";
import TypesListActions from "./TypesList.actions";
import * as styles from "./TypesList.less";

type Props = TypeOfConnect<typeof reduxConnector> & RouteComponentProps<{}>;

class TypesList extends React.Component<Props, {}> {
  public componentDidMount() {
    if (this.props.list === null) {
      this.props.onLoad();
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
    return (
      <div>
        <AdminToolsHeader
          routerLink
          title={"Бизнес объекты"}
          backText={"Вернуться к списку инструментов"}
          backTo={this.props.match.url.endsWith("/") ? ".." : "."}
        />
        <Gapped vertical>
          <div>
            <Input
              value={this.props.filters.searchString}
              onChange={this._handleChangeSearchString}
            />
          </div>
          <table className={styles.table}>
            <tbody>
              {Object.keys(this.props.list).map((letter, letterIdx) => {
                const types = this.props.list[letter];
                return types.map((type, idx) => (
                  <tr key={type.name}>
                    {idx === 0 && (
                      <td
                        rowSpan={types.length}
                        className={classnames(
                          styles.letter,
                          styles.cell,
                          letterIdx % 2 === 0 && styles.even
                        )}
                      >
                        {letter}
                      </td>
                    )}
                    <td
                      className={classnames(
                        styles.cell,
                        letterIdx % 2 === 0 && styles.even
                      )}
                    >
                      <Link
                        to={StringUtils.normalizeUrl(
                          `${this.props.match.url}/${type.name}`
                        )}
                      >
                        {type.name}
                      </Link>
                      <span className={styles.schema}>
                        {type.schemaDescription.schemaName}
                      </span>
                    </td>
                  </tr>
                ));
              })}
            </tbody>
          </table>
        </Gapped>
      </div>
    );
  }

  public _handleChangeSearchString = (_, v) =>
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
