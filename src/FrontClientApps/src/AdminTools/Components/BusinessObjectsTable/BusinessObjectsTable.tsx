import SortDownIcon from "@skbkontur/react-icons/SortDown";
import SortUpIcon from "@skbkontur/react-icons/SortUp";
import Link from "@skbkontur/react-ui/Link";
import * as React from "react";
import { ButtonLink, RouterLink } from "ui";
import { capitalizeFirstLetter } from "utils";
import { ScrollableContainer } from "Commons/Layouts/ScrollableContainer/ScrollableContainer";
import { BusinessObject } from "Domain/EDI/Api/AdminTools/DataTypes/BusinessObject";
import { Sort } from "Domain/EDI/Api/AdminTools/DataTypes/Sort";

import { Property } from "../../Domain/BusinessObjects/Property";
import {
    AdvancedTable,
    AdvancedTableBody,
    AdvancedTableHead,
    AdvancedTableHeadCell,
    AdvancedTableRow,
} from "../AdvancedTable/AdvancedTable";
import { customRender } from "../BusinessObjectViewer/BusinessObjectItemCustomRender";
import { ConfirmDeleteObjectModal } from "../ConfirmDeleteObjectModal/ConfirmDeleteObjectModal";

import cn from "./BusinessObjectsTable.less";

interface BusinessObjectsTableProps {
    items: null | undefined | BusinessObject[];
    properties: Property[];
    onChangeSortClick: (name: string) => void;
    onDetailsClick: (scopeId: string, id: string) => string;
    onDeleteClick: (index: number) => Promise<void>;
    currentSort: Nullable<Sort>;
    allowDelete: boolean;
}

interface BusinessObjectsTableState {
    showConfirmModal: boolean;
    deletedIndex: number | null;
}

export class BusinessObjectsTable extends React.Component<BusinessObjectsTableProps, BusinessObjectsTableState> {
    public state: BusinessObjectsTableState = {
        showConfirmModal: false,
        deletedIndex: null,
    };

    public componentDidUpdate(prevProps: BusinessObjectsTableProps) {
        if (prevProps.items !== this.props.items) {
            window.scrollTo(0, 0);
        }
    }

    public handleDeleteItem = () => {
        if (this.state.deletedIndex != null) {
            this.props.onDeleteClick(this.state.deletedIndex);
        }
        this.handleCancelDelete();
    };

    public handleCancelDelete = () => {
        this.setState({
            showConfirmModal: false,
            deletedIndex: null,
        });
    };

    public handleConfirmDeletion = (index: number) => {
        this.setState({
            showConfirmModal: true,
            deletedIndex: index,
        });
    };

    public render(): JSX.Element {
        const { items, properties, allowDelete } = this.props;

        return (
            <ScrollableContainer className={cn("table-wrapper")}>
                {this.state.showConfirmModal && (
                    <ConfirmDeleteObjectModal onDelete={this.handleDeleteItem} onCancel={this.handleCancelDelete} />
                )}
                {properties && properties.length && items && items.length ? (
                    <AdvancedTable>
                        <AdvancedTableHead data-tid="TableHeader" className={cn("table-header")}>
                            <AdvancedTableRow className={cn("row")}>
                                {this.renderEmpty(allowDelete ? 2 : 1)}
                                {properties.map((item, key) => this.renderTableHeader(item, key))}
                            </AdvancedTableRow>
                        </AdvancedTableHead>
                        <AdvancedTableBody data-tid="Body">
                            {items.map((item, index) => (
                                <AdvancedTableRow key={index} className={cn("row")} data-tid="Row">
                                    {this.renderControls(item.scopeId, item.id, index)}
                                    {properties.map(key => this.renderCell(item, key.name))}
                                </AdvancedTableRow>
                            ))}
                        </AdvancedTableBody>
                    </AdvancedTable>
                ) : (
                    <div data-tid="NothingFound">Ничего не найдено</div>
                )}
            </ScrollableContainer>
        );
    }

    public renderEmpty(count: number): JSX.Element[] {
        const arr: JSX.Element[] = [];
        for (let i = 0; i < count; i++) {
            arr.push(
                <AdvancedTableHeadCell key={i} className={cn("cell")}>
                    &nbsp;
                </AdvancedTableHeadCell>
            );
        }
        return arr;
    }

    public getIcon(name: string, currentSort: Nullable<Sort>): JSX.Element {
        const dictionary: { [key: string]: JSX.Element } = {
            Ascending: <SortUpIcon />,
            Descending: <SortDownIcon />,
        };
        if (currentSort && currentSort.path === name) {
            return dictionary[currentSort.sortOrder];
        }

        return <SortDownIcon />;
    }

    public renderTableHeader(item: Property, key: number): JSX.Element {
        const name = capitalizeFirstLetter(item.name);
        const content = item.indexed ? (
            <ButtonLink
                data-tid={`Header_${name}`}
                rightIcon={this.getIcon(name, this.props.currentSort)}
                onClick={() => this.props.onChangeSortClick(name)}>
                {name}
            </ButtonLink>
        ) : (
            name
        );

        return (
            <AdvancedTableHeadCell className={cn("cell", "header-cell")} key={key}>
                {content}
            </AdvancedTableHeadCell>
        );
    }

    public renderControls(scopeId: Nullable<string>, id: Nullable<string>, index: number): JSX.Element[] {
        const arr: JSX.Element[] = [];
        let key = 0;
        let disabled = true;
        let pathToItem = "";
        if (scopeId && id) {
            disabled = false;
            pathToItem = this.props.onDetailsClick(scopeId, id);
        }
        arr.push(
            <td key={++key} className={cn("cell")}>
                <RouterLink disabled={disabled} to={pathToItem} data-tid="Details">
                    Подробности
                </RouterLink>
            </td>
        );
        if (this.props.allowDelete) {
            arr.push(
                <td key={++key} className={cn("cell")}>
                    <Link onClick={() => this.handleConfirmDeletion(index)} use="danger" data-tid="Delete">
                        Удалить
                    </Link>
                </td>
            );
        }
        return arr;
    }

    public renderCell(item: mixed, key: string): JSX.Element {
        return (
            <td key={key} className={cn("cell")} data-tid={key}>
                {customRender(item, [
                    key
                        .split(".")
                        .map(x => x[0].toLowerCase() + x.slice(1))
                        .join("."),
                ])}
            </td>
        );
    }
}
