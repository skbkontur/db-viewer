import * as React from "react";
import { Provider } from "react-redux";
import { Route, Switch } from "react-router-dom";
import Apis from "../api/Apis";
import { DataBaseViewerApiImpl } from "../api/impl/DataBaseViewerApi";
import configureStore from "./IObjectsViewerStore";
import ObjectDetails from "./ObjectDetails/ObjectDetailsView";
import BusinessObjectTypeDetails from "./TypeDetails/TypeDetails";
import TypesList from "./TypesList/TypesList";

const store = configureStore();

interface IProps {
  apiPrefix: string;
}

export default class ObjectsViewer extends React.Component<IProps> {
  public componentWillMount(): void {
    Apis.initialize(new DataBaseViewerApiImpl(this.props.apiPrefix));
  }

  public render() {
    return (
      <Provider store={store}>
        <Switch>
          <Route exact path={`/`} component={TypesList} />
          <Route exact path={`/:type`} component={BusinessObjectTypeDetails} />
          <Route path={`/:type/Details`} component={ObjectDetails} />
        </Switch>
      </Provider>
    );
  }
}
