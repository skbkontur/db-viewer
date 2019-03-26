import { storiesOf } from "@storybook/react";
import * as React from "react";
import { Provider } from "react-redux";
import StoryRouter from "storybook-react-router";
import Apis from "../../api/Apis";
import { FakeBusinessObjectsListApi } from "../../api/FakeBusinessObjectsListApi";
import { configureStore } from "../IDBViewerStore";
import TypesList from "./TypesList";
import { TypeModel } from "../../api/impl/TypeModel";

const store = configureStore();
const api = new FakeBusinessObjectsListApi();
Apis.initialize(api);
const types: TypeModel[] = [];
for (let i = 0; i < 20; i++) {
  types.push({
    name: `IndexedObject_${i}`,
    schemaDescription: {
      schemaName: "Indexed",
      countable: true,
      enableDefaultSearch: true,
      defaultCountLimit: null,
      maxCountLimit: null,
    },
    shape: null,
  });
}
for (let i = 0; i < 20; i++) {
  types.push({
    name: `NotIndexedObject_${i}`,
    schemaDescription: {
      schemaName: "BusinessObjectsStorage",
      countable: true,
      enableDefaultSearch: true,
      defaultCountLimit: null,
      maxCountLimit: null,
    },
    shape: null,
  });
}
api.configureTypes(types);

storiesOf("TypesList", module)
  .addDecorator(story => <Provider store={store}>{story()}</Provider>)
  .addDecorator(StoryRouter())
  .add("Full", () => <TypesList />);
