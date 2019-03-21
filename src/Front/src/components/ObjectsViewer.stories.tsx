import { storiesOf } from "@storybook/react";
import * as React from "react";
import { Redirect, Route, Switch } from "react-router";
import StoryRouter from "storybook-react-router";
import ObjectsViewer from "./ObjectsViewer";

storiesOf("Application", module)
  .addDecorator(StoryRouter())
  .add("Full", () => (
    <div style={{ padding: 20 }}>
      <Switch>
        <Route path={"/"} exact render={() => <Redirect to={"/Sample/"} />} />
        <Route
          path={"/Sample/"}
          render={() => (
            <ObjectsViewer apiPrefix={"http://localhost:5555/DBViewer/"} />
          )}
        />
      </Switch>
    </div>
  ));
