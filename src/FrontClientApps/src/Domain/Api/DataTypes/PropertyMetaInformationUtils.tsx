import _ from "lodash";
import { Property } from "Domain/BusinessObjects/Property";
import { StringUtils } from "Domain/Utils/StringUtils";

import { PropertyMetaInformation } from "./PropertyMetaInformation";
import { TypeMetaInformation } from "./TypeMetaInformation";

export class PropertyMetaInformationUtils {
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

    public static getProperties(properties: PropertyMetaInformation[], prevName: string = ""): Property[] {
        const props: Property[] = [];
        properties.map(item => {
            if (item.type != null && item.type.properties != null) {
                props.push(this.getProperties(
                    item.type.properties,
                    prevName ? `${prevName}.${item.name}` : item.name
                ) as any);
            } else {
                props.push({
                    name: prevName ? `${prevName}.${item.name}` : item.name,
                    type: this.getType(item.type),
                    indexed: item.indexed,
                });
            }
        });
        return _.flatten(props);
    }

    public static getTypes(
        properties: any | null | undefined | PropertyMetaInformation[],
        prevName: string = ""
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
                    name: getTypeName(
                        prevName,
                        item.name,
                        item.type != null && item.type.itemType != null && item.type.itemType.isArray
                    ),
                    type: this.getType(item.type),
                    indexed: item.indexed,
                });
            }
        });

        return _.flatten(props);
    }

    public static getPropertyTypeByPath(
        properties: Nullable<PropertyMetaInformation[]>,
        path: string[]
    ): Nullable<string> {
        const arrOfTypes = this.getTypes(properties);
        let typeObj: any | null | Property = null;
        if (arrOfTypes != null) {
            const fullPath = path
                .map(StringUtils.capitalizeFirstLetter)
                .join(".")
                .replace(/[\d+]/g, "");
            typeObj = arrOfTypes.find(x => x.name === fullPath);
        }
        return typeObj ? typeObj.type : null;
    }
}

function getTypeName(prevName: string, currentName: string, isArray: boolean = false): string {
    return `${prevName !== "" ? prevName + "." : ""}${currentName}${isArray ? ".[]" : ""}`;
}
