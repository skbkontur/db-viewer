import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react";
import * as React from "react";
import { FieldInfo } from "../../api/impl/FieldInfo";
import { FieldType } from "../../api/impl/FieldType";
import ObjectDetailsContent from "./ObjectDetailsContent";

storiesOf("ObjectDetailsContent", module).add("Full", () => {
  const typeInfo: FieldInfo = {
    type: FieldType.Class,
    fields: {
      intField: {
        type: FieldType.Int,
        canBeNull: false,
        meta: {
          name: "intField",
          isIdentity: false,
          availableFilters: null,
          isRequired: false,
          isSearchable: false,
        },
      },
      nullableIntField: {
        type: FieldType.Int,
        canBeNull: true,
        meta: {
          name: "nullableIntField",
          isIdentity: false,
          availableFilters: null,
          isRequired: false,
          isSearchable: false,
        },
      },
      boolField: {
        type: FieldType.Bool,
        canBeNull: false,
        meta: {
          name: "boolField",
          isIdentity: false,
          availableFilters: null,
          isRequired: false,
          isSearchable: false,
        },
      },
      nullableBoolField: {
        type: FieldType.Bool,
        canBeNull: true,
        meta: {
          name: "nullableBoolField",
          isIdentity: false,
          availableFilters: null,
          isRequired: false,
          isSearchable: false,
        },
      },
      stringField: {
        type: FieldType.String,
        meta: {
          name: "stringField",
          isIdentity: false,
          availableFilters: null,
          isRequired: false,
          isSearchable: false,
        },
      },
      nullableDecimalField: {
        type: FieldType.Decimal,
        canBeNull: true,
        meta: {
          name: "nullableDecimalField",
          isIdentity: false,
          availableFilters: null,
          isRequired: false,
          isSearchable: false,
        },
      },
      decimalField: {
        type: FieldType.Decimal,
        canBeNull: false,
        meta: {
          name: "decimalField",
          isIdentity: false,
          availableFilters: null,
          isRequired: false,
          isSearchable: false,
        },
      },
    },
    meta: null,
  };
  return (
    <ObjectDetailsContent
      data={{
        intField: 147,
        boolField: false,
        nullableBoolField: null,
        decimalField: 14.6666,
      }}
      typeInfo={typeInfo}
      onDelete={action("Delete")}
      onSave={action("Save")}
    />
  );
});
