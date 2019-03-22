import * as React from "react";
import { Provider } from "react-redux";
import {
  Route,
  RouteComponentProps,
  Switch,
  withRouter,
} from "react-router-dom";
import { Store } from "redux";
import Apis from "../api/Apis";
import { DBViewerApiImpl } from "../api/impl/DBViewerApi";
import { configureStore, IObjectsViewerStore } from "./IObjectsViewerStore";
import ObjectDetails from "./ObjectDetails/ObjectDetailsView";
import BusinessObjectTypeDetails from "./TypeDetails/TypeDetails";
import TypesList from "./TypesList/TypesList";
import AccessConfiguration from "./utils/AccessConfiguration";

interface IProps extends RouteComponentProps {
  apiPrefix: string;
  allowEdit: boolean;
}

class ObjectsViewerImpl extends React.Component<IProps> {
  private store: Store<IObjectsViewerStore>;
  constructor(props) {
    super(props);
    Apis.initialize(new DBViewerApiImpl(props.apiPrefix));
    this.store = configureStore();
    AccessConfiguration.initialize(props.allowEdit);
  }

  public render() {
    return (
      <Provider store={this.store}>
        <Switch>
          <Route
            exact
            path={this.normalizeUrl(`${this.props.match.url}/`)}
            component={TypesList}
          />
          <Route
            exact
            path={this.normalizeUrl(`${this.props.match.url}/:type`)}
            component={BusinessObjectTypeDetails}
          />
          <Route
            path={this.normalizeUrl(`${this.props.match.url}/:type/Details`)}
            component={ObjectDetails}
          />
        </Switch>
      </Provider>
    );
  }

  private normalizeUrl = (url: string): string => url.replace("//", "/");
}

export default withRouter(ObjectsViewerImpl);
