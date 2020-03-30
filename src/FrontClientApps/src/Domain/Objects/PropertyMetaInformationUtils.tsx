import _ from "lodash";

import { Condition } from "../Api/DataTypes/Condition";
import { PropertyMetaInformation } from "../Api/DataTypes/PropertyMetaInformation";
import { TypeMetaInformation } from "../Api/DataTypes/TypeMetaInformation";
import { StringUtils } from "../Utils/StringUtils";

import { Property, PropertyInfo } from "./Property";

function getTypeName(prevName: string, currentName: string, isArray = false): string {
    return `${prevName !== "" ? prevName + "." : ""}${currentName}${isArray ? ".[]" : ""}`;
}

export class PropertyMetaInformationUtils {
    public static hasFilledRequiredFields(conditions: Condition[], properties: PropertyInfo[]) {
        const required = properties.filter(x => x.isRequired).map(x => x.name);
        for (const property of required) {
            const condition = conditions.filter(x => x.path === property)[0];
            if (StringUtils.isNullOrWhitespace(condition?.value)) {
                return false;
            }
        }
        return true;
    }

    public static getType(type: Nullable<TypeMetaInformation>): Nullable<string> {
        if (type == null) {
            return null;
        }
        if (type.typeName === "Nullable") {
            if (type.genericTypeArguments == null) {
                throw new Error("InvalidProgramState");
            }
            return type.genericTypeArguments[0].typeName;
        }
        return type.typeName;
    }

    public static getProperties(properties: PropertyMetaInformation[], prevName = ""): Property[] {
        const props: Property[] = [];
        properties.map(item => {
            if (item.type != null && item.type.properties != null) {
                props.push(
                    this.getProperties(item.type.properties, prevName ? `${prevName}.${item.name}` : item.name) as any
                );
            } else {
                props.push({
                    ...item,
                    name: prevName ? `${prevName}.${item.name}` : item.name,
                    type: this.getType(item.type),
                });
            }
        });
        return _.flatten(props);
    }

    public static getTypes(
        properties: any | null | undefined | PropertyMetaInformation[],
        prevName = ""
    ): null | undefined | Property[] {
        const props: Property[] = [];
        if (properties == null) {
            return null;
        }
        properties.map((item: any) => {
            if (item.type != null && item.type.isArray && item.type.itemType != null) {
                const innerProps: any = this.getTypes(
                    item.type.itemType.properties,
                    getTypeName(prevName, item.name + ".[]")
                );
                if (innerProps != null) {
                    props.push(innerProps);
                }
            }
            if (item.type != null && item.type.properties != null && !item.type.isArray) {
                const innerProps: any = this.getTypes(item.type.properties, getTypeName(prevName, item.name));
                if (innerProps != null) {
                    props.push(innerProps);
                }
            } else {
                props.push({
                    ...item,
                    name: getTypeName(
                        prevName,
                        item.name,
                        item.type != null && item.type.itemType != null && item.type.itemType.isArray
                    ),
                    type: this.getType(item.type),
                });
            }
        });

        return _.flatten(props);
    }

    public static getPropertyTypeByPath(
        properties: Nullable<PropertyMetaInformation[]>,
        path: string[]
    ): Nullable<Property> {
        const arrOfTypes = this.getTypes(properties);
        let typeObj: Nullable<Property> = null;
        if (arrOfTypes != null) {
            const fullPath = path
                .map(StringUtils.capitalizeFirstLetter)
                .join(".")
                .replace(/[\d+]/g, "");
            typeObj = arrOfTypes.find(x => x.name === fullPath);
        }
        return typeObj;
    }
}
