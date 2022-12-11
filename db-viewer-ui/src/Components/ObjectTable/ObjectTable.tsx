import HelpDotIcon from "@skbkontur/react-icons/HelpDot";
import SortDefaultIcon from "@skbkontur/react-icons/SortDefault";
import SortDownIcon from "@skbkontur/react-icons/SortDown";
import SortUpIcon from "@skbkontur/react-icons/SortUp";
import { Tooltip, Link, ThemeContext } from "@skbkontur/react-ui";
import React from "react";

import { Condition } from "../../Domain/Api/DataTypes/Condition";
import { PropertyMetaInformation } from "../../Domain/Api/DataTypes/PropertyMetaInformation";
import { Sort } from "../../Domain/Api/DataTypes/Sort";
import { SortRequirements } from "../../Domain/Api/DataTypes/SortRequirements";
import { ICustomRenderer } from "../../Domain/Objects/CustomRenderer";
import { ConfirmDeleteObjectModal } from "../ConfirmDeleteObjectModal/ConfirmDeleteObjectModal";
import { ScrollableContainer } from "../Layouts/ScrollableContainer";
import { renderForTableCell } from "../ObjectViewer/ObjectItemRender";
import { RouterLink } from "../RouterLink/RouterLink";

import { jsStyles } from "./ObjectTable.styles";
import { getMissingFilters, MissingFilters, MissingSorts } from "./TooltipContent";

interface ObjectTableProps {
    customRenderer: ICustomRenderer;
    items: object[];
    objectType: string;
    properties: PropertyMetaInformation[];
    onChangeSortClick: (name: string) => void;
    onDetailsClick: (item: object) => string;
    onDeleteClick: (index: number) => Promise<void>;
    currentSorts: Sort[];
    currentFilters: Condition[];
    allowDelete: boolean;
    allowSort: boolean;
}

export function ObjectTable({
    customRenderer,
    items,
    objectType,
    properties,
    onChangeSortClick,
    onDetailsClick,
    onDeleteClick,
    currentSorts,
    currentFilters,
    allowDelete,
    allowSort,
}: ObjectTableProps): JSX.Element {
    const [showConfirmModal, setShowConfirmModal] = React.useState(false);
    const [deletedIndex, setDeletedIndex] = React.useState<number | null>(null);
    const theme = React.useContext(ThemeContext);
    React.useEffect(() => window.scrollTo(0, 0), [items]);

    const handleDeleteItem = () => {
        if (deletedIndex != null) {
            onDeleteClick(deletedIndex);
        }
        handleCancelDelete();
    };

    const handleCancelDelete = () => {
        setShowConfirmModal(false);
        setDeletedIndex(null);
    };

    const handleConfirmDeletion = (index: number) => {
        setShowConfirmModal(true);
        setDeletedIndex(index);
    };
    const renderEmpty = (count: number): JSX.Element[] => {
        const arr: JSX.Element[] = [];
        for (let i = 0; i < count; i++) {
            arr.push(
                <th key={i} className={jsStyles.cell()}>
                    &nbsp;
                </th>
            );
        }
        return arr;
    };

    const getIcon = (name: string, currentSort: Sort[]): JSX.Element => {
        const dictionary: { [key: string]: JSX.Element } = {
            Ascending: <SortUpIcon />,
            Descending: <SortDownIcon />,
        };
        const currentSortOrder = currentSort.find(x => x.path === name)?.sortOrder;
        if (currentSortOrder) {
            return dictionary[currentSortOrder];
        }

        return <SortDefaultIcon />;
    };

    const getDisabledText = (requirements: SortRequirements): null | JSX.Element => {
        const missingFilters = getMissingFilters(requirements.requiredFilters, currentFilters);

        const missingSorts: string[] = [];
        for (const sort of requirements.requiredSorts) {
            if (!currentSorts.find(x => x.path === sort)) {
                missingSorts.push(sort);
            }
        }

        if (missingFilters.length === 0 && missingSorts.length === 0) {
            return null;
        }

        return (
            <div>
                <MissingFilters
                    title="Для сортировки должны быть указаны следующие фильтры:"
                    missingFilters={missingFilters}
                />
                <MissingSorts
                    title={
                        missingFilters.length === 0
                            ? "Для сортировки нужно предварительно отсортировать следующие колонки:"
                            : "А также предварительно отсортированы следующие колонки:"
                    }
                    missingSorts={missingSorts}
                />
            </div>
        );
    };

    const renderSortable = (item: PropertyMetaInformation) => {
        const name = item.name;
        const disabledText = getDisabledText(item.requiredForSort);
        const link = (
            <Link
                data-tid={`Header_${name}`}
                icon={getIcon(name, currentSorts)}
                onClick={() => onChangeSortClick(name)}
                disabled={Boolean(disabledText)}>
                {name}
            </Link>
        );
        if (!disabledText) {
            return link;
        }

        return (
            <div>
                {link}
                {"\u00A0"}
                <Tooltip render={() => disabledText} pos="right middle">
                    <Link icon={<HelpDotIcon size={14} />} />
                </Tooltip>
            </div>
        );
    };

    const renderTableHeader = (item: PropertyMetaInformation, key: number, allowSort: boolean): JSX.Element => {
        const name = item.name;
        const content = item.isSortable && allowSort ? renderSortable(item) : name;
        return (
            <th className={`${jsStyles.cell()} ${jsStyles.headerCell()}`} key={key}>
                {content}
            </th>
        );
    };

    const renderControls = (item: object, index: number): JSX.Element[] => {
        const arr: JSX.Element[] = [];
        let key = 0;
        let pathToItem = "";
        if (item) {
            pathToItem = onDetailsClick(item);
        }
        arr.push(
            <td key={++key} className={jsStyles.cell()}>
                <RouterLink to={pathToItem} data-tid="Details">
                    Подробности
                </RouterLink>
            </td>
        );
        if (allowDelete) {
            arr.push(
                <td key={++key} className={jsStyles.cell()}>
                    <Link onClick={() => handleConfirmDeletion(index)} use="danger" data-tid="Delete">
                        Удалить
                    </Link>
                </td>
            );
        }
        return arr;
    };

    const renderCell = (item: any, key: string, type: PropertyMetaInformation): JSX.Element => {
        return (
            <td key={key} className={jsStyles.cell()} data-tid={key}>
                {renderForTableCell(item, [key], type, objectType, customRenderer)}
            </td>
        );
    };

    return (
        <ScrollableContainer className={jsStyles.tableWrapper()}>
            {showConfirmModal && <ConfirmDeleteObjectModal onDelete={handleDeleteItem} onCancel={handleCancelDelete} />}
            {properties.length !== 0 && items.length !== 0 ? (
                <div className={jsStyles.container()}>
                    <table className={jsStyles.table()}>
                        <thead data-tid="TableHeader">
                            <tr className={jsStyles.tableHeaderRow(theme)}>
                                {renderEmpty(allowDelete ? 2 : 1)}
                                {properties.map((item, key) => renderTableHeader(item, key, allowSort))}
                            </tr>
                        </thead>
                        <tbody data-tid="Body">
                            {items.map((item, index) => (
                                <tr key={index} className={jsStyles.row(theme)} data-tid="Row">
                                    {renderControls(item, index)}
                                    {properties.map(key => renderCell(item, key.name, key))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div data-tid="NothingFound">Ничего не найдено</div>
            )}
        </ScrollableContainer>
    );
}
