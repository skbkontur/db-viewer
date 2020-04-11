import _ from "lodash";

import { Condition } from "../Api/DataTypes/Condition";
import { PropertyMetaInformation } from "../Api/DataTypes/PropertyMetaInformation";
import { TypeMetaInformation } from "../Api/DataTypes/TypeMetaInformation";
import { StringUtils } from "../Utils/StringUtils";

function getTypeName(prevName: string, currentName: string, isArray = false): string {
    return `${prevName !== "" ? prevName + "." : ""}${currentName}${isArray ? ".[]" : ""}`;
}

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
        return _.flatten(props);
    }

    private static getTypes(properties: PropertyMetaInformation[], prevName = ""): PropertyMetaInformation[] {
        const props: PropertyMetaInformation[] = [];
        properties.map(item => {
            if (item.type.isArray) {
                const arrayTypeName = getTypeName(prevName, item.name, true);
                props.push({
                    name: arrayTypeName,
                    isIdentity: false,
                    isSearchable: false,
                    isSortable: false,
                    isRequired: false,
                    availableFilters: [],
                    availableValues: [],
                    type: item.type.genericTypeArguments[0],
                });
                const innerProps = this.getTypes(item.type.genericTypeArguments[0].properties, arrayTypeName);
                if (innerProps != null) {
                    props.push(...innerProps);
                }
            }
            if (item.type.properties.length !== 0 && !item.type.isArray) {
                const innerProps = this.getTypes(item.type.properties, getTypeName(prevName, item.name));
                if (innerProps != null) {
                    props.push(...innerProps);
                }
            } else {
                props.push({
                    ...item,
                    name: getTypeName(
                        prevName,
                        item.name,
                        item.type.genericTypeArguments.length !== 0 && item.type.genericTypeArguments[0].isArray
                    ),
                });
            }
        });

        return _.flatten(props);
    }

    public static getPropertyTypeByPath(type: TypeMetaInformation, path: string[]): PropertyMetaInformation {
        const [first, ...rest] = path;
        const property = type.properties.find(x => x.name === first);
        if (property == null && type.isArray) {
            if (rest.length === 0) {
                return {
                    name: "[]",
                    isIdentity: false,
                    isSearchable: false,
                    isSortable: false,
                    isRequired: false,
                    availableFilters: [],
                    availableValues: [],
                    type: type.genericTypeArguments[0],
                };
            }
            return this.getPropertyTypeByPath(type.genericTypeArguments[0], rest);
        }
        if (property == null) {
            throw new Error(`Unable to find property ${first}`);
        }

        if (rest.length === 0) {
            return property;
        }

        return this.getPropertyTypeByPath(property.type, rest);

        // const arrOfTypes = this.getTypes(properties);
        // console.info(path);
        // const fullPath = path
        //     .map(StringUtils.capitalizeFirstLetter)
        //     .join(".")
        //     .replace(/\[\w+\]/g, "[]");
        // const typeObj = arrOfTypes.find(x => x.name === fullPath);
        // if (typeObj != null) {
        //     return typeObj;
        // }
        //
        // const prePath
        // if (typeObj == null) {
        //     console.info(arrOfTypes);
        //     throw new Error(`Unable to find property ${fullPath}`);
        // }
        // return typeObj;
    }
}
