import { storiesOf } from "@storybook/react";
import * as React from "react";
import { Provider } from "react-redux";
import StoryRouter from "storybook-react-router";
import Apis from "../../api/Apis";
import { FakeBusinessObjectsListApi } from "../../api/FakeBusinessObjectsListApi";
import { configureStore } from "../IObjectsViewerStore";
import TypesList from "./TypesList";

const store = configureStore();
const api = new FakeBusinessObjectsListApi();
Apis.initialize(api);
api.configureTypes([
  {
    name: "FirstObject",
    schemaDescription: {
      schemaName: "Indexed",
      countable: true,
      enableDefaultSearch: true,
      defaultCountLimit: null,
      maxCountLimit: null,
    },
    shape: null,
  },
  {
    name: "SecondObject",
    schemaDescription: {
      schemaName: "BusinessObjectsStorage",
      countable: true,
      enableDefaultSearch: true,
      defaultCountLimit: null,
      maxCountLimit: null,
    },
    shape: null,
  },
]);

storiesOf("TypesList", module)
  .addDecorator(story => <Provider store={store}>{story()}</Provider>)
  .addDecorator(StoryRouter())
  .add("Full", () => <TypesList />);
