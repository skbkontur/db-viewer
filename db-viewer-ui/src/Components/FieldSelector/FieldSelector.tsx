import { SearchLoupeIcon16Regular } from "@skbkontur/icons/SearchLoupeIcon16Regular";
import { Fit, RowStack } from "@skbkontur/react-stack-layout";
import { Checkbox, Input, ThemeContext } from "@skbkontur/react-ui";
import { emit as layoutEventsEmit } from "@skbkontur/react-ui/lib/LayoutEvents";
import React from "react";

import { jsStyles } from "./FieldSelector.styles";

const MAX_ITEMS_FOR_SPLITTING_BY_2_COLUMNS = 30;

export interface FieldDefinition {
    name: string;
    caption: string;
}

interface FieldSelectorProps {
    fieldDefinitions: FieldDefinition[];
    hiddenFields: string[];
    onShowField: (fieldNames: string[]) => void;
    onHideField: (fieldNames: string[]) => void;
    showSelectAllButton?: boolean;
}

function filterFieldDefintionsByText(fieldDefinitions: FieldDefinition[], text: string): FieldDefinition[] {
    if (!text) {
        return fieldDefinitions;
    }
    return fieldDefinitions.filter(x => x.caption.toLowerCase().includes(text.toLowerCase()));
}

function byColumns<T>(memo: [T[], T[], T[]], item: T, index: number, array: T[]): [T[], T[], T[]] {
    const divisor = array.length > MAX_ITEMS_FOR_SPLITTING_BY_2_COLUMNS ? 3 : 2;
    memo[index % divisor].push(item);
    return memo;
}

export function FieldSelector({
    fieldDefinitions,
    hiddenFields,
    onShowField,
    onHideField,
    showSelectAllButton,
}: FieldSelectorProps): React.ReactElement {
    const [searchText, setSearchText] = React.useState("");
    const theme = React.useContext(ThemeContext);

    React.useEffect(() => layoutEventsEmit(), [searchText]);

    const isAllFieldSelected = (fieldDefinition: FieldDefinition[]): boolean => {
        return !fieldDefinition.map(x => x.name).some(x => hiddenFields.includes(x));
    };

    const handleToggle = (value: boolean, fieldName: string) => {
        if (value) {
            onShowField([fieldName]);
        } else {
            onHideField([fieldName]);
        }
    };

    const handleSelectAll = (filteredFields: FieldDefinition[]) => {
        const fields = filteredFields.map(x => x.name);
        if (isAllFieldSelected(filteredFields)) {
            onHideField(fields);
        } else {
            onShowField(fields);
        }
    };

    const renderFieldSelector = (fieldDefinition: FieldDefinition): React.ReactElement => {
        return (
            <div className={jsStyles.field()} key={fieldDefinition.name + fieldDefinition.caption}>
                <Checkbox
                    data-tid={fieldDefinition.name.replace(".", "_")}
                    checked={!hiddenFields.includes(fieldDefinition.name)}
                    onValueChange={checked => handleToggle(checked, fieldDefinition.name)}>
                    <div className={jsStyles.fieldContent()}>{fieldDefinition.caption}</div>
                </Checkbox>
            </div>
        );
    };

    const fieldDefinitionsFiltered = filterFieldDefintionsByText(fieldDefinitions, searchText);

    const nothingToDisplay = <span className={jsStyles.nothingToDisplay(theme)}>Ничего не найдено</span>;
    const allFieldsSelected = isAllFieldSelected(fieldDefinitionsFiltered);
    return (
        <div className={jsStyles.root()}>
            <Input
                data-tid="FilterInput"
                leftIcon={<SearchLoupeIcon16Regular />}
                value={searchText}
                width={300}
                onValueChange={setSearchText}
            />
            {showSelectAllButton && (
                <div
                    data-tid={"TypesSelectAll"}
                    onClick={() => handleSelectAll(fieldDefinitionsFiltered)}
                    className={jsStyles.selectAll(theme)}>
                    {allFieldsSelected ? "Снять выбор с найденных" : "Выбрать все найденные"}
                </div>
            )}
            <RowStack data-tid="ColumnCheckboxes" className={jsStyles.fieldList()} block gap={4}>
                {fieldDefinitionsFiltered.length === 0 ? <Fit>{nothingToDisplay}</Fit> : null}

                {fieldDefinitionsFiltered
                    .reduce<[FieldDefinition[], FieldDefinition[], FieldDefinition[]]>(byColumns, [[], [], []])
                    .filter(column => column.some(x => x != null))
                    .map((column, key) => (
                        <Fit key={key}>{column.map(field => field != null && renderFieldSelector(field))}</Fit>
                    ))}
            </RowStack>
        </div>
    );
}
