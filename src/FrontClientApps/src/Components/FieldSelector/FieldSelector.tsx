import SearchIcon from "@skbkontur/react-icons/Search";
import { Fit, RowStack } from "@skbkontur/react-stack-layout";
import LayoutEvents from "@skbkontur/react-ui/lib/LayoutEvents";
import Checkbox from "@skbkontur/react-ui/Checkbox";
import Input from "@skbkontur/react-ui/Input";
import * as React from "react";
import { TextHighlight } from "Commons/TextHighlight";
import { StringUtils } from "Domain/Utils/StringUtils";

import cn from "./FieldSelector.less";

const MAX_ITEMS_FOR_SPLITTING_BY_2_COLUMNS = 30;

export interface IFieldDefinition {
    name: string;
    caption: string;
}

interface FieldSelectorProps {
    fieldDefinitions: IFieldDefinition[];
    hiddenFields: string[];
    onShowField: (fieldNames: string[]) => void;
    onHideField: (fieldNames: string[]) => void;
    showSelectAllButton?: boolean;
}

interface FieldSelectorState {
    searchText: string;
}

export class FieldSelector extends React.Component<FieldSelectorProps, FieldSelectorState> {
    public state: FieldSelectorState = {
        searchText: "",
    };

    public static defaultProps = {
        showSelectAllButton: false,
    };

    public static filterFieldDefintionsByText(fieldDefinitions: IFieldDefinition[], text: string): IFieldDefinition[] {
        if (!text) {
            return fieldDefinitions;
        }
        return fieldDefinitions.filter(x => x.caption.toLowerCase().includes(text.toLowerCase()));
    }

    public static byColumns<T>(memo: [T[], T[], T[]], item: T, index: number, array: T[]): [T[], T[], T[]] {
        const divisor = array.length > MAX_ITEMS_FOR_SPLITTING_BY_2_COLUMNS ? 3 : 2;
        memo[index % divisor].push(item);
        return memo;
    }

    public handleChangeText(text: string) {
        this.setState({ searchText: text }, () => LayoutEvents.emit());
    }

    public handleToogle(value: boolean, fieldName: string) {
        const { onShowField, onHideField } = this.props;

        if (value) {
            onShowField([fieldName]);
        } else {
            onHideField([fieldName]);
        }
    }

    public handleSelectAll = (filteredFields: IFieldDefinition[]) => {
        const { onShowField, onHideField } = this.props;
        const fields = filteredFields.map(x => x.name);
        if (this.isAllFieldSelected(filteredFields)) {
            onHideField(fields);
        } else {
            onShowField(fields);
        }
    };

    public renderFieldSelector(fieldDefinition: IFieldDefinition, textToHighlight: string): JSX.Element {
        const { hiddenFields } = this.props;

        return (
            <div className={cn("field")} key={fieldDefinition.name + fieldDefinition.caption}>
                <Checkbox
                    data-tid={StringUtils.capitalizeFirstLetter(fieldDefinition.name.replace(".", "_"))}
                    checked={!hiddenFields.includes(fieldDefinition.name)}
                    onChange={(e, checked) => this.handleToogle(checked, fieldDefinition.name)}>
                    <div className={cn("content")}>
                        <TextHighlight text={fieldDefinition.caption} highlight={textToHighlight} />
                    </div>
                </Checkbox>
            </div>
        );
    }

    public isAllFieldSelected = (fieldDefinition: IFieldDefinition[]): boolean => {
        const { hiddenFields } = this.props;
        return !fieldDefinition.map(x => x.name).some(x => hiddenFields.includes(x));
    };

    public render(): JSX.Element {
        const { fieldDefinitions } = this.props;

        const fieldDefinitionsFiltered = FieldSelector.filterFieldDefintionsByText(
            fieldDefinitions,
            this.state.searchText
        );

        const nothingToDisplay = <span className={cn("nothing-to-display")}>Ничего не найдено</span>;
        const textToHighlight = fieldDefinitionsFiltered.length > 1 ? this.state.searchText : "";
        const allFieldsSelected = this.isAllFieldSelected(fieldDefinitionsFiltered);
        return (
            <div className={cn("root")}>
                <Input
                    data-tid="FilterInput"
                    leftIcon={<SearchIcon />}
                    value={this.state.searchText}
                    width={300}
                    onChange={(e, value) => this.handleChangeText(value)}
                />
                {this.props.showSelectAllButton && (
                    <div
                        data-tid={"TypesSelectAll"}
                        onClick={() => this.handleSelectAll(fieldDefinitionsFiltered)}
                        className={cn("select-all")}>
                        {allFieldsSelected ? "Снять выбор с найденных" : "Выбрать все найденные"}
                    </div>
                )}
                <RowStack data-tid="ColumnCheckboxes" className={cn("field-list")} block gap={4}>
                    {fieldDefinitionsFiltered.length === 0 ? <Fit>{nothingToDisplay}</Fit> : null}

                    {fieldDefinitionsFiltered
                        .reduce<[IFieldDefinition[], IFieldDefinition[], IFieldDefinition[]]>(FieldSelector.byColumns, [
                            [],
                            [],
                            [],
                        ])
                        .filter(column => column.some(x => x != null))
                        .map((column, key) => (
                            <Fit key={key}>
                                {column.map(field => field != null && this.renderFieldSelector(field, textToHighlight))}
                            </Fit>
                        ))}
                </RowStack>
            </div>
        );
    }
}
