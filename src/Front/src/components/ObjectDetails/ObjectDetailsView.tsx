import * as qs from "qs";
import * as React from "react";
import { connect } from "react-redux";
import { RouteComponentProps } from "react-router";
import AdminToolsHeader from "../Common/AdminToolsHeader";
import FullPageLoader, { LoaderState } from "../Common/FullPageLoader";
import { IDBViewerStore } from "../IDBViewerStore";
import { TypeOfConnect, unboxThunk } from "../Utils/ReduxUtils";
import ObjectDetailsContent from "./ObjectDetailsContent";
import ObjectDetailsViewActions from "./ObjectDetailsView.actions";

interface IMatchParams {
  type: string;
}

interface IState {
  edit: boolean;
}

type Props = RouteComponentProps<IMatchParams> &
  TypeOfConnect<typeof reduxConnector>;

class ObjectDetailsView extends React.Component<Props, IState> {
  constructor(props: Props) {
    super(props);
    this.state = {
      edit: false,
    };
  }

  public componentDidMount() {
    this._handleLoad();
  }

  public componentWillUnmount() {
    this.props.onClear();
  }

  public render() {
    return (
      <div>
        <AdminToolsHeader
          routerLink
          title={this.props.match.params.type}
          backTo={"."}
          backText={"Вернуться к списку объектов"}
        />
        {this._renderContent()}
      </div>
    );
  }

  public _renderContent() {
    if (this.props.loadingStatus !== LoaderState.Success) {
      return (
        <FullPageLoader
          state={this.props.loadingStatus}
          onTryAgain={this._handleLoad}
        />
      );
    }
    return (
      <ObjectDetailsContent
        data={this.props.object}
        typeInfo={this.props.typeInfo}
        onSave={this._handleSave}
        onDelete={this._handleDelete}
      />
    );
  }

  public _handleSave = async (result: object) => {
    await this.props.onSave(this.props.match.params.type, result);
  };

  public _handleDelete = async () => {
    await this.props.onDelete(this.props.match.params.type, this.props.object);
    const lastSlash = this.props.location.pathname.lastIndexOf("/");
    const nextLocation = this.props.location.pathname.substr(0, lastSlash);
    this.props.history.push(nextLocation);
  };

  public _handleLoad = () =>
    this.props.onLoad(
      this.props.match.params.type,
      qs.parse(this.props.location.search.substring(1))
    );
}

const reduxConnector = connect(
  (store: IDBViewerStore) => store.objectDetailsStore,
  {
    onLoad: unboxThunk(ObjectDetailsViewActions.load),
    onClear: ObjectDetailsViewActions.clear,
    onDelete: unboxThunk(ObjectDetailsViewActions.delete),
    onSave: unboxThunk(ObjectDetailsViewActions.save),
  }
);

export default reduxConnector(ObjectDetailsView);
