import React from "react";

import { Condition } from "../../Domain/Api/DataTypes/Condition";
import { FilterRequirement } from "../../Domain/Api/DataTypes/FilterRequirement";
import { StringUtils } from "../../Domain/Utils/StringUtils";

import { jsStyles } from "./ObjectTable.styles";

interface MissingFiltersProps {
    title: string;
    missingFilters: FilterRequirement[];
}

export function getMissingFilters(
    requiredFilters: FilterRequirement[],
    currentFilters: Condition[]
): FilterRequirement[] {
    const missingFilters: FilterRequirement[] = [];
    for (const filter of requiredFilters) {
        const currentFilter = currentFilters.find(x => x.path === filter.propertyName);
        if (
            !currentFilter ||
            StringUtils.isNullOrWhitespace(currentFilter.value) ||
            filter.availableFilters.indexOf(currentFilter.operator) === -1
        ) {
            missingFilters.push(filter);
        }
    }
    return missingFilters;
}

export function MissingFilters({ title, missingFilters }: MissingFiltersProps): null | JSX.Element {
    return missingFilters.length === 0 ? null : (
        <div>
            {title}
            {missingFilters.map(x => (
                <div key={x.propertyName} className={jsStyles.indent()}>
                    <code className={jsStyles.code()}>{x.propertyName}</code>: {x.availableFilters.join("ИЛИ")}
                </div>
            ))}
        </div>
    );
}

interface MissingSortsProps {
    title: string;
    missingSorts: string[];
}

export function MissingSorts({ title, missingSorts }: MissingSortsProps): null | JSX.Element {
    return missingSorts.length === 0 ? null : (
        <div>
            {title}
            {missingSorts.map(x => (
                <div key={x} className={jsStyles.indent()}>
                    <code className={jsStyles.code()}>{x}</code>
                </div>
            ))}
        </div>
    );
}
