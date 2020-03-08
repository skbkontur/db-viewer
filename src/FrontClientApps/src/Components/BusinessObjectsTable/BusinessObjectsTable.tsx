import SortDownIcon from "@skbkontur/react-icons/SortDown";
import SortUpIcon from "@skbkontur/react-icons/SortUp";
import Link from "@skbkontur/react-ui/Link";
import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { Sort } from "Domain/Api/DataTypes/Sort";
import { Object } from "Domain/Api/Object";
import { Property } from "Domain/BusinessObjects/Property";
import { StringUtils } from "Domain/Utils/StringUtils";

import { AdvancedTable } from "../AdvancedTable/AdvancedTable";
import { customRender } from "../BusinessObjectViewer/BusinessObjectItemCustomRender";
import { ConfirmDeleteObjectModal } from "../ConfirmDeleteObjectModal/ConfirmDeleteObjectModal";
import { ScrollableContainer } from "../Layouts/ScrollableContainer";

import cn from "./BusinessObjectsTable.less";

interface BusinessObjectsTableProps {
    items: null | undefined | Object[];
    properties: Property[];
    onChangeSortClick: (name: string) => void;
    onDetailsClick: (item: Object) => string;
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
                        <AdvancedTable.Head data-tid="TableHeader" className={cn("table-header")}>
                            <AdvancedTable.Row className={cn("row")}>
                                {this.renderEmpty(allowDelete ? 2 : 1)}
                                {properties.map((item, key) => this.renderTableHeader(item, key))}
                            </AdvancedTable.Row>
                        </AdvancedTable.Head>
                        <AdvancedTable.Body data-tid="Body">
                            {items.map((item, index) => (
                                <AdvancedTable.Row key={index} className={cn("row")} data-tid="Row">
                                    {this.renderControls(item, index)}
                                    {properties.map(key => this.renderCell(item, key.name))}
                                </AdvancedTable.Row>
                            ))}
                        </AdvancedTable.Body>
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
                <AdvancedTable.HeadCell key={i} className={cn("cell")}>
                    &nbsp;
                </AdvancedTable.HeadCell>
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
        const name = StringUtils.capitalizeFirstLetter(item.name);
        const content = item.indexed ? (
            <Link
                data-tid={`Header_${name}`}
                icon={this.getIcon(name, this.props.currentSort)}
                onClick={() => this.props.onChangeSortClick(name)}>
                {name}
            </Link>
        ) : (
            name
        );

        return (
            <AdvancedTable.HeadCell className={cn("cell", "header-cell")} key={key}>
                {content}
            </AdvancedTable.HeadCell>
        );
    }

    public renderControls(item: Object, index: number): JSX.Element[] {
        const arr: JSX.Element[] = [];
        let key = 0;
        let pathToItem = "";
        if (item) {
            pathToItem = this.props.onDetailsClick(item);
        }
        arr.push(
            <td key={++key} className={cn("cell")}>
                <RouterLink className={cn("link")} to={pathToItem} data-tid="Details">
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

    public renderCell(item: any, key: string): JSX.Element {
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
