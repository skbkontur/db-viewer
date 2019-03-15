import { storiesOf } from "@storybook/react";
import * as React from "react";
import StoryRouter from "storybook-react-router";
import ObjectsViewer from "./ObjectsViewer";

storiesOf("Application", module)
  .addDecorator(StoryRouter())
  .add("Full", () => (
    <div style={{ padding: 20 }}>
      <ObjectsViewer apiPrefix={"http://localhost:4444/DataBaseViewer/"} />
    </div>
  ));
