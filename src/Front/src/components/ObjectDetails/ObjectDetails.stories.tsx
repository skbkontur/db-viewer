import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react";
import * as React from "react";
import { PrimitiveType } from "../../api/impl/PrimitiveType";
import { Property } from "../../api/impl/Property";
import { TypeInfo } from "../../api/impl/TypeInfo";
import ObjectDetailsContent from "./ObjectDetailsContent";

const createProperty = (typeInfo: TypeInfo, name: string): Property => ({
  typeInfo,
  description: {
    name,
    isIdentity: false,
    availableFilters: null,
    isRequired: false,
    isSearchable: false,
    isSortable: false,
  },
});

storiesOf("ObjectDetailsContent", module).add("Full", () => {
  const intProperty: Property = createProperty(
    {
      type: PrimitiveType.Int,
      canBeNull: false,
    },
    "intField"
  );
  const typeInfo: TypeInfo = {
    type: PrimitiveType.Class,
    properties: [
      createProperty(
        {
          type: PrimitiveType.Class,
          properties: [intProperty],
        },
        "classProperty"
      ),
      createProperty(
        {
          type: PrimitiveType.Dictionary,
          key: intProperty.typeInfo,
          value: intProperty.typeInfo,
        },
        "dictionaryProperty"
      ),
      createProperty(
        {
          type: PrimitiveType.Enumerable,
          underlyingType: intProperty.typeInfo,
        },
        "arrayProperty"
      ),
      createProperty(
        {
          type: PrimitiveType.HashSet,
          underlyingType: intProperty.typeInfo,
        },
        "hashsetProperty"
      ),
      createProperty(
        {
          type: PrimitiveType.Int,
          canBeNull: false,
        },
        "intField"
      ),
      createProperty(
        {
          type: PrimitiveType.Int,
          canBeNull: true,
        },
        "nullableIntField"
      ),
      createProperty(
        {
          type: PrimitiveType.Bool,
          canBeNull: false,
        },
        "boolField"
      ),
      createProperty(
        {
          type: PrimitiveType.Bool,
          canBeNull: true,
        },
        "nullableBoolField"
      ),
      createProperty(
        {
          type: PrimitiveType.String,
        },
        "stringField"
      ),
      createProperty(
        {
          type: PrimitiveType.Decimal,
          canBeNull: false,
        },
        "decimalField"
      ),
      createProperty(
        {
          type: PrimitiveType.Decimal,
          canBeNull: true,
        },
        "nullableDecimalField"
      ),
      createProperty(
        {
          type: PrimitiveType.DateTime,
          canBeNull: false,
        },
        "dateTimeUtcField"
      ),
      createProperty(
        {
          type: PrimitiveType.DateTime,
          canBeNull: false,
        },
        "dateTimeCustomField"
      ),
    ],
  };
  return (
    <ObjectDetailsContent
      data={{
        classField: {
          intField: 17,
        },
        intField: 147,
        boolField: false,
        nullableBoolField: null,
        decimalField: 14.6666,
        dateTimeUtcField: "2016-11-30T23:05:10Z",
        dateTimeCustomField: "18.08.2019 12:15:41.457",
      }}
      typeInfo={typeInfo}
      onDelete={action("Delete")}
      onSave={action("Save")}
    />
  );
});
