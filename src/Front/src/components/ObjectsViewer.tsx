import * as React from "react";
import { Provider } from "react-redux";
import {
  Route,
  RouteComponentProps,
  Switch,
  withRouter,
} from "react-router-dom";
import Apis from "../api/Apis";
import { DBViewerApiImpl } from "../api/impl/DBViewerApi";
import configureStore from "./IObjectsViewerStore";
import ObjectDetails from "./ObjectDetails/ObjectDetailsView";
import BusinessObjectTypeDetails from "./TypeDetails/TypeDetails";
import TypesList from "./TypesList/TypesList";

const store = configureStore();

interface IProps extends RouteComponentProps {
  apiPrefix: string;
}

class ObjectsViewerImpl extends React.Component<IProps> {
  public componentWillMount(): void {
    Apis.initialize(new DBViewerApiImpl(this.props.apiPrefix));
  }

  public render() {
    return (
      <Provider store={store}>
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
