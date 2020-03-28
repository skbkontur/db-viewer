import _ from "lodash";
import React from "react";
import { Link } from "react-router-dom";

import { BusinessObjectDescription } from "../../Domain/Api/DataTypes/BusinessObjectDescription";
import { StringUtils } from "../../Domain/Utils/StringUtils";

import styles from "./BusinessObjectTypes.less";

interface BusinessObjectTypesProps {
    objects: BusinessObjectDescription[];
    filter: string;
    getPath: (id: string) => string;
}

export class BusinessObjectTypes extends React.Component<BusinessObjectTypesProps> {
    public getGrouped(objects: BusinessObjectDescription[]): Array<[string, BusinessObjectDescription[]]> {
        return _(objects)
            .orderBy(item => item.identifier.toUpperCase())
            .groupBy(item => item.identifier[0].toUpperCase())
            .toPairs()
            .value();
    }

    public getFiltered(objects: BusinessObjectDescription[], filter: string): BusinessObjectDescription[] {
        return objects.filter(item => StringUtils.checkWordByCase(item.identifier, filter));
    }

    public renderIdentifier(identifier: string): string | JSX.Element {
        if (identifier.includes("StorageElement")) {
            const splitByKeyword = identifier.split("StorageElement");
            return (
                <span>
                    {splitByKeyword[0]}
                    <span className={styles.mutedKeyword}>StorageElement</span>
                    {splitByKeyword[1]}
                </span>
            );
        }
        return identifier;
    }

    public renderItem(item: BusinessObjectDescription): JSX.Element {
        const { getPath } = this.props;
        return (
            <div key={item.identifier} data-tid="BusinessObjectItem">
                <Link className={styles.routerLink} to={getPath(item.identifier)} data-tid="BusinessObjectLink">
                    {this.renderIdentifier(item.identifier)}
                </Link>
            </div>
        );
    }

    public renderTypes(objects: BusinessObjectDescription[], displayGroups: boolean): JSX.Element {
        if (!displayGroups) {
            return <div className={styles.root}>{objects.map(item => this.renderItem(item))}</div>;
        }

        const groupedObjects = this.getGrouped(objects);
        return (
            <div className={styles.root}>
                {groupedObjects.map(([firstLetter, identifiers], key) => (
                    <div className={styles.typeGroup} key={key}>
                        <div className={styles.firstLetter} data-tid="FirstLetter">
                            {firstLetter}
                        </div>
                        {identifiers.map(item => this.renderItem(item))}
                    </div>
                ))}
            </div>
        );
    }

    public renderSchema(schemaName: string, objects: BusinessObjectDescription[]) {
        const { filter } = this.props;
        const schema = objects[0]?.schemaDescription;
        let filteredObjects = objects;
        const emptyFilter = StringUtils.isNullOrWhitespace(filter);
        if (!emptyFilter) {
            filteredObjects = this.getFiltered(objects, filter);
        }
        return (
            filteredObjects.length !== 0 && (
                <>
                    <div className={styles.schema}>
                        {schemaName}{" "}
                        {schema.allowReadAll && (
                            <span className={styles.indexed} data-tid="IndexedLabel">
                                indexed
                            </span>
                        )}
                    </div>
                    <div>{this.renderTypes(filteredObjects, emptyFilter)}</div>
                </>
            )
        );
    }

    public render(): JSX.Element {
        const categorized = _.groupBy(this.props.objects, x => x.schemaDescription.schemaName);
        return (
            <>{Object.keys(categorized).map(schemaName => this.renderSchema(schemaName, categorized[schemaName]))}</>
        );
    }
}
