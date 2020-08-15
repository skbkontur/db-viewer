import flatten from "lodash/flatten";

import { Condition } from "../Api/DataTypes/Condition";
import { PropertyMetaInformation } from "../Api/DataTypes/PropertyMetaInformation";
import { TypeMetaInformation } from "../Api/DataTypes/TypeMetaInformation";
import { StringUtils } from "../Utils/StringUtils";

const defaultType: TypeMetaInformation = {
    isNullable: false,
    isArray: false,
    genericTypeArguments: [],
    properties: [],
    typeName: "Object",
    originalTypeName: "Object",
};

const defaultProperty: PropertyMetaInformation = {
    name: "",
    type: defaultType,
    isEditable: true,
    isIdentity: false,
    isSearchable: false,
    isSortable: false,
    isRequired: false,
    availableFilters: [],
    availableValues: [],
};

export class PropertyMetaInformationUtils {
    public static hasFilledRequiredFields(conditions: Condition[], properties: PropertyMetaInformation[]): boolean {
        const required = properties.filter(x => x.isRequired).map(x => x.name);
        for (const property of required) {
            const condition = conditions.filter(x => x.path === property)[0];
            if (StringUtils.isNullOrWhitespace(condition?.value)) {
                return false;
            }
        }
        return true;
    }

    public static getProperties(properties: PropertyMetaInformation[], prevName = ""): PropertyMetaInformation[] {
        const props: PropertyMetaInformation[] = [];
        properties.map(item => {
            if (item.type != null && item.type.properties.length !== 0) {
                props.push(
                    ...this.getProperties(item.type.properties, prevName ? `${prevName}.${item.name}` : item.name)
                );
            } else {
                props.push({
                    ...item,
                    name: prevName ? `${prevName}.${item.name}` : item.name,
                });
            }
        });
        return flatten(props);
    }

    public static getPropertyTypeByPath(type: TypeMetaInformation, path: string[]): PropertyMetaInformation {
        const [first, ...rest] = path;
        const property = type.properties.find(x => x.name === first);
        if (property == null && type.isArray) {
            if (rest.length === 0) {
                return {
                    ...defaultProperty,
                    name: "[]",
                    type: type.genericTypeArguments[type.genericTypeArguments.length - 1],
                };
            }
            return this.getPropertyTypeByPath(type.genericTypeArguments[0], rest);
        }
        if (property == null) {
            return {
                ...defaultProperty,
                name: first,
                type: { ...defaultType, typeName: rest.length === 0 ? "String" : "Object" },
            };
        }

        if (rest.length === 0) {
            return property;
        }

        return this.getPropertyTypeByPath(property.type, rest);
    }
}
