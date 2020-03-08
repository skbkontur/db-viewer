import _ from "lodash";
import React from "react";
import { Link } from "react-router-dom";
import { BusinessObjectDescription } from "Domain/Api/DataTypes/BusinessObjectDescription";
import { StringUtils } from "Domain/Utils/StringUtils";

import cn from "./BusinessObjectTypes.less";

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
                    <span className={cn("muted-keyword")}>StorageElement</span>
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
                <Link className={cn("link")} to={getPath(item.identifier)} data-tid="BusinessObjectLink">
                    {this.renderIdentifier(item.identifier)}
                </Link>{" "}
                {item.mySqlTableName && (
                    <span className={cn("indexed")} data-tid="IndexedLabel">
                        indexed
                    </span>
                )}
            </div>
        );
    }

    public render(): JSX.Element {
        const { objects, filter } = this.props;
        if (!StringUtils.isNullOrWhitespace(filter)) {
            const filteredObjects = this.getFiltered(objects, filter);
            return <div className={cn("root")}>{filteredObjects.map(item => this.renderItem(item))}</div>;
        }
        const groupedObjects = this.getGrouped(objects);
        return (
            <div className={cn("root")}>
                {groupedObjects.map(([firstLetter, identifiers], key) => [
                    <div className={cn("first-letter")} data-tid="FirstLetter" key={key}>
                        {firstLetter}
                    </div>,
                    identifiers.map(item => this.renderItem(item)),
                ])}
            </div>
        );
    }
}
