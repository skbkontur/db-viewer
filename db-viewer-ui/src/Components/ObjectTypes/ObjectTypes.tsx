import { StringUtils } from "@skbkontur/edi-ui";
import { ThemeContext } from "@skbkontur/react-ui";
import groupBy from "lodash/groupBy";
import orderBy from "lodash/orderBy";
import toPairs from "lodash/toPairs";
import React from "react";

import { ObjectIdentifier } from "../../Domain/Api/DataTypes/ObjectIdentifier";

import { ObjectLink } from "./ObjectLink";
import { jsStyles } from "./ObjectTypes.styles";

interface ObjectTypesProps {
    objects: ObjectIdentifier[];
    filter: string;
    identifierKeywords: string[];
}

export function ObjectTypes({ objects, filter, identifierKeywords }: ObjectTypesProps) {
    const theme = React.useContext(ThemeContext);

    const getIdentifierWithoutKeywords = (identifier: string): string => {
        let result = identifier;
        for (const keyword of identifierKeywords) {
            result = result.replace(keyword, "");
        }
        return result;
    };

    const getGrouped = (objects: ObjectIdentifier[]): Array<[string, ObjectIdentifier[]]> => {
        const orderedItems = orderBy(objects, item => getIdentifierWithoutKeywords(item.identifier).toUpperCase());
        const grouped = groupBy(orderedItems, item => getIdentifierWithoutKeywords(item.identifier)[0].toUpperCase());
        return toPairs(grouped);
    };

    const getFiltered = (objects: ObjectIdentifier[], filter: string): ObjectIdentifier[] => {
        return objects.filter(item => StringUtils.checkWordByCase(item.identifier, filter));
    };

    const renderTypes = (objects: ObjectIdentifier[], displayGroups: boolean): React.ReactElement => {
        if (!displayGroups) {
            return (
                <div className={jsStyles.root()} data-tid="ObjectsList">
                    {objects.map(item => (
                        <ObjectLink key={item.identifier} identifier={item.identifier} keywords={identifierKeywords} />
                    ))}
                </div>
            );
        }

        const groupedObjects = getGrouped(objects);
        return (
            <div data-tid="ObjectsList" className={jsStyles.root()}>
                {groupedObjects.map(([firstLetter, identifiers], key) => (
                    <div className={jsStyles.typeGroup()} key={key}>
                        <div className={jsStyles.firstLetter(theme)} data-tid="FirstLetter">
                            {firstLetter}
                        </div>
                        {identifiers.map(item => (
                            <ObjectLink
                                key={item.identifier}
                                identifier={item.identifier}
                                keywords={identifierKeywords}
                            />
                        ))}
                    </div>
                ))}
            </div>
        );
    };

    const renderSchema = (schemaName: string, objects: ObjectIdentifier[]) => {
        const schema = objects[0]?.schemaDescription;
        let filteredObjects = objects;
        const emptyFilter = StringUtils.isNullOrWhitespace(filter);
        if (!emptyFilter) {
            filteredObjects = getFiltered(objects, filter);
        }
        return (
            filteredObjects.length !== 0 && (
                <div data-tid="ObjectGroup" key={schemaName}>
                    <div className={jsStyles.schema(theme)}>
                        <span data-tid="Name">{schemaName}</span>{" "}
                        {schema.allowReadAll && (
                            <span className={jsStyles.indexed()} data-tid="IndexedLabel">
                                indexed
                            </span>
                        )}
                    </div>
                    <div>{renderTypes(filteredObjects, emptyFilter)}</div>
                </div>
            )
        );
    };

    const categorized = groupBy(objects, x => x.schemaDescription.schemaName);
    return (
        <div data-tid="ObjectGroups">
            {Object.keys(categorized).map(schemaName => renderSchema(schemaName, categorized[schemaName]))}
        </div>
    );
}
