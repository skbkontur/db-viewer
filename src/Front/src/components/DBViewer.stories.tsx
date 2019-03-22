import { storiesOf } from "@storybook/react";
import * as React from "react";
import { Redirect, Route, Switch } from "react-router";
import StoryRouter from "storybook-react-router";
import DBViewer from "./DBViewer";

storiesOf("Application", module)
  .addDecorator(StoryRouter())
  .add("Full", () => (
    <div style={{ padding: 20 }}>
      <Switch>
        <Route path={"/"} exact render={() => <Redirect to={"/Sample/"} />} />
        <Route
          path={"/Sample/"}
          render={() => (
            <DBViewer apiPrefix={"http://localhost:5555/DBViewer/"} allowEdit />
          )}
        />
      </Switch>
    </div>
  ));
